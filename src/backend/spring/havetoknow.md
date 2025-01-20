# 关于 Spring 源码你需要提前知道的

Spring 源码中有一些特别重要的类，它们的名字又比较相似，所以希望你可以先看看这篇文章，现有一个大概的印象也好。
其实 Spring 的思想也很简单，学习时不要怕！Spring 的核心就是创建一个对象池，实现对象的集中管理。

## BeanDefinition

它是描述一个 Bean 的实例化信息的一个接口，但是在我的项目里为了简化一点，作者把 BeanDefinition 作为一个类了。它就像是一个 Bean 的“宏伟蓝图”，根据这里的东西（如：单例、多例和 PropertyValues）来创建 Bean。

```java
public class BeanDefinition {

    private Class beanClass;
    // 我们在xml中配置的类的属性
    private PropertyValues propertyValues;

    // 为了可以在xml文件中进行bean配置
    private String initMethodName;
    private String destroyMethodName;

    // 单例还是多例。默认是单例Bean
    private String scope = SCOPE_SINGLETON;

    String SCOPE_SINGLETON = ConfigurableBeanFactory.SCOPE_SINGLETON;

    String SCOPE_PROTOTYPE = ConfigurableBeanFactory.SCOPE_PROTOTYPE;

    private boolean singleton = true;

    private boolean prototype = false;
}

public class PropertyValues {
    private final List<PropertyValue> propertyValueList = new ArrayList<>();
}

public class PropertyValue {

    private final String name;

    private final Object value;
}
```

## BeanFactory

它是 Spring IoC（控制反转）容器的基本实现。其主要作用是负责创建和管理 Bean 对象。正如其名，Bean 的工厂，一看就是工厂模式。那么工厂模式有什么作用呢？当然就是帮你创建 Bean 实例喽！所以说 BeanFactory 的某个实现类应该有`createBean()`的方法和获取 Bean`getBean()`的方法。那么生产原料是什么呢？就是上面刚提到的`BeanDefinition`对象。所以还得有某个实现类维护了一个关于 BeanDefinition 的`Map`集合。

```java
public abstract class AbstractAutowireCapableBeanFactory extends AbstractBeanFactory implements AutowireCapableBeanFactory {
    protected Object createBean(String beanName, BeanDefinition beanDefinition, Object[] args) throws BeansException {
        // xxxxxx
    }
}
// BeanFactory接口的关键实现类，其用于注册和管理BeanDefinition
public class DefaultListableBeanFactory extends AbstractAutowireCapableBeanFactory implements BeanDefinitionRegistry, ConfigurableListableBeanFactory {

    private final Map<String, BeanDefinition> beanDefinitionMap = new ConcurrentHashMap<>();
}
```

## FactoryBean

与上面的名字比较类似哈！这个翻译过来是工厂 Bean。他的本质是一个 Bean 对象，但是它的作用是作为一个工厂。其与普通的 Bean 不同，普通 Bean 在 Spring 容器中是直接实例化的对象，而 FactoryBean 本身是一个工厂，用于生成其他 Bean 对象。

1. 比如`SqlSessionFactoryBean`其用来创建`SqlSessionFactory`对象，而 `SqlSessionFactory` 是 MyBatis 用于创建 `SqlSession` 的工厂。所以就这样把 MyBatis 的 `SqlSessionFactory` 对象交给了 Spring 容器。
2. BeanFactory 像是一个通用的工厂，负责生产各种不同的产品（Bean），而 FactoryBean 更像是一个专门的小作坊，只负责生产一种特定类型的高级产品（复杂的 Bean），并且有自己特殊的生产工艺`getObject()、getObjectType()和 isSingleton()方法`。

```java
public interface FactoryBean<T> {

    T getObject() throws Exception;

    Class<?> getObjectType();

    boolean isSingleton();
}
```

## Aware

Spring 中有个 Aware 标记接口，其有很多实现。你会看到很多 xxxAware，它们是 Spring 提供的一种回调机制，用于让 Bean 能够感知到容器中的其他资源或者自身在容器中的一些信息。就比如`BeanFactoryAware`，实现了这个接口的类可以在自己的 Bean 实例化时，把 BeanFactory 对象也注入到自己中。

```java
public interface BeanFactoryAware extends Aware{
    void setBeanFactory(BeanFactory beanFactory) throws BeansException;
}

    // AbstractAutowireCapableBeanFactory类中的方法
    private Object initializeBean(String beanName, Object bean, BeanDefinition beanDefinition) {
        // invokeAwareMethods
        if (bean instanceof Aware) {
            // 在这里发现了你要注册的Bean实现了BeanFactoryAware接口
            if (bean instanceof BeanFactoryAware) {
                // 注册到Bean里
                ((BeanFactoryAware) bean).setBeanFactory(this);
            }
            if (bean instanceof BeanClassLoaderAware) {
                ((BeanClassLoaderAware) bean).setBeanClassLoader(getBeanClassLoader());
            }
            if (bean instanceof BeanNameAware) {
                ((BeanNameAware) bean).setBeanName(beanName);
            }
        }
    }
// 如何使用
public class UserService implements BeanFactoryAware {

    private BeanFactory beanFactory;
    private UserRepository userRepository;

    @Override
    public void setBeanFactory(BeanFactory beanFactory) throws BeansException {
        this.beanFactory = beanFactory;
        // 通过BeanFactory获取UserRepository实例
        this.userRepository = beanFactory.getBean(UserRepository.class);
    }

    public User getUserById(int id) {
        return userRepository.getUserById(id);
    }
}
```
