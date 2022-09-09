
//注册子自定义组件
import { defineClientConfig } from "@vuepress/client";
import WebTool from "../components/WebTool.vue";

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component("WebTool", WebTool);
  },
});
