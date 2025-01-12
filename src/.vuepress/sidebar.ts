import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/backend/": [
    {
      text: "MyBatis",
      icon: "book",
      prefix: "mybatis/",
      children: [
        { text: "介绍", link: "introduction" },
        { text: "解析XML配置文件", link: "xml" },
        { text: "解析Mapper配置文件", link: "xmlMapper" },
        { text: "解析Executor家族", link: "executor" },
        { text: "一级缓存&二级缓存", link: "cache" },
      ],
    },
    {
      text: "Spring",
      icon: "pen-to-square",
      prefix: "spring/",
      children: [
        { text: "介绍", link: "introduce" },
        { text: "提前须知", link: "havetoknow" },
        { text: "Bean的生命周期", link: "beanLifeCycle" },
      ],
    },
    {
      text: "Redis",
      icon: "pen-to-square",
      prefix: "redis/",
      children: [
        { text: "Redis事务", link: "redisTs" },
        {
          text: "Redis数据一致性",
          link: "dataConsistence",
        },
        {
          text: "Redis分布式锁",
          link: "distributeLock",
        },
        {
          text: "Redis缓存问题",
          link: "cacheProblem",
        },
        {
          text: "Redis什么时候会宕机",
          link: "redisDied",
        },
      ],
    },
    {
      text: "设计模式",
      icon: "book",
      prefix: "design/",
      children: [
        { text: "单例模式", link: "singleton" },
        { text: "模板模式", link: "template" },
      ],
    },
  ],
  "/backendPro": [
    {
      text: "JUC",
      icon: "pen-to-square",
      prefix: "juc/",
      children: [
        {
          text: "深挖Synchronized原理",
          link: "Synchronized",
        },
        {
          text: "如何创建一个线程",
          link: "thread",
        },
        { text: "ReentrantLock中的AQS", link: "ReentrantLock" },
      ],
    },
    {
      text: "JVM虚拟机",
      prefix: "jvm/",
      children: [
        {
          text: "直接内存",
          link: "directMemory",
        },
      ],
    },
  ],
  "/computer": [
    {
      text: "操作系统",
      icon: "book",
      prefix: "OS/",
      children: [
        { text: "进程与线程", icon: "pen-to-square", link: "ProcessThread" },
        { text: "文件描述符", icon: "pen-to-square", link: "FD" },
      ],
    },
    {
      text: "计算机网络",
      icon: "book",
      prefix: "computernetwork/",
      children: [
        { text: "序章", link: "computerNetwork" },
        { text: "因特网", link: "internet" },
        { text: "物理层", link: "wuliceng" },
        { text: "链路层", link: "lianluceng" },
        { text: "网络层", link: "wangluoceng" },
        { text: "传输层", link: "cuanshuceng" },
      ],
    },
  ],
  "/DDD": [
    {
      text: "DDD",
      icon: "sitemap",
      prefix: "DDD/",
      children: [
        { text: "界限上下文", link: "boundContext" },
        { text: "系统上下文", link: "systemContext" },
        { text: "上下文映射", link: "contextmapping" },
      ],
    },
  ],
  "/anything": [
    {
      text: "什么是CDN",
      link: "cdn",
    },
    {
      text: "订单问题（未完）",
      link: "jdshoppingQS",
    },
    {
      text: "扫描二维码如何登录",
      link: "QRCode",
    },
    {
      text: "如何将数组转换成集合",
      link: "howtoarray",
    },
    {
      text: "什么是幂等性",
      link: "mideng",
    },
  ],
  "/netty": [
    {
      text: "Netty",
      icon: "book",
      prefix: "netty/",
      children: [{ text: "NIO", link: "NIO" }],
    },
  ],
});
