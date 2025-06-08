import { sidebar } from "vuepress-theme-hope";
import { backEnd } from "./backEnd";
import { note } from "./note";
import {photos} from "./photos";

export const SidebarConfig = sidebar({
  
    "/docs/": backEnd,
    "/note/": note,
    // "/photo/": photos
  });