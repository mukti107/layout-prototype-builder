import { flatMap } from "lodash";
import headers from "./headers";
import navbars from "./navbars";

export const layoutGroups = [navbars, headers];

const layouts = flatMap(layoutGroups, "layouts");

export default layouts;
