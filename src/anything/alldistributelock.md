# 分布式锁

首先先介绍本地锁是如何使用的，以及本地锁有什么问题。如果我们使用的是 SpringBoot 框架，我们一般会在`service`层做一些业务逻辑操作，如扣减库存！那么如何防止超卖呢？下面是样例代码：

## 如何扣减库存是在 MySQL 中

```java
@Service
public class StockService {

    @Autowired
    private StockMapper stockMapper;

    ReentrantLock lock = new ReentrantLock();

    // public void synchronized void deduct(String productId)
    public void deduct(String productId) {
        try{
            lock.lock();
            Stock stock = stockMapper.getStock();
            stock.setCount(stock.getCount() - 1);
            stockMapper.updateStock(stock);
        } finally{
            lock.unlock();
        }
    }
}
```

上面这样做有什么问题？什么情况下会导致锁失效？

1. 如果这个 StockService 被设置成多例的，那么每个线程都会创建出一个新的 StockService 实例
2. 如果使用`@Transaction`注解，当启用数据库事务后，就有可能出现一个线程扣减完库存释放锁后，没来得及提交事务前。另一个线程成功拿到了锁并扣减库存（因为上一个事务没有提交导致这次扣减前的值与上次扣减前的值是一样的）但因 MySQL 的事务隔离机制是可重复读，导致超卖。
3. 集群部署多个后端服务会使本地锁失效

如何解决这三个问题呢？

### 写成一条 sql

将上面整个扣减流程写到一个 sql 语句中，因为 MySQL 在 update、insert、delete 的时候，会使用表锁或行锁，所以可以保证并发下的线程安全。但这现实中是不可行的，因为一般扣减库存肯定不是一个 sql 语句就能做到的，而且我们也无法拿到扣减库存的前后状态。所以还得往下看！

### 悲观锁

1. 悲观锁 `select xxx for update`
   悲观锁中如何保障使用的是行级锁？
   - 条件中的字段是索引字段
   - 条件使用的是具体值，如 = xxx

```java
@Service
public class StockService {

    @Autowired
    private StockMapper stockMapper;

    ReentrantLock lock = new ReentrantLock();

    @Transaction
    public void deduct(String productId) {
        // 查询库存并锁定库存信息
        Stock stock = stockMapper.selectStock();
        // 判断库存充足
        if(stock != null && stock.getCount() > 1) {
            stock.setCount(stock.getCount() - 1);
            stockMapper.updateStock(stock);
        }
    }
}

@Mapper
public interface StockMapper {
    @Select("select * from stock where product_id = #{productId} for update")
    Stock selectStock(String productId);
}
```

悲观锁的问题？

1. 性能问题
2. 死锁问题：连接 a 占用 id=1 的锁想要给 id=2 加锁，而连接 b 占用 id=2 的锁想要给 id=1 加锁，就会造成死锁。
3. 库存操作要统一：扣减库存时不能 select xxx' for update 与普通 select 一起使用，因为 select xxx' for update 不能锁住普通 select。

### 乐观锁

CAS + 版本号：每当修改数据后更新版本号

缺点：

1. 不能使用`@Transaction`，当一个事务开启后，修改操作会对数据加锁，导致其他线程阻塞，而因为 CAS 要不断重试导致其他线程一直拿不到锁，导致数据库连接超时错误。
2. 高并发情况下性能特别低。
3. 只要用 CAS 就可能出现 ABA 问题
4. 读写分离情况下导致乐观锁不可靠，因为从库更新数据时有延迟，所以不一定能及时读到最新数据

## 如果扣减库存是在 Redis 中

### Redis 乐观锁

1. 先了解几个命令：watch，multi，exec

- watch：监听一个或多个 key，在执行 exec 之前，如果有被监听的 key 被修改了，那么整个事务（从 multi 到 exec）都会执行失败。
- multi：标记事务的开始
- exec：执行事务

2. 其整体流程大致是这样：先通过 watch 监听这个库存 key，然后在开启 Redis 事务(multi)，然后执行事务（exec）。如果事务返回的结果为 nil（代表事务执行失败）进行重试。

缺点：性能极差

### 分布式锁

特征：

1. 独占排他使用
2. 防止死锁：加过期时间
3. 原子性：获取锁与设置过期时间是原子的
4. 防止误删：哪个线程创建的线程由哪个删除，可以给锁加一个唯一标识
5. 可重入
6. 自动续期

#### Redis 分布式锁

1. 通过 set k v ex 30 nx 命令 (setnx 不支持过期时间)
2. 通过 lua 脚本 + hash 数据模型实现可重入锁
3. 通过 lua 脚本 + timer 定时器实现自动续期

```java
@Service
public class StockService {

    @Autowired
    private RedisTemplate redisTemplate;

    public void deduct(String productId) {
        UUID uuid = UUID.randomUUID();
        String lockKey = "lock:" + productId;
        while(!redisTemplate.opsForValue().setIfAbsent(lockKey, uuid, 10, TimeUnit.SECONDS)) {
            try{
                Thread.sleep(100);
            }catch (Exception e) {
                e.printStackTrace();
            }
        }
        try{
            String count = redisTemplate.opsForValue().get("stock").toString();
            if(count != null && Integer.parseInt(count) > 0) {
                int stockLeft = Integer.parseInt(count) - 1;
                redisTemplate.opsForValue().set("stock", stockLeft);
            }
        }catch (Exception e) {
            e.printStackTrace();
        }finally{
            // 这段应该用 lua 脚本保证原子性
            if(StringUtils.equals(redisTemplate.opsForValue().get(lockKey), uuid)) {
                redisTemplate.delete(lockKey);
            }
        }
    }
}
```

#### RedLock 算法

使用 RedLock 时，是多个独立的 Redis 主节点，每个 Redis 节点没有从节点。

1. 应用程序获取系统当前时间
2. 应用程序使用相同的 kv 依此从每个 Redis 节点获取锁，如果一个节点超过一定时间依然没有获取到锁，则放弃。然后从下一个 Redis 节点尝试获取锁
3. 计算获取锁的耗时：所有 Redis 节点都尝试获取后的系统时间减去步骤一中的消耗时间。这个过程的耗时要大于锁的 ttl，并且要有超过半数以上的节点都获取到锁，才认为获取锁成功。
4. 计算锁剩余的有效时间
5. 如果获取锁失败后，对所有的 Redis 节点释放锁。

#### Redisson

1. 在 Redisson 中也提供了可重入锁并且可以自动锁续期，原理如下

```java
    // RedissonLock类中
    <T> RFuture<T> tryLockInnerAsync(long waitTime, long leaseTime, TimeUnit unit, long threadId, RedisStrictCommand<T> command) {
        return this.commandExecutor.syncedEval(this.getRawName(), LongCodec.INSTANCE, command,
            "if ((redis.call('exists', KEYS[1]) == 0) or (redis.call('hexists', KEYS[1], ARGV[2]) == 1))
                then redis.call('hincrby', KEYS[1], ARGV[2], 1);
                redis.call('pexpire', KEYS[1], ARGV[1]); return nil;
            end;
            return redis.call('pttl', KEYS[1]);",
        Collections.singletonList(this.getRawName()), new Object[]{unit.toMillis(leaseTime), this.getLockName(threadId)});
    }

    // 自动续期
    protected void scheduleExpirationRenewal(long threadId) {
        ExpirationEntry entry = new ExpirationEntry();
        ExpirationEntry oldEntry = (ExpirationEntry)EXPIRATION_RENEWAL_MAP.putIfAbsent(this.getEntryName(), entry);
        if (oldEntry != null) {
            oldEntry.addThreadId(threadId);
        } else {
            entry.addThreadId(threadId);

            try {
                this.renewExpiration();
            } finally {
                if (Thread.currentThread().isInterrupted()) {
                    this.cancelExpirationRenewal(threadId);
                }
            }
        }
    }

    private void renewExpiration() {
        ExpirationEntry ee = (ExpirationEntry)EXPIRATION_RENEWAL_MAP.get(this.getEntryName());
        if (ee != null) {
            // 创建一个Timer定时器，定时执行续期任务
            Timeout task = this.getServiceManager().newTimeout(new TimerTask() {
                public void run(Timeout timeout) throws Exception {
                    ExpirationEntry ent = (ExpirationEntry)RedissonBaseLock.EXPIRATION_RENEWAL_MAP.get(RedissonBaseLock.this.getEntryName());
                    if (ent != null) {
                        Long threadId = ent.getFirstThreadId();
                        if (threadId != null) {
                            CompletionStage<Boolean> future = RedissonBaseLock.this.renewExpirationAsync(threadId);
                            future.whenComplete((res, e) -> {
                                if (e != null) {
                                    RedissonBaseLock.log.error("Can't update lock {} expiration", RedissonBaseLock.this.getRawName(), e);
                                    RedissonBaseLock.EXPIRATION_RENEWAL_MAP.remove(RedissonBaseLock.this.getEntryName());
                                } else {
                                    if (res) {
                                        RedissonBaseLock.this.renewExpiration();
                                    } else {
                                        RedissonBaseLock.this.cancelExpirationRenewal((Long)null);
                                    }
                                }
                            });
                        }
                    }
                }
            }, this.internalLockLeaseTime / 3L, TimeUnit.MILLISECONDS);
            ee.setTimeout(task);
        }
    }
```

2. 同时 Redisson 还提供了公平锁

```java
public testFairLock() throws InterruptedException {
    RLock fairLock = this.redissonClient.getFairLock("fairLock");
    fairLock.lock();
    System.out.println("加公平锁成功");
    fairLock.unlock();
}
```

3. 联锁
   联锁就是把多个 Redisson 实例的多个 RLock 整合成一个锁，只有这些锁都加锁成功后才算加锁成功。所以当一个 Redisson 实例宕机整个联锁就无法使用。

4. Reddison 红锁
   Reddison 红锁就是把多个 Redisson 实例的多个 RLock 整合成一个锁，只有半数以上的节点加锁成功后才算加锁成功。比联合锁更好。
5. 读写锁
   只有读读可并发，读写、写写不可并发。Redisson 不支持读锁升级，所以当一个线程获得读锁后，其他线程或自己想获得写锁时，都要进行阻塞，等读锁释放。

```java
    public static void main(String[] args) {
        // 获取读写锁
        RReadWriteLock rwLock = redisson.getReadWriteLock("myLock");

        // 获取读锁
        rwLock.readLock().lock();

        // 获取写锁
        rwLock.writeLock().lock();
    }
```

6. RSemaphore 信号量
   与 JUC 的 Semaphore 功能类似

```java
    public void testSemaphore() throws InterruptedException {
        RSemaphore semaphore = redisson.getSemaphore("semaphore");
        semaphore.trySetPermits(3);
        semaphore.acquire();
        System.out.println("获取信号量");
        System.out.println("操作完成，释放信号量");
        semaphore.release();
    }
```

7. RCountDownLatch
   与 JUC 的 CountDownLatch 功能类似

#### 基于 MySQL 实现分布式锁

通过唯一键索引。创建出一张表，只有 id 和 lock_name 字段，lock_name 字段是唯一键索引。

1. 通过`insert into db_lock(lock_name) values('mylock') `来尝试获取分布式锁，如果 insert 成功则代表获取锁成功。
2. 通过 delete 命令进行删除操作。
3. 重试：通过线程 sleep + 递归调用进行重试。

存在的问题：

1. 宕机后，锁无法释放：给锁表新增 lock_time 字段，记录锁的过期时间，过期后其他线程可以获得这个锁。
2. 可重入：添加 count 字段并且记录 服务器 id，线程 id 来进行锁重入。
3. 防止误删：根据锁表的 id（唯一）寻找锁，来确保这个锁是自己的。
4. 自动续期：通过定时任务，每隔一段时间去重置过期时间。
5. 防止 MySQL 单机宕机，可以使用主从。
