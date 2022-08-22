import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar";
import sidebar from "./sidebar";

export default hopeTheme({
  hostname: "https://vuepress-theme-hope-v2-demo.mrhope.site",

  author: {
    name: "leezihong",
    url: "https://doc.leezihong.cn",
  },

  iconAssets: "iconfont",

  logo: "/logo.webp",

  repo: "vuepress-theme-hope/vuepress-theme-hope",

  docsDir: "demo/src",

  // navbar
  navbar: navbar,

  // sidebar
  sidebar: sidebar,

  footer: "默认页脚",

  displayFooter: true,

  pageInfo: ["Author", "Original", "Date", "Category", "Tag", "ReadingTime"],

  blog: {
    description: "这是一个描述",
    intro: "/intro.html",
    medias: {
      Email: "https://example.com",
      GitHub: "https://example.com",
      Gmail: "https://example.com",
      QQ: "https://example.com",
      Rss: "https://example.com",
      Steam: "https://example.com",
      Wechat: "https://example.com",
      Zhihu: "https://example.com",
    },
  },

  //用于加密的配置
  encrypt: {
    config: {
      "/guide/encrypt.html": ["1234"],
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
