"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { Badge } from "@/components/ui/Badge";
import { successStories } from "@/data/testimonials";

export function SuccessStoriesCarousel() {
  const [index, setIndex] = useState(0);
  const story = successStories[index];

  const go = (dir: 1 | -1) => {
    setIndex((prev) => (prev + dir + successStories.length) % successStories.length);
  };

  return (
    <section className="bg-primary-900 py-20 text-white">
      <Container>
        <SectionHeading
          eyebrow="Success Stories"
          title="Real Journeys, Real Impact"
          description="Meet a few of the thousands of graduates who transformed their lives through Hunarsaaz."
          className="[&_h2]:text-white [&_p]:text-primary-200"
        />

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={story.slug}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <PlaceholderImage
                label={story.name}
                icon={User}
                seed={story.slug}
                className="aspect-square w-full max-w-sm rounded-3xl"
              />
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={story.slug + "-content"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <Badge tone="secondary">{story.program}</Badge>
              <Quote className="mt-4 h-8 w-8 text-secondary-400" />
              <p className="mt-2 text-xl font-medium leading-8">&ldquo;{story.quote}&rdquo;</p>
              <p className="mt-6 text-sm leading-6 text-primary-200">{story.journey}</p>
              <div className="mt-4">
                <p className="font-semibold text-white">{story.name}</p>
                <p className="text-sm text-primary-300">{story.currentEmployment}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {story.skillsLearned.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-primary-800 px-3 py-1 text-xs text-primary-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous story"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-800 hover:bg-secondary-500"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {successStories.map((s, i) => (
              <button
                key={s.slug}
                aria-label={`Go to story ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-secondary-500" : "w-2 bg-primary-700"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next story"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-800 hover:bg-secondary-500"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </Container>
    </section>
  );
}
