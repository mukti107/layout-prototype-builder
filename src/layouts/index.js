import { flatMap } from "lodash";
import headers from "./headers";
import navbars from "./navbars";
import features from "./features";

export const layoutGroups = [navbars, headers, features];

const layouts = flatMap(layoutGroups, "layouts");

export default layouts;
