import { defineUserConfig } from "vuepress";
import theme from "./theme";
import  docsearchPlugin   from "@vuepress/plugin-docsearch";
import  searchPlugin  from "@vuepress/plugin-search";

export default defineUserConfig({
  lang: "zh-CN",
  title: "leezihong",
  description: "",

  base: "/",

  theme,
  // .vuepress/config.ts

  plugins: [
    // docsearchPlugin({
    //   appId: "",
    //   apiKey: "",
    //   indexName: "",
    // }),
    searchPlugin({
      locales: {
        '/': {
          placeholder: '搜索',
        },
        
      },
    }),
  ],
});

