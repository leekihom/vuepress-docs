import { sidebar } from "vuepress-theme-hope";
import { backEnd } from "./backEnd";
import { note } from "./note";

export const SidebarConfig = sidebar({
  
    "/docs/": backEnd,
    "/note/": note,
  });