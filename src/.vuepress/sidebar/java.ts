import { arraySidebar } from "vuepress-theme-hope";

export const java = arraySidebar([
  {
    text: "Java",
    icon: "code",
    link: "/docs/",
    prefix: "/docs/",
    collapsable: true,
    children: [
      "Java并发-理论基础", 
    ],
  },
]);
