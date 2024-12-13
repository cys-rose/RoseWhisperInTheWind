import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/backend/": [
    {
      text: "MyBatis",
      icon: "book",
      prefix: "mybatis/",
      children: [
        { text: "介绍", icon: "pen-to-square", link: "introduction" },
        { text: "解析XML配置文件", icon: "pen-to-square", link: "xml" },
      ],
    },
    {
      text: "设计模式",
      icon: "book",
      prefix: "design/",
      children: [
        { text: "单例模式", icon: "pen-to-square", link: "singleton" },
      ],
    },
    {
      text: "JUC",
      icon: "book",
      prefix: "juc/",
      children: [
        {
          text: "深挖Synchronized原理",
          icon: "pen-to-square",
          link: "Synchronized",
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
        { text: "序章", icon: "pen-to-square", link: "computerNetwork" },
        { text: "物理层", icon: "pen-to-square", link: "wuliceng" },
        { text: "链路层", icon: "pen-to-square", link: "lianluceng" },
        { text: "网络层", icon: "pen-to-square", link: "wangluoceng" },
      ],
    },
  ],
});
