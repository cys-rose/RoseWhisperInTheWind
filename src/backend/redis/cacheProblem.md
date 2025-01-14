# 缓存问题三剑客

## 缓存穿透

缓存穿透是说有大量恶意攻击，请求的我们的缓存中没有的数据，但其实数据库中也没有。但是因为缓存中没有数据，按理要打到数据库中，又因请求数量太多导致数据库宕机。

### 解决方案

1. 允许缓存空数据，但是要设置一个过期时间。
2. 使用布隆过滤器（提前预热一次布隆过滤器）。布隆过滤器是一个位图数组+几个哈希函数来计算 key 的好东西。但这时需要根据布隆过滤器的结果进行判断：
   1. 如果布隆过滤器中没有，那么数据库中一定也没有。
   2. 如果布隆过滤器中有，那么数据库中可能会有，但是也可能是哈希冲突。这时就放行让请求去查缓存和数据库。但其实布隆过滤器出现哈希冲突的概率挺低的。

## 缓存击穿

缓存击穿是热点 key 问题，在集中式高并发访问的情况下，缓存中热点 key 过期或失效。导致大量请求打到数据库中而使数据库宕机。

### 解决方案

其实这要看你的热点 key 的业务情况是如何的了。

1. 如果这个热点 key 是几乎不或很少被修改的，可以选择不给其设置 ttl。
2. 如果其更新不频繁且缓存刷新的整个流程耗时较少的情况下，可以选择逻辑过期+分布式锁来进行更新。
3. 如果其更新频繁或者在缓存刷新的流程耗时较长的情况下，可以选择定时任务在 key 过期前进行更新，或者进行延期操作。

## 缓存雪崩

缓存雪崩是指大量缓存 key 同时过期，很有可能是因为自己的缓存服务宕机了。然后大量请求打到了数据库，导致数据库也宕机了！可怜的数据库，为什么受伤的总是你！

### 解决方案

雪崩前：Redis 主从+哨兵，Redis Cluster 实现高可用，同时要开启 Redis 持久化。
雪崩中：采用本地缓存，使用 hystrix 限流+降级，保护数据库。（限流是说让每秒的请求量限制在多少以下，然后多出的请求走降级流程。也就是说返回一直默认的友好提示，或空值）如果采用限流后就可以保证数据库不会被打到宕机，这样就很好了！对于用户来说就多刷新几次也许就展示出结果了。
雪崩后：一旦重启 Redis，立马先根据持久化数据重建缓存。
