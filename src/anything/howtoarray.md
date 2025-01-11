# 数组转换成 List 的正确姿势

我平时在写 leetcode 时，总是会遇到把数组转换成 List 集合的场景。我当时就`Arrays.asList(nums)`就 ok 了，不知道你们是不是也这样。但是如果这样写其实还会产生一些问题，看下面的代码。

## 奇怪的输出

当你运行下面的代码时，会出现这样的报错，为啥呢？

```java
    public static void main(String[] args) {
        List list = Arrays.asList(1, 2, 3, 4);
        list.add(5);//运行时报错：UnsupportedOperationException
        list.remove(1);//运行时报错：UnsupportedOperationException
        list.clear();//运行时报错：UnsupportedOperationException
    }

```

一看`asList()`的返回，这你敢信？创建的是个什么东西出来？ArrayList 成了 Arrays 的子类？

```java
// class java.util.Arrays$ArrayList
System.out.println(list.getClass());
```

那就看看源码吧！

```java
private static class ArrayList<E> extends AbstractList<E>
        implements RandomAccess, java.io.Serializable {
    // ...省略代码...（这里的代码没有上面的报错）
    // 真正的罪魁祸首在 AbstractList这里
}

    public void add(int index, E element) {
        throw new UnsupportedOperationException();
    }

public abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
    public E set(int index, E element) {
        throw new UnsupportedOperationException();
    }
    public void add(int index, E element) {
        throw new UnsupportedOperationException();
    }
    public E remove(int index) {
        throw new UnsupportedOperationException();
    }
}
```

所以在开发时候还真别用 Arrays.asList()，它返回的是一个不可变的 List！

## 如何正确转换？

以下内容源自 JavaGuide

1. 简单粗暴

```java
List list = new ArrayList<>(Arrays.asList("a", "b", "c"))
```

2. stream (Java8)

```java
Integer [] myArray = { 1, 2, 3 };
List myList = Arrays.stream(myArray).collect(Collectors.toList());
//基本类型也可以实现转换（依赖boxed的装箱操作）
int [] myArray2 = { 1, 2, 3 };
List myList = Arrays.stream(myArray2).boxed().collect(Collectors.toList());
```

3. Java9

```java
Integer[] array = {1, 2, 3};
List<Integer> list = List.of(array);
```
