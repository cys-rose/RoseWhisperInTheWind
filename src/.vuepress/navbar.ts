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
          { text: "介绍", icon: "pen-to-square", link: "introduction" },
          { text: "解析XML配置文件", icon: "pen-to-square", link: "xml" },
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
      {
        text: "JUC",
        icon: "pen-to-square",
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
  },
  {
    text: "计算机基础",
    icon: "calculator",
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
          { text: "物理层", link: "wuliceng" },
          { text: "链路层", link: "lianluceng" },
          { text: "网络层", link: "wangluoceng" },
        ],
      },
    ],
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
