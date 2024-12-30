import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "后端开发",
    icon: "pen-to-square",
    prefix: "/backend/",
    children: [
      {
        text: "MyBatis",
        icon: "pen-to-square",
        prefix: "mybatis/",
        children: [
          { text: "介绍", link: "introduction" },
          { text: "解析XML配置文件", link: "xml" },
          { text: "解析Mapper配置文件", link: "xmlMapper" },
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
            link: "distributedLock",
          },
        ],
      },
      {
        text: "设计模式",
        icon: "pen-to-square",
        prefix: "design/",
        children: [
          { text: "单例模式", icon: "pen-to-square", link: "singleton" },
        ],
      },
    ],
  },
  {
    text: "后端Pro",
    icon: "server",
    prefix: "/backendPro/",
    children: [
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
  },
  {
    text: "小零碎",
    icon: "toolbox",
    prefix: "/anything/",
    children: [
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
    ],
  },
  {
    text: "计算机基础",
    icon: "computer",
    prefix: "/computer/",
    children: [
      {
        text: "操作系统",
        icon: "pen-to-square",
        prefix: "OS/",
        children: [
          { text: "进程与线程", link: "ProcessThread" },
          { text: "文件描述符", link: "FD" },
        ],
      },
      {
        text: "计算机网络",
        icon: "pen-to-square",
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
  },
  {
    text: "DDD",
    icon: "sitemap",
    prefix: "/DDD/",
    children: [
      { text: "界限上下文", link: "boundContext" },
      { text: "系统上下文", link: "systemContext" },
      { text: "上下文映射", link: "contextmapping" },
    ],
  },
  {
    text: "Netty",
    icon: "network-wired",
    prefix: "/netty/",
    children: [{ text: "NIO", link: "NIO" }],
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
