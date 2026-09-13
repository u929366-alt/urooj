import type { CourseContent } from "./types.ts";
import { digitalMarketing } from "./digital-marketing.ts";
import { eCommerce } from "./e-commerce.ts";
import { graphicDesign } from "./graphic-design.ts";

/** Every course the importer knows about. Add new ones here. */
export const courseContent: CourseContent[] = [digitalMarketing, eCommerce, graphicDesign];
