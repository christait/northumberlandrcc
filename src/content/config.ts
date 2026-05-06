import { defineCollection, z } from 'astro:content';

const news = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().optional(),
    author: z.string().optional(),
    image: z.string().optional(),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).optional(),
  }),
});

const events = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    endDate: z.coerce.date().optional(),
    location: z.string().optional(),
    summary: z.string().optional(),
    rsvp: z.string().url().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const conclaves = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    number: z.union([z.string(), z.number()]).optional(),
    consecrated: z.string().optional(),
    meetingPlace: z.string().optional(),
    meetingDates: z.string().optional(),
    recorder: z.string().optional(),
    recorderEmail: z.string().email().optional(),
    order: z.number().optional(),
  }),
});

const executive = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    rank: z.string(),
    role: z.string(),
    photo: z.string().optional(),
    order: z.number().optional(),
  }),
});

const officers = defineCollection({
  type: 'content',
  schema: z.object({
    office: z.string(),
    name: z.string().optional(),
    rank: z.string().optional(),
    order: z.number().optional(),
  }),
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    eyebrow: z.string().optional(),
  }),
});

const homepage = defineCollection({
  type: 'data',
  schema: z.object({
    heroEyebrow: z.string(),
    heroLead: z.string(),
    cta1Label: z.string(),
    cta1Href: z.string(),
    cta2Label: z.string(),
    cta2Href: z.string(),
    cards: z.array(
      z.object({
        eyebrow: z.string(),
        heading: z.string(),
        description: z.string(),
        linkLabel: z.string(),
        linkHref: z.string(),
      })
    ),
  }),
});

export const collections = {
  news,
  events,
  conclaves,
  executive,
  officers,
  pages,
  homepage,
};
