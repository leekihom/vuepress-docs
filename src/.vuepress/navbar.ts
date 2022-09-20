import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  { 
    text: "📖文章", 
    prefix: "/docs/",
    //activeMatch: "^/docs/$",
    children: [
      {
        text:"前端",
        link:"frontEnd",
      }, 
      {
        text:"后端",
        link:"backEnd",
      },
      {
        text:"中间件",
        link:"middleware",
      },
      {
        text:"杂项",
        link:"others",
      },
    ],
  },
  { 
    text: "✍随笔", 
    link: "/note/" 
  },
  {
    text: "🔧工具",
    link: "/tool/"
  },
  {
    text: "🌟关于",
    link: "/about/aboutme"
  },
]);
