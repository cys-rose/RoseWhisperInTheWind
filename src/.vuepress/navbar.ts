import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "文章",
    icon: "pen-to-square",
    prefix: "/posts/",
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
        text: "操作系统",
        icon: "pen-to-square",
        prefix: "OS/",
        children: [
          { text: "进程与线程", icon: "pen-to-square", link: "ProcessThread" },
          { text: "文件描述符", icon: "pen-to-square", link: "FD" },
        ],
      },
      // {
      //   text: "苹果",
      //   icon: "pen-to-square",
      //   prefix: "apple/",
      //   children: [
      //     { text: "苹果1", icon: "pen-to-square", link: "1" },
      //     { text: "苹果2", icon: "pen-to-square", link: "2" },
      //     "3",
      //   ],
      // },
    ],
  },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
