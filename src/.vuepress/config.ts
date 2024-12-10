import { defineUserConfig } from "vuepress";
import { getDirname, path } from "vuepress/utils";

import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);
export default defineUserConfig({
  base: "/RoseWhisperInTheWind/",
  head: [
    ["link", { rel: "icon", href: "/RoseLogo.png" }],
    [
      "script",
      {},
      `var _hmt = _hmt || [];
    (function() {
      var hm = document.createElement("script");
      hm.src = "https://hm.baidu.com/hm.js?1573a9da07e3f8a846f3f8906acee788";
      var s = document.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(hm, s);
    })();`,
    ],
  ],

  lang: "zh-CN",
  title: "风中玫瑰的低语",
  description: "vuepress-theme-hope 的博客演示",
  theme,
  alias: {
    "@theme-hope/modules/blog/components/BlogHero": path.resolve(
      __dirname,
      "./components/BlogHero.vue"
    ),
  },
  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
