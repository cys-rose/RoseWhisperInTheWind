# 模板模式

模板模式的核心就在于一个抽象类，这个抽象类中给你定义好了代码流程的规范，然后呢给你定义好了个别的抽象方法，等着子类去具体实现。没错就是这么简单。

## 结合代码

给大家例举一个 Spring 创建 Bean 对象的例子！

```java
// 后面的extends和implements省略了
public abstract class AbstractApplicationContext {
    public void refresh() throws BeansException, IllegalStateException {
        synchronized(this.startupShutdownMonitor) {
            StartupStep contextRefresh = this.applicationStartup.start("spring.context.refresh");
            this.prepareRefresh();
            ConfigurableListableBeanFactory beanFactory = this.obtainFreshBeanFactory();
            this.prepareBeanFactory(beanFactory);

            try {
                // 模板的流程
                this.postProcessBeanFactory(beanFactory);
                StartupStep beanPostProcess = this.applicationStartup.start("spring.context.beans.post-process");
                this.invokeBeanFactoryPostProcessors(beanFactory);
                this.registerBeanPostProcessors(beanFactory);
                beanPostProcess.end();
                this.initMessageSource();
                this.initApplicationEventMulticaster();
                this.onRefresh();
                this.registerListeners();
                this.finishBeanFactoryInitialization(beanFactory);
                this.finishRefresh();
            } catch (BeansException var10) {
                // xxxxx
            } finally {
               // xxxx
            }
        }
    }
}
```

上面代码中的`try`块中定义的一系列方法的顺序就是模板模式的流程，有的方法可能在这个抽象类中有了默认实现。如：

```java
    // 不管这个方法是干啥的，但是能看出来抽象类已经给你做好实现了
    protected void invokeBeanFactoryPostProcessors(ConfigurableListableBeanFactory beanFactory) {
        PostProcessorRegistrationDelegate.invokeBeanFactoryPostProcessors(beanFactory, this.getBeanFactoryPostProcessors());
        if (!NativeDetector.inNativeImage() && beanFactory.getTempClassLoader() == null && beanFactory.containsBean("loadTimeWeaver")) {
            beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));
            beanFactory.setTempClassLoader(new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));
        }

    }
```

而有的方法可能是抽象方法，需要子类去实现，如：

```java
    protected abstract void refreshBeanFactory() throws BeansException, IllegalStateException;

    protected abstract void closeBeanFactory();

    public abstract ConfigurableListableBeanFactory getBeanFactory() throws IllegalStateException;
```

而还有的方法居然是空方法，如：

```java
    // 命名上看是个钩子函数
    protected void onRefresh() throws BeansException {

    }
```

## 模板模式中的空方法

模板抽象类中为什么要有空方法呢？大家可以想想抽象方法的特点是什么。如果一个类定义了抽象方法，那么其子类要是也是一个抽象类，要么子类就必须对这个抽象方法进行实现。而父类的空方法呢？因为不是`abstract`的，所以子类不必要实现。因此在抽象类中的一些可供子类选择（非必须）实现的方法就可以定义为空方法！怎么样是不是很巧妙！
