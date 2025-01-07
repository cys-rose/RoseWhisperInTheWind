# 双亲委派机制

双亲委派机制有这么一句话：向上检查，向下委派。什么意思？不急，先看图，先看明白大概是个什么结构。
![双亲委派机制](./image/双亲委派机制.png)

## 如何双亲委派的？

其实双亲委派有点像是责任链模式。请看下面的代码。首先检查类是否有被加载过。然后去检查自己的父加载器是不是 null。那么哪个类加载器的父加载器是 null 呢？那就是`ExtensionClassLoader`！因为`BootstrapClassLoader`是 JVM 内部实现的，所以类中读到的就是 null。

```java
protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // 如果类没有被加载过，才继续执行
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    // 如果自己的父加载器不是null
                    if (parent != null) {
                        // 递归调用此方法
                        c = parent.loadClass(name, false);
                    } else {
                        // 使用 BootstrapClassLoader 去加载
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                }
            }
           // ~~~~~~~省略
        }
    }
```

其实说白了，就是从自定义类加载器开始，一直往上递归到`BootstrapClassLoader`然后从`BootstrapClassLoader`开始一个个往下自己问自己能不能加载这个类，如果能，就加载。如果不能就交给自己的孩子加载。

## 为什么要用这个机制？

1. 避免类重复加载
2. 保护程序安全性，防止核心 api 被篡改

## 破坏双亲委派模型

既然双亲委派这么好，为什么还要打破呢？举个 Tomcat 的例子。为了多个应用之间的类隔离需求和支持热部署，Tomcat 就打破了这个模型。
先说一下`多个应用之间的类隔离需求`,因为在一个 Tomcat 服务器中，通常会部署多个 Web 应用。每个 Web 应用可能会依赖不同版本的类库。例如，应用 A 依赖于 Servlet API 3.0，应用 B 依赖于 Servlet API 4.0。如果按照双亲委派机制，那么所有应用的 API 应该都是一样的，因为都会交到某个父类加载器中。
`热部署`：即在不重启服务器的情况下重新部署或更新 Web 应用。在热部署的时候，可能需要卸载旧的类，重新加载新的类。如果按照双亲委派机制，就会比较麻烦，因为父类加载器加载出的类对子类加载器是可见的。

```java
// 破坏双亲委派模型的例子
public class WebAppClassLoader extends URLClassLoader {
    @Override
    protected Class<?> loadClass(String name, boolean resolve) throws ClassNotFoundException {
        // 先尝试自己加载类
        Class<?> clazz = findLoadedClass(name);
        if (clazz == null) {
            try {
                // 尝试从 Web 应用程序的目录中加载类
                clazz = findClass(name);
            } catch (ClassNotFoundException e) {
                // 如果找不到，再委托给父类加载器
                clazz = super.loadClass(name, resolve);
            }
        }
        if (resolve) {
            resolveClass(clazz);
        }
        return clazz;
    }
}
```
