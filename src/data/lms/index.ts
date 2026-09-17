import type { CategoryContent, CourseContent } from "./types.ts";
import { categoryContent } from "./categories.ts";
import { digitalMarketing } from "./digital-marketing.ts";
import { eCommerce } from "./e-commerce.ts";
import { graphicDesign } from "./graphic-design.ts";
import { itDigitalCourses } from "./cat-it-digital.ts";
import { aiCourses } from "./cat-ai.ts";
import { freelancingCourses } from "./cat-freelancing.ts";
import { communicationCourses, leadershipCourses } from "./cat-communication-leadership.ts";
import { enterpriseCourses, wellbeingCourses } from "./cat-enterprise-wellbeing.ts";
import { burnoutCourses, resilienceCourses } from "./cat-burnout-resilience.ts";

export type { CategoryContent };
export { categoryContent };

/** Every course the importer knows about. Add new ones here. */
export const courseContent: CourseContent[] = [
  digitalMarketing,
  eCommerce,
  graphicDesign,
  ...itDigitalCourses,
  ...aiCourses,
  ...freelancingCourses,
  ...communicationCourses,
  ...leadershipCourses,
  ...enterpriseCourses,
  ...wellbeingCourses,
  ...burnoutCourses,
  ...resilienceCourses,
];
