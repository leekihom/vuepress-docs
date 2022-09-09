
//注册子自定义组件
import { defineClientConfig } from "@vuepress/client";
import WebTool from "../components/WebTool.vue";
import AllInOne from "../components/AllInOne.vue";

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component("WebTool", WebTool);
    app.component("AllInOne",AllInOne);
  },
});
