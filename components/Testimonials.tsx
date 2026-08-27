"use client";

import { motion, type Variants } from "framer-motion";

type Review = {
  name: string;
  rating: number;
  quote: string;
};

/**
 * Verbatim student reviews. Names are as supplied — no surnames, avatars or
 * job titles have been invented to pad them out.
 */
const REVIEWS: Review[] = [
  {
    name: "Ramana",
    rating: 5,
    quote:
      "The course was well-structured and easily understandable. Atchyut Kumar Sir's way of teaching is excellent. His explanations, course materials, and real-life examples made even complex topics very clear. The course is suitable for both beginners and experienced ones.\n\nEverything I expected from this course has been fulfilled. I strongly recommend this course and the trainer to anyone who wants to learn Azure Data Factory and Data Engineering in a simple and effective way.\n\nThe course fee is also very reasonable and more affordable compared to other institutions.",
  },
  {
    name: "Karthik",
    rating: 5,
    quote:
      "I started this course to learn Azure Data Factory from scratch, and it completely changed my perspective on learning ADF. The instructor explains everything from ABC to XYZ in a very clear and smart way. All topics are covered logically and practically, with focus only on important concepts, so you never feel bored. This course is perfect for beginners as well as working professionals who want strong ADF fundamentals. Highly recommended!",
  },
  {
    name: "Ziyou",
    rating: 5,
    quote:
      "I'll say this is the BEST course for an ADF beginner!! The logic of the course is very clear. Through just watching the videos, I feel I've much more familiar with the set up process for pipelines. The project part is a gold material too. Make sure you are not missing that part. Appreciate the tutor a lot!",
  },
  {
    name: "Rajveeka",
    rating: 5,
    quote:
      "Just completing this course, and it was absolutely worth the time. The trainer has deep expertise and explains every concept with great clarity. I learned a lot, and I genuinely appreciate the quality of the content. Thank you for such an excellent course! 110%/100",
  },
  {
    name: "Shubham",
    rating: 4.5,
    quote:
      "Very good course. It gives us in depth knowledge of data factory and its activities. Also, it explains the all the transformations very clearly. Perfect course to get started with.",
  },
  {
    name: "Riyaz",
    rating: 4.5,
    quote:
      "For beginners looking to get started with Azure Data Factory, this is a great place to begin. The explanations are detailed and easy to follow. Thank you, Atchyut Kumar, for your excellent guidance!",
  },
  {
    name: "Fauzan",
    rating: 4.5,
    quote:
      "So far, the explanation has been exceptionally clear and engaging. I am truly impressed by the remarkable depth of detail provided by the instructor.",
  },
  {
    name: "Sai Kumar",
    rating: 5,
    quote: "I really like the effort you put into this... You did a great job sir",
  },
];

/**
 * Opacity-only, no transform.
 *
 * The grid below is CSS multi-column, and a transformed child inside a column
 * can be split across the column break in Safari. Fading without moving keeps
 * the entrance while sidestepping that entirely.
 */
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
};

const staggerCards: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

/**
 * Five outlined stars with a filled copy clipped to a percentage width, so any
 * fractional rating renders correctly — 4.5 shows exactly half a star, without
 * needing a separate half-star glyph.
 */
function Stars({ rating }: { rating: number }) {
  const star = (
    <svg viewBox="0 0 24 24" className="h-[15px] w-[15px] shrink-0" fill="currentColor">
      <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9L12 2.6Z" />
    </svg>
  );

  return (
    <span
      className="relative inline-block"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      <span className="flex gap-0.5 text-line-strong" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i}>{star}</span>
        ))}
      </span>

      <span
        aria-hidden
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${(rating / 5) * 100}%` }}
      >
        <span className="flex gap-0.5 text-lime">
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i}>{star}</span>
          ))}
        </span>
      </span>
    </span>
  );
}

export default function Testimonials() {
  return (
    <section
      id="reviews"
      className="relative z-10 mx-auto max-w-[1300px] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12"
    >
      <motion.div
        variants={fadeIn}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
      >
        <p className="font-mono text-[11.5px] uppercase tracking-[0.12em] text-teal">
          / What students say
        </p>
        <h2 className="mt-4 max-w-[640px] font-display text-[clamp(30px,3.8vw,46px)] font-bold leading-[1.12] tracking-tight">
          Reviews from people who finished it.
        </h2>
        <p className="mt-5 max-w-[560px] text-[15.5px] leading-relaxed text-muted">
          Unedited feedback from students who took the Azure Data Factory and Data Engineering
          training.
        </p>
      </motion.div>

      {/*
        CSS multi-column rather than a grid. These reviews run from one line to
        three paragraphs; in a grid every row stretches to its tallest card and
        the short ones become mostly empty space. Columns pack by height, so
        nothing is padded out.

        Trade-off worth knowing: reading order runs down each column rather than
        across rows. For independent quotes that costs nothing.
      */}
      <motion.div
        variants={staggerCards}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3"
      >
        {REVIEWS.map((review) => (
          <motion.figure
            key={review.name}
            variants={fadeIn}
            // break-inside-avoid stops a card splitting across two columns.
            // mb-5 rather than a gap: column-gap handles horizontal spacing,
            // margin handles vertical.
            className="mb-5 break-inside-avoid rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-purple/35"
          >
            <Stars rating={review.rating} />

            {/* whitespace-pre-line preserves the paragraph breaks in the
                longer reviews without needing them split into an array. */}
            <blockquote className="mt-4 whitespace-pre-line text-[14.5px] leading-relaxed text-muted">
              {review.quote}
            </blockquote>

            <figcaption className="mt-5 flex items-center gap-3">
              {/* Initial in a circle — derived from the name rather than a
                  stock avatar, which would imply a photo we don't have. */}
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-purple/30 bg-purple/15 font-display text-[15px] font-bold text-purple-2"
              >
                {review.name.charAt(0)}
              </span>
              <span className="text-[14.5px] font-semibold">{review.name}</span>
            </figcaption>
          </motion.figure>
        ))}
      </motion.div>
    </section>
  );
}
