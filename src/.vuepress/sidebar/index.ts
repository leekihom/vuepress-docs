import { sidebar } from "vuepress-theme-hope";
import { backEnd } from "./backEnd";

export const SidebarConfig = sidebar({
  
    "/docs/": backEnd,
  });