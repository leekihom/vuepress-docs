import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  { 
    text: "文章", 
    icon: "creative", 
    link: "/docs/" 
  },
  { 
    text: "随笔", 
    icon: "note", 
    link: "/note/" 
  },
  {
    text: "工具",
    icon: "tool",
    link: "tool/tool"
  },
  {
    text: "关于",
    icon: "info",
    prefix: "/about/",
    children: [
      {
        text: "关于我",
        icon: "people",
        link:"aboutme"
      },
    ],
  },
]);
