"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { testimonials } from "@/data/testimonials";

export function TestimonialsSlider() {
  const [index, setIndex] = useState(0);
  const item = testimonials[index];

  const go = (dir: 1 | -1) =>
    setIndex((prev) => (prev + dir + testimonials.length) % testimonials.length);

  return (
    <section className="py-20">
      <Container>
        <SectionHeading eyebrow="Testimonials" title="What People Say" />
        <div className="mx-auto mt-10 max-w-2xl text-center">
          <div className="mb-3 flex justify-center gap-1 text-secondary-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xl font-medium leading-8 text-primary-900">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="mt-4 font-semibold text-primary-900">{item.name}</p>
              <p className="text-sm text-gray-500">{item.role}</p>
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-primary-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 hover:bg-primary-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  );
}
