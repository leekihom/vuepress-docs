import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  { 
    text: "文章", 
    icon: "code", 
    link: "/docs/",
    activeMatch: "^/docs/$",
  },
  { 
    text: "随笔", 
    icon: "note", 
    link: "/note/" 
  },
  {
    text: "工具",
    icon: "tool",
    link: "/tool/tool"
  },
  {
    text: "关于",
    icon: "info",
    link: "/about/aboutme"
  },
]);
