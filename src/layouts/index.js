import { flatMap } from "lodash";
import heros from "./heros";
import testimonials from "./testimonials";
import teams from "./teams";

export const layoutGroups = [heros, testimonials, teams];

const layouts = flatMap(layoutGroups, "layouts");

export default layouts;
