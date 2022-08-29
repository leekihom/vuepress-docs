import { arraySidebar } from "vuepress-theme-hope";

export const java = arraySidebar([
  {
    text: "测试sidebar",
    icon: "info",
    link: "/docs/",
    prefix: "/docs/",
    children: ["1test", "2test"],
  },
]);
