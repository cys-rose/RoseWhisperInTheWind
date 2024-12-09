import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/posts": [
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
      text: "操作系统",
      icon: "book",
      prefix: "OS/",
      children: [
        { text: "进程与线程", icon: "pen-to-square", link: "ProcessThread" },
        { text: "文件描述符", icon: "pen-to-square", link: "FD" },
      ],
    },
  ],
});
