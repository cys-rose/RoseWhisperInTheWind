# Executor

MyBatis 中每次想要操作数据库都要建立一个 SqlSession，然后才能进行操作。可为了让类的职责更加清晰、单一。MyBatis 中增加了 Executor 这一模块，其用来执行数据库操作，或是说为操作数据库做准备并对结果进行处理（因为真正的执行 Sql 还是在 StatementHandler 中）。那我们先来了解一些这个 Executor 模块吧，其中的设计模式还是很有意思的。

## 有哪些 Executor 呢

![Executor中的结构](./image/各个Executor之间的关系.png)

- BaseExecutor 是一个抽象类，里面封装了一级缓存的操作
- SimpleExecutor 是执行器的默认实现，没有什么花里胡哨的操作。
- ReuseExecutor 对相同的 Sql 调用重用，免去重建 MappedStatement 的过程。
- BatchExecutor 可以批量执行 Sql。

## 执行流程是什么样的呢

我这里只给大家介绍了 SqlSession 中使用 SimpleExecutor 的流程，其实使用其他的 Executor 实现类也是一样的过程。
![Executor执行流程](./image/Executor执行流程.png)

- 所以说其实最终是落到了具体的 Executor 实现类上，由其执行`doQuery()`方法
- CacheExecutor 和 BaseExecutor 的设计不得不说真的太巧妙了，把一级缓存和二级缓存完美地衔接在一起!

## Executor 有什么用？

三个主要功能：改、查、缓存

```java
public interface Executor {

    ResultHandler NO_RESULT_HANDLER = null;

    int update(MappedStatement ms, Object parameter) throws SQLException;

    <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException;

    <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler) throws SQLException;

    Transaction getTransaction();

    void commit(boolean required) throws SQLException;

    void rollback(boolean required) throws SQLException;

    void close(boolean forceRollback);

    // 清理Session缓存
    void clearLocalCache();

    // 创建缓存 Key
    CacheKey createCacheKey(MappedStatement ms, Object parameterObject, RowBounds rowBounds, BoundSql boundSql);

    void setExecutorWrapper(Executor executor);
}
```

## SimpleExecutor 都干了什么？

作为 Executor 的默认实现，其功能也是很简单的。见方法名知其意，如下：就是包括了查找和修改操作。

```java
public class SimpleExecutor extends BaseExecutor{

    public SimpleExecutor(Configuration configuration, Transaction transaction) {
        super(configuration, transaction);
    }

    @Override
    protected <E> List<E> doQuery(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) {
        Statement stmt = null;
        try {
            Configuration configuration = ms.getConfiguration();
            // 新建一个 StatementHandler
            StatementHandler handler = configuration.newStatementHandler(wrapper, ms, parameter, rowBounds, resultHandler, boundSql);
            // 准备语句
            stmt = prepareStatement(handler);
            // 返回结果
            return handler.query(stmt, resultHandler);
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    protected int doUpdate(MappedStatement ms, Object parameter) throws SQLException {
        Statement stmt = null;
        try {
            Configuration configuration = ms.getConfiguration();
            // 新建一个 StatementHandler
            StatementHandler handler = configuration.newStatementHandler(this, ms, parameter, RowBounds.DEFAULT, null, null);
            // 准备语句
            stmt = prepareStatement(handler);
            // StatementHandler.update
            return handler.update(stmt);
        } finally {
            closeStatement(stmt);
        }
    }

    private Statement prepareStatement(StatementHandler handler) throws SQLException {
        Statement stmt;
        Connection connection = transaction.getConnection();
        // 创建StatementHandler对象
        stmt = handler.prepare(connection);
        handler.parameterize(stmt);
        return stmt;
    }
}
```

咦？那缓存功能呢？

## BaseExecutor 都干了什么？

BaseExecutor 是一个抽象类，所以说它提取出了各个子类的共同特征，比如查询方法、修改方法、还有一级缓存。我认为 BaseExecutor 最值得学习的就是这个抽象类的设计（思想），考虑的也非常精妙，简直是完美的代码。

```java
public abstract class BaseExecutor implements Executor{

    // 一级缓存
    protected PerpetualCache localCache;

    @Override
    public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler,CacheKey key, BoundSql boundSql)throws SQLException {
        if (closed) {
            throw new RuntimeException("Executor was closed.");
        }
        // 清理局部缓存，查询堆栈为0则清理。queryStack 避免递归调用清理
        if (queryStack == 0 && ms.isFlushCacheRequired()) {
            clearLocalCache();
        }
        List<E> list;
        try {
            queryStack++;
            // 根据cacheKey从localCache中查询数据 一级缓存中有无
            list = resultHandler == null ? (List<E>) localCache.getObject(key) : null;
            if (list == null) {
                // 同时有保存到一级缓存的动作
                list = queryFromDatabase(ms, parameter, rowBounds, resultHandler, key, boundSql);
            }
        } finally {
            queryStack--;
        }
        if (queryStack == 0) {
            if (configuration.getLocalCacheScope() == LocalCacheScope.STATEMENT) {
                clearLocalCache();
            }
        }
        return list;
    }

    private <E> List<E> queryFromDatabase(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
        List<E> list;
        // 保存到一级缓存，代表这个查询开始
        localCache.putObject(key, ExecutionPlaceholder.EXECUTION_PLACEHOLDER);
        try {
            list = doQuery(ms, parameter, rowBounds, resultHandler, boundSql);
        } finally {
            localCache.removeObject(key);
        }
        // 存入一级缓存
        localCache.putObject(key, list);
        return list;
    }

    @Override
    public int update(MappedStatement ms, Object parameter) throws SQLException {
        if (closed) {
            throw new RuntimeException("Executor was closed.");
        }
        // 因为进行了修改，所以要清理一级缓存
        // 防止数据不一致问题
        clearLocalCache();
        return doUpdate(ms, parameter);
    }

    // 这两个方法就交给子类根据各自特质再进行具体实现
    protected abstract <E> List<E> doQuery(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, BoundSql boundSql) throws SQLException;

    protected abstract int doUpdate(MappedStatement ms, Object parameter) throws SQLException;
}
```

## CachingExecutor 都干了什么？

CachingExecutor 采用了装饰者模式，实现了二级缓存的功能。

```java
public class CachingExecutor implements Executor{

    // (执行BaseExecutor的方法) 但其实delegate是SimpleExecutor（实现类）
    private Executor delegate;
    private TransactionalCacheManager tcm = new TransactionalCacheManager();

    public CachingExecutor(Executor delegate) {
        this.delegate = delegate;
        delegate.setExecutorWrapper(this);
    }

    @Override
    public int update(MappedStatement ms, Object parameter) throws SQLException {
        flushCacheIfRequired(ms);
        // 调用被包装的类执行update
        return delegate.update(ms, parameter);
    }

    @Override
    public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler, CacheKey key, BoundSql boundSql) throws SQLException {
        Cache cache = ms.getCache();
        if (cache != null) {
            flushCacheIfRequired(ms);
            // 如果开启了二级缓存设置
            if (ms.isUseCache() && resultHandler == null) {
                @SuppressWarnings("unchecked")
                // 先看二级缓存中有无
                List<E> list = (List<E>) tcm.getObject(cache, key);
                if (list == null) {
                    list = delegate.<E> query(ms, parameter, rowBounds, resultHandler, key, boundSql);
                    // cache：缓存队列实现类，FIFO
                    // key：哈希值 [mappedStatementId + offset + limit + SQL + queryParams + environment]
                    // list：查询的数据 保存到暂存区
                    tcm.putObject(cache, key, list);
                }
                return list;
            }
        }
        // 没有开启二级缓存设置
        return delegate.<E>query(ms, parameter, rowBounds, resultHandler, key, boundSql);
    }

    @Override
    public <E> List<E> query(MappedStatement ms, Object parameter, RowBounds rowBounds, ResultHandler resultHandler) throws SQLException {
        // 1. 获取绑定SQL
        BoundSql boundSql = ms.getBoundSql(parameter);
        // 2. 创建缓存key
        CacheKey key = createCacheKey(ms, parameter, rowBounds, boundSql);
        return query(ms, parameter, rowBounds, resultHandler, key, boundSql);
    }

    @Override
    public Transaction getTransaction() {
        return delegate.getTransaction();
    }

    // 当SqlSession提交后，会保存到二级缓存的集合中
    // sqlSession.commit()
    @Override
    public void commit(boolean required) throws SQLException {
        delegate.commit(required);
        tcm.commit();
    }

    @Override
    public void rollback(boolean required) throws SQLException {
        try {
            delegate.rollback(required);
        } finally {
            if (required) {
                tcm.rollback();
            }
        }
    }

    // SqlSession关闭后会将得到的数据从暂存区中刷新到二级缓存
    @Override
    public void close(boolean forceRollback) {
        try {
            if (forceRollback) {
                tcm.rollback();
            } else {
                // 放到二级缓存
                tcm.commit();
            }
        } finally {
            delegate.close(forceRollback);
        }
    }

    @Override
    public void clearLocalCache() {
        delegate.clearLocalCache();
    }
}
```
