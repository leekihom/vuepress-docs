import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default hopeTheme({
  hostname: "https://doc.leezihong.cn",

  author: {
    name: "leezihong",
    url: "https://doc.leezihong.cn",
  },

  iconAssets: "iconfont",

  logo: "/logo.webp",

  repo: "leekihom",

  docsDir: "src",

  // navbar
  navbar: navbar,

  // sidebar
  sidebar: sidebar,

  footer: "<a href='http://beian.miit.gov.cn/'>渝ICP备2021011172号-1</a>",
  displayFooter: true,
  copyright: "Copyright © 2022 <a href='/'>leezihong</a>, Inc. Built with Vuepress",

  //纯净模式
  //pure: true,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  blog: {
    description: "量子力学水平移动建筑工程师",
    intro: "/about/aboutme.md",
    medias: {
      Email: "https://example.com",
      GitHub: "https://example.com",
      Gmail: "https://example.com",
      QQ: "https://example.com",
      Rss: "https://example.com",
      Steam: "https://example.com",
      Wechat: "https://example.com"
    },
  },

  /**
   * 加密的文章："文章路径":["密码"]
   */
  encrypt: {
    config: {
      
    },
  },

  plugins: {
    blog: {
      autoExcerpt: true,
    },

    // 如果你不需要评论，可以直接删除 comment 配置，
    // 以下配置仅供体验，如果你需要评论，请自行配置并使用自己的环境，详见文档。
    // 为了避免打扰主题开发者以及消耗他的资源，请不要在你的正式环境中直接使用下列配置!!!!!
    // comment: {
    //   provider: "",
    //   repo: "",
    //   repoId: "",
    //   category: "",
    //   categoryId: "",
    // },

    mdEnhance: {
      enableAll: true,
      presentation: {
        plugins: ["highlight", "math", "search", "notes", "zoom"],
      },
    },
  },
});
