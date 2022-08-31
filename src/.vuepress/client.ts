
//注册子自定义组件
import { defineClientConfig } from "@vuepress/client";
import CardList from "../components/CardList.vue";

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    app.component("CardList", CardList);
  },
});
