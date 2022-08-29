import { sidebar } from "vuepress-theme-hope";

export default sidebar([
  {
    text: "文章",
    icon: "creative",
    prefix: "/docs/",
    children: [
      {
        text: "文章 1-4",
        icon: "creative",
        collapsable: true,
        children: ["1"],
      },
    ],
  },
  {
    text: "随笔",
    icon: "note",
    prefix: "/note/",
    link: "",
  },
]);
