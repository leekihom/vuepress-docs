import { arraySidebar } from "vuepress-theme-hope";

export const backEnd = arraySidebar([
  {
    text: "Java",
    icon: "code",
    //link: "/docs/",
    prefix: "/docs/backEnd/Java/",
    collapsable: true,
    children: [
      "Java并发-理论基础", 
      "IO基础知识",
      "Stream流",
      "反射"
    ],
  },
  {
    text: "Spring",
    //icon: "code",
    //link: "/docs/",
    prefix: "/docs/backEnd/Spring/",
    collapsable: true,
    children: [
      "Spring&SpringBoot注解总结",
      "SpringBoot全局异常处理",
      "SpringBoot动态定时任务"
    ],
  },
]);
