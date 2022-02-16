import { flatMap } from "lodash";
import heros from "./heros";
import testimonials from "./testimonials";

export const layoutGroups = [
    heros,
    testimonials,
];

const layouts = flatMap(layoutGroups, 'layouts');

export default layouts;