# MyBatis 中好玩的类

本篇旨在介绍 MyBatis 中一些让人惊呼好叼的类，也许这些类并没有使用到什么设计模式，但是读懂了它的代码你就会惊呼 nb！

## PropertyTokenizer 属性分词器

如果说给你一个字符串，它代表一个变量的属性，如：`school.classroom[0].student`这个是由三个类嵌套出来的，你怎么拿到每个被嵌套的类的具体值呢？

```java
public class PropertyTokenizer implements Iterable<PropertyTokenizer>, Iterator<PropertyTokenizer> {

    // 例子：班级[0].学生.成绩
    // 班级
    private String name;
    // 班级[0]
    private String indexedName;
    // 0
    private String index;
    // 学生.成绩
    private String children;

    public PropertyTokenizer(String fullName) {
        // 班级[0].学生.成绩
        // 找这个点 .
        int delim = fullName.indexOf(".");
        if (delim > -1) {
            // name == 班级[0]
            name = fullName.substring(0,delim);
            children = fullName.substring(delim+1);
        } else {
            // 找不到.的话，取全部部分
            name = fullName;
            children = null;
        }
        indexedName = name;
        // 把中括号里的数字给解析出来
        delim = name.indexOf('[');
        if (delim > -1) {
            index = name.substring(delim+1,name.length()-1);
            name = name.substring(0, delim);
        }
    }

    public String getName() {
        return name;
    }

    public String getIndex() {
        return index;
    }

    public String getIndexedName() {
        return indexedName;
    }

    public String getChildren() {
        return children;
    }

    @Override
    public Iterator<PropertyTokenizer> iterator() {
        return this;
    }

    // 取得下一个,非常简单，直接再通过儿子来new另外一个实例
    @Override
    public PropertyTokenizer next() {
        return new PropertyTokenizer(children);
    }

    @Override
    public boolean hasNext() {
        return children != null;
    }

    @Override
    public void remove() {
        throw new UnsupportedOperationException("Remove is not supported, as it has no meaning in the context of properties.");
    }
}
```

通过上面的类解析后，我们就可以通过反射拿到对应类中的值喽~
