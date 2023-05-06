import { defineUserConfig } from "vuepress";
import theme from "./theme";
import  docsearchPlugin   from "@vuepress/plugin-docsearch";
import  searchPlugin  from "@vuepress/plugin-search";

export default defineUserConfig({
  lang: "zh-CN",
  title: "leezihong",
  description: "",
  port: 9090 ,
  base: "/",

  theme,
  // .vuepress/config.ts

  plugins: [
    docsearchPlugin({
      appId: "MRIRJTYVAT",
      apiKey: "6f6505f1c70849707ded6d53db002748",
      indexName: "leezihong",
    }),
    // searchPlugin({
    //   locales: {
    //     '/': {
    //       placeholder: '搜索',
    //     },
        
    //   },
    // }),
  ],
});

