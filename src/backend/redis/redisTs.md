# Redis 事务

Redis 事务不同于关系型数据库（如 MySQL）的事务。Redis 事务不能保证原子性，也许可以达到保证持久性的要求。为什么这么说？

## 原子性？持久性？

1. 关于原子性问题：一用“MULTI”开启了一个事务，然后写了很多 Redis 命令，然后“EXEC”提交事务。这其中的很多命令里，可以正确执行的就正确执行，出错的就在那错着，反正也不管，然后还不回滚。
2. 关于持久性问题：首先我们要了解一下 Redis 的持久化机制，有三点 RDB、AOF 和 RDB 与 AOF 的混合持久化。
   - RDB 持久化方式的实时性没有那么好，Redis 挂了容易丢失数据。
   - AOF 相比会更加保险一些，但 AOF 也不一定保证数据持久性，因为 AOF 会在每次执行更改 Redis 数据的命令时，会将该命令写到 AOF 缓冲区中。而这也就是问题所在，因为有不同的 AOF 文件刷盘策略（fsync 策略）其分别是：
   ```
   appendfsync always    #每次有数据修改发生时都会调用fsync函数同步AOF文件,fsync完成后线程返回,这样会严重降低Redis的速度
   appendfsync everysec  #每秒钟调用fsync函数同步一次AOF文件
   appendfsync no        #让操作系统决定何时进行同步，一般为30秒一次
   ```
   所以说只有我们把 fsync 策略设置成 always，才可以满足事务的持久性。否则也不会保证持久性

## Redis 事务有什么用？

由于 Redis 执行命令是采用单线程的，所以当有多个客户端都在使用这个 Redis 服务端。那么就有可能某个 Redis 客户端执行一套命令时，其中被其他客户端插入了其他命令，可能会对这一套命令的结果产生影响。所以用 Redis 事务可以保证事务中的所有命令就是按照这个顺序执行的，中间不会被其他客户端插入命令。
