import { flatMap } from "lodash";
import heros from "./heros";
import testimonials from "./testimonials";
import teams from "./teams";
import headers from "./headers";

export const layoutGroups = [heros, testimonials, teams, headers];

const layouts = flatMap(layoutGroups, "layouts");

export default layouts;
