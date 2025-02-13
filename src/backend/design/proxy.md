# 代理模式

介绍两种常用的动态代理！除了这两个以外还有 ASM, Javassis, Byte-Buddy 三种动态代理！

## JDK 动态代理

JDK 动态代理我把它称为基于接口的动态代理，因为被代理对象至少得有一个接口。然后 JDK 动态代理创建出来的代理对象`$Proxy0`也会实现这些接口，并重写里面的方法。大概是这个样子的。那么这个`super.h`是什么呢？

```java
public final class $Proxy0 extends Proxy implements UserService {
    // m1,m2可能是原类中的equals和toString方法
    private static Method m1;
    private static Method m2;
    // m3就是原接口的方法
    private static Method m3;

    public $Proxy0(InvocationHandler var1) throws  {
        super(var1);
    }

    public final void addUser(String username) throws {
        try {
            super.h.invoke(this, m3, new Object[]{username});
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }
}
```

`super.h`得从我们如何创建代理对象开始说起。

```java
public interface UserService {
    void addUser(String username);
}

public class UserServiceImpl implements UserService {
    @Override
    public void addUser(String username) {
        System.out.println("添加用户: " + username);
    }
}

// 这里就是我们进行方法增强的地方
// InvocationHandler是 java.lang.reflect包里的
public class LoggingInvocationHandler implements InvocationHandler {
    private final Object target;

    // 构造函数，传入被代理的目标对象
    public LoggingInvocationHandler(Object target) {
        this.target = target;
    }

    // proxy 代理对象，method被代理的方法，args被代理方法的参数
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        // 在方法调用前添加日志记录
        System.out.println("开始调用方法: " + method.getName());
        // 调用目标对象的方法，method就是被代理的方法
        Object result = method.invoke(target, args);
        // 在方法调用后添加日志记录
        System.out.println("方法调用结束: " + method.getName());
        return result;
    }
}

public class JdkDynamicProxyExample {
    public static void main(String[] args) {
        // 创建被代理的目标对象
        UserService userService = new UserServiceImpl();
        // 创建 InvocationHandler 实例
        LoggingInvocationHandler handler = new LoggingInvocationHandler(userService);
        // 创建代理类需要三个变量，类加载器，目标对象接口数组，增强方法处理器
        UserService proxyUserService = (UserService) Proxy.newProxyInstance(
                userService.getClass().getClassLoader(),
                userService.getClass().getInterfaces(),
                handler
        );

        proxyUserService.addUser("张三");
    }
}
```

好奇不？为什么要传入**类加载器，目标对象接口数组，增强方法处理器**这三个变量呢？

1. **增强方法处理器**没啥多说的了，毕竟我们要执行这个类的 invoke 方法

```java
    public final void addUser(String username) throws {
        try {
            // h 就是我们创建的 LoggingInvocationHandler
            super.h.invoke(this, m1, new Object[]{username});
        } catch (RuntimeException | Error var2) {
            throw var2;
        } catch (Throwable var3) {
            throw new UndeclaredThrowableException(var3);
        }
    }
```

2. **目标对象接口数组**：传入这个是为了拿到被代理对象的所有方法功能，然后在代理类中变成`method1, method2, method3`等变量，并且还要实现这些接口并做实现嘛！

```java
    private static Method m1;
    private static Method m2;
    private static Method m3;
```

3. **类加载器**：这是因为我们要在运行过程中动态的创建出一个新的类，并把它加载到 JVM 中，所以就自然需要用到类加载器喽！

## CGLIB 动态代理

CGLIB 动态代理不要求被代理类一定要有接口，CGLIB 会动态生成一个被代理类的子类，并重写被代理类的方法，从而实现代理功能。下面是如何使用：

```java
// MethodInterceptor 接口是net.sf.cglib.proxy包中的
public class LoggingMethodInterceptor implements MethodInterceptor {

    public Object intercept(Object o, Method method, Object[] args, MethodProxy methodProxy) throws Throwable {
        System.out.println(method.getName() + "方法调用前~");
        methodProxy.invokeSuper(o, args);
        System.out.println(method.getName()+"方法调用后~");
        return null;
    }
}

public class CglibProxyExample {
    public static void main(String[] args) {
        // 创建 Enhancer 实例
        Enhancer enhancer = new Enhancer();
        // 设置要代理的目标类
        enhancer.setSuperclass(UserService.class);
        // 设置回调函数，即实现了 MethodInterceptor 接口的类
        enhancer.setCallback(new LoggingMethodInterceptor());
        UserService proxyUserService = (UserService) enhancer.create();

        proxyUserService.addUser("张三");
    }
}
```

那么原理是什么呢？先看看生成的 CGLIB 代理对象吧

```java
public class UserService$$EnhancerByCGLIB$$dff44b52 extends UserService implements Factory {
    private boolean CGLIB$BOUND;
    public static Object CGLIB$FACTORY_DATA;
    private static final ThreadLocal CGLIB$THREAD_CALLBACKS;
    private static final Callback[] CGLIB$STATIC_CALLBACKS;
    private MethodInterceptor CGLIB$CALLBACK_0;
    private static Object CGLIB$CALLBACK_FILTER;
    // 我们的addUser方法
    private static final Method CGLIB$addUser$0$Method;
    private static final MethodProxy CGLIB$addUser$0$Proxy;
    private static final Object[] CGLIB$emptyArgs;
    private static final Method CGLIB$equals$1$Method;
    private static final MethodProxy CGLIB$equals$1$Proxy;
    private static final Method CGLIB$toString$2$Method;
    private static final MethodProxy CGLIB$toString$2$Proxy;
    private static final Method CGLIB$hashCode$3$Method;
    private static final MethodProxy CGLIB$hashCode$3$Proxy;
    private static final Method CGLIB$clone$4$Method;
    private static final MethodProxy CGLIB$clone$4$Proxy;

    static void CGLIB$STATICHOOK1() {
        CGLIB$THREAD_CALLBACKS = new ThreadLocal();
        CGLIB$emptyArgs = new Object[0];
        Class var0 = Class.forName("proxy.UserService$$EnhancerByCGLIB$$dff44b52");
        Class var1;
        Method[] var10000 = ReflectUtils.findMethods(new String[]{"equals", "(Ljava/lang/Object;)Z", "toString", "()Ljava/lang/String;", "hashCode", "()I", "clone", "()Ljava/lang/Object;"}, (var1 = Class.forName("java.lang.Object")).getDeclaredMethods());
        CGLIB$equals$1$Method = var10000[0];
        CGLIB$equals$1$Proxy = MethodProxy.create(var1, var0, "(Ljava/lang/Object;)Z", "equals", "CGLIB$equals$1");
        CGLIB$toString$2$Method = var10000[1];
        CGLIB$toString$2$Proxy = MethodProxy.create(var1, var0, "()Ljava/lang/String;", "toString", "CGLIB$toString$2");
        CGLIB$hashCode$3$Method = var10000[2];
        CGLIB$hashCode$3$Proxy = MethodProxy.create(var1, var0, "()I", "hashCode", "CGLIB$hashCode$3");
        CGLIB$clone$4$Method = var10000[3];
        CGLIB$clone$4$Proxy = MethodProxy.create(var1, var0, "()Ljava/lang/Object;", "clone", "CGLIB$clone$4");
        CGLIB$addUser$0$Method = ReflectUtils.findMethods(new String[]{"addUser", "(Lproxy/User;)V"}, (var1 = Class.forName("proxy.UserService")).getDeclaredMethods())[0];
        CGLIB$addUser$0$Proxy = MethodProxy.create(var1, var0, "(Lproxy/User;)V", "addUser", "CGLIB$addUser$0");
    }
    // 自己写的addUser方法
    final void CGLIB$addUser$0(User var1) {
        super.addUser(var1);
    }

    // 增强过的addUser方法
    public final void addUser(User var1) {
        // 这里就拿到增强接口了，原来是通过ThreadLocal拿到的！
        MethodInterceptor var10000 = this.CGLIB$CALLBACK_0;
        if (var10000 == null) {
            CGLIB$BIND_CALLBACKS(this);
            var10000 = this.CGLIB$CALLBACK_0;
        }

        if (var10000 != null) {
            // 执行具体的增强方法
            var10000.intercept(this, CGLIB$addUser$0$Method, new Object[]{var1}, CGLIB$addUser$0$Proxy);
        } else {
            super.addUser(var1);
        }
    }

    // 给ThreadLocal中添加MethodInterceptor
    // 这个方法在创建时就被调用了,在调用newInstance()时
    public static void CGLIB$SET_THREAD_CALLBACKS(Callback[] var0) {
        CGLIB$THREAD_CALLBACKS.set(var0);
    }

    private static final void CGLIB$BIND_CALLBACKS(Object var0) {
        UserService$$EnhancerByCGLIB$$dff44b52 var1 = (UserService$$EnhancerByCGLIB$$dff44b52)var0;
        if (!var1.CGLIB$BOUND) {
            var1.CGLIB$BOUND = true;
            // 这个CALLBACKS是一个 ThreadLocal对象
            Object var10000 = CGLIB$THREAD_CALLBACKS.get();
            if (var10000 == null) {
                var10000 = CGLIB$STATIC_CALLBACKS;
                if (var10000 == null) {
                    return;
                }
            }

            // MethodInterceptor眼熟吧？就是我们手写实现的增强接口
            // 把增强接口赋值给CGLIB$CALLBACK_0
            var1.CGLIB$CALLBACK_0 = (MethodInterceptor)((Callback[])var10000)[0];
        }
    }
}
```

所以说是通过继承被代理类然后对被代理方法中调用 MethodInvocationHandler 的 intercept 方法来实现代理的。
