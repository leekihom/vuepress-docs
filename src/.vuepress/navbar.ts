import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  { 
    text: "📖文章", 
    link: "/docs/",
    activeMatch: "^/docs/$",
  },
  { 
    text: "✍随笔", 
    link: "/note/" 
  },
  {
    text: "🔧工具",
    link: "/tool/tool/"
  },
  {
    text: "🌟关于",
    link: "/about/aboutme"
  },
]);
