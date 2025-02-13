# 使用 Redis 做预扣减操作

在电商系统中的下单操作中，为了把库存的“临时占用”和“正式售出”解耦，并支持库存回补功能，在 Redis 中新增了一个预扣库存的 key。同时也在 MySQL 的库存中新增一个预扣减字段。

- 可用库存 key：`product:stock:{productId}` 用户可见的值
- 预扣库存 key：`product:prelock:{productId}`

## 下单逻辑

当用户下单时，先在 Redis 把预扣减库存值加 1，并把可用库存值减 1。其他用户可见的值是可用库存里的值。这里使用 lua 脚本保证原子性。

```lua
-- KEYS[1]: 可用库存Key（product:stock:1001）
-- KEYS[2]: 预扣库存Key（product:prelock:1001）
-- KEYS[3]: 订单预扣记录Key（order:prelock:1001）
-- ARGV[1]: 扣减数量（通常为1）
-- ARGV[2]: 订单预扣记录的过期时间（秒）

local availableStock = tonumber(redis.call('GET', KEYS[1])) or 0
local deductQty = tonumber(ARGV[1])
local prelockKey = KEYS[3]
local prelockExpireTime = tonumber(ARGV[2])

if availableStock >= deductQty then
    -- 扣减可用库存，增加预扣库存
    redis.call('DECRBY', KEYS[1], deductQty)
    redis.call('INCRBY', KEYS[2], deductQty)

    -- 创建订单预扣记录Key并设置过期时间
    redis.call('SET', prelockKey, '1')
    redis.call('EXPIRE', prelockKey, prelockExpireTime)

    return 1  -- 成功
else
    return 0  -- 库存不足
end
```

## 付款后逻辑

当用户付款后，代表这个库存正式售出了，需要把预扣减库存减 1。

```lua
-- KEYS[1]: 订单预扣记录 Key（order:prelock:1001）
-- KEYS[2]: 预扣库存Key（product:prelock:1001）
local qty = redis.call('HGET', KEYS[1], 'qty') or 0
redis.call('DECR', qtr) -- 预扣减库存减 1
redis.call('DEL', KEYS[1])  -- 清理记录
```

## 库存回补逻辑

库存回补可能发生在订单超时，或者用户取消下单。这时要根据订单 id 来将这次订单中预扣减的库存加到可用库存中。这里也要使用 lua 脚本保证原子性。

```lua
-- KEYS[1]: 订单预扣记录 Key（order:prelock:1001）
-- KEYS[2]: 可用库存 Key
-- KEYS[3]: 预扣库存 Key
local qty = redis.call('HGET', KEYS[1], 'qty') or 0
redis.call('INCRBY', KEYS[2], qty)
redis.call('DECRBY', KEYS[3], qty)
redis.call('DEL', KEYS[1])  -- 清理记录
```

## 加锁安全措施

为了防止订单超时与支付完成同时触发，这里要使用分布式锁来保证线程安全。分布式锁的使用这个订单的 id 就可。

```java
// 下面是支付逻辑，回补逻辑也是一样的获取锁流程
String lockKey = "lock:order:" + orderId;
String requestId = UUID.randomUUID().toString();
// 尝试获取锁（设置超时时间）
boolean locked = redisTemplate.opsForValue().setIfAbsent(lockKey, requestId, 3, TimeUnit.SECONDS);
if (locked) {
    try {
        // 执行支付逻辑（Lua脚本扣减预扣库存）
    } finally {
        // 释放锁（需校验requestId，避免误删）
        String script = "if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end";
        redisTemplate.execute(new DefaultRedisScript<>(script, Long.class), List.of(lockKey), requestId);
    }
} else {
    // 获取锁失败，提示重试
}
```

## 幂等性

为了防止用户多次点击下单按钮，我们要做好幂等处理。

```lua
-- KEYS[1]: 幂等性Key，如 idempotent:order:{orderId}:{operationType}
-- 检查是否已处理过该请求
if redis.call('SET', KEYS[1], 1, 'NX', 'EX', 3600) then
    -- 执行库存操作
else
    return 0  -- 重复请求，直接返回
end
```

## 提升性能

为了提高应用扣减库存的性能，我们可以采用分段的方式，将整个的库存分成多个小片段分散到不同的 key 中，降低对单个 key 的竞争压力。

## MQ 削峰

为了防止下单请求量太大，导致 MySQL 压力过大，采用 MQ 削峰处理，使用 MQ 延时任务，减轻数据库扣减库存的压力。如每 5s 消费一次扣减库存的任务请求。

```java
// 消息属性
{
    "orderId": "ORDER_1001", // 订单 ID（唯一标识）
    "productId": 1001, // 商品 ID
    "operation": "DEDUCT", // 操作类型（DEDUCT=扣减库存，ROLLBACK=回补库存）
    "quantity": 1, // 操作数量
    "timestamp": 1630000000000, // 消息生成时间戳（用于处理乱序消息）
    "retryCount": 0 // 重试次数（初始为 0）
}
```

还可以在数据库中创建 task 任务表，通过定时扫描 task 任务表对执行失败的 MQ 任务进行重试。作为兜底。
