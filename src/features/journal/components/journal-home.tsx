import { AppShell } from "@/components/layout/app-shell";
import { AnchorButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AnimatedJournalPreview } from "@/features/journal/components/animated-journal-preview";
import { FaqAccordion } from "@/features/journal/components/faq-accordion";
import { HeroPromptCard } from "@/features/journal/components/hero-prompt-card";
import { LandingHeader } from "@/features/journal/components/landing-header";
import { RecentEntriesSection } from "@/features/journal/components/recent-entries-section";
import { Reveal } from "@/features/journal/components/reveal";
import { TrustStrip } from "@/features/journal/components/trust-strip";

const features = [
  {
    title: "Ritual-first writing",
    description:
      "A calm entry flow that opens with the right prompt, mood, and pace for the moment you are in.",
    accent: "bg-amber/16 border-amber/30",
  },
  {
    title: "Private reflection library",
    description:
      "Find old entries through feelings, themes, and seasons instead of forcing your inner life into folders.",
    accent: "bg-blue/16 border-blue/30",
  },
  {
    title: "Atmospheric focus mode",
    description:
      "Soft gradients, low-friction controls, and generous typography make long writing sessions feel unhurried.",
    accent: "bg-sage/16 border-sage/30",
  },
  {
    title: "Thoughtful continuity",
    description:
      "Gentle recaps help you notice patterns without turning reflection into analytics homework.",
    accent: "bg-rose/16 border-rose/30",
  },
];

const testimonials = [
  {
    quote:
      "It feels less like opening software and more like entering a quiet room I want to return to.",
    name: "Mira S.",
    role: "Founder",
  },
  {
    quote:
      "The interface gets out of the way without becoming invisible. It has a presence, but a calm one.",
    name: "Adrian L.",
    role: "Designer",
  },
  {
    quote:
      "I stopped chasing a perfect journaling system and started writing again. That was the whole point.",
    name: "Noor K.",
    role: "Therapist",
  },
];

const faqs = [
  {
    question: "Is authentication included yet?",
    answer:
      "Not yet. This landing page focuses on the premium product experience first. Authentication and Supabase can be added once the core interface is settled.",
  },
  {
    question: "Will the journal work well on mobile?",
    answer:
      "Yes. The layout uses responsive grids, fluid spacing, and touch-friendly controls so the writing experience remains calm on smaller screens.",
  },
  {
    question: "Why dark mode by default?",
    answer:
      "The product is designed for quiet morning and evening reflection, so the palette reduces glare and keeps the writing surface intimate.",
  },
  {
    question: "Can the design system grow from here?",
    answer:
      "Yes. Buttons, cards, fields, surfaces, typography, shadows, and motion are tokenized and reusable across future journal screens.",
  },
];

export function JournalHome() {
  return (
    <AppShell>
      <a
        className="ds-focus-visible sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-porcelain focus:px-4 focus:py-2 focus:text-ink"
        href="#main"
      >
        Skip to content
      </a>

      <LandingHeader />

      <div id="main">
        <section
          className="relative grid min-h-[calc(100vh-5rem)] items-center gap-12 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:py-20"
          id="top"
        >
          <Reveal>
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex rounded-full border border-white/10 bg-white/[0.055] px-3 py-1 text-sm text-muted-strong backdrop-blur-xl">
                Built for the thoughts that need more than a notes app.
              </div>
              <h1 className="ds-text-display max-w-5xl text-5xl sm:text-7xl lg:text-8xl">
                A private journal that feels like exhaling.
              </h1>
              <p className="ds-text-body mt-7 max-w-2xl text-lg sm:text-xl">
                Aster is a premium digital journal for unhurried reflection,
                quiet pattern-finding, and the kind of writing you want to keep
                returning to.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <AnchorButton href="#preview" size="lg">
                  Start with today
                </AnchorButton>
                <AnchorButton href="#features" size="lg" variant="secondary">
                  Explore the experience
                </AnchorButton>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <HeroPromptCard />
          </Reveal>
        </section>

        <div className="pb-16">
          <TrustStrip />
        </div>

        <section className="py-16" id="features">
          <Reveal>
            <div className="mb-8 max-w-3xl">
              <p className="ds-caption">Features</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-porcelain sm:text-5xl">
                Designed for reflection, not productivity theater.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-2">
            {features.map((feature, index) => (
              <Reveal delay={0.08 * index} key={feature.title}>
                <Card
                  className="h-full p-6"
                  variant={index === 0 ? "elevated" : "frosted"}
                >
                  <div
                    className={`mb-8 h-10 w-10 rounded-full border ${feature.accent}`}
                  />
                  <h3 className="text-xl font-medium text-porcelain">
                    {feature.title}
                  </h3>
                  <p className="ds-text-body mt-3 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          className="grid gap-8 py-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-center"
          id="preview"
        >
          <Reveal>
            <div>
              <p className="ds-caption">Journal preview</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-porcelain sm:text-5xl">
                A writing surface with atmosphere and restraint.
              </h2>
              <p className="ds-text-body mt-5 text-base">
                The editor is intentionally spacious. Metadata stays quiet,
                prompts feel conversational, and motion adds orientation without
                competing with the words.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <AnchorButton href="#library">Browse library</AnchorButton>
                <AnchorButton href="#footer" variant="ghost">
                  Request access
                </AnchorButton>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <AnimatedJournalPreview />
          </Reveal>
        </section>

        <RecentEntriesSection />

        <section className="py-16" id="testimonials">
          <Reveal>
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="ds-caption">Testimonials</p>
                <h2 className="mt-3 text-4xl font-semibold text-porcelain">
                  People come back because it feels human.
                </h2>
              </div>
              <p className="ds-text-body max-w-md text-sm">
                Aster is shaped for writers, founders, therapists, designers,
                and anyone who wants a more intentional place to think.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((item, index) => (
              <Reveal delay={0.1 * index} key={item.name}>
                <Card className="h-full p-6" variant="quiet">
                  <p className="text-lg leading-8 text-muted-strong">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="mt-8 border-t border-white/10 pt-4">
                    <p className="font-medium text-porcelain">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">{item.role}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        <section
          className="grid gap-8 py-16 lg:grid-cols-[0.78fr_1.22fr]"
          id="faq"
        >
          <Reveal>
            <div>
              <p className="ds-caption">FAQ</p>
              <h2 className="mt-3 text-4xl font-semibold leading-tight text-porcelain">
                Quiet answers before the next chapter.
              </h2>
            </div>
          </Reveal>
          <FaqAccordion items={faqs} />
        </section>

        <footer
          className="mb-6 rounded-lg border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl"
          id="footer"
        >
          <Reveal>
            <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <p className="ds-caption">Aster Journal</p>
                <h2 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight text-porcelain">
                  Make room for the thought underneath the thought.
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <AnchorButton href="#top">Return to top</AnchorButton>
                <AnchorButton
                  href="mailto:hello@asterjournal.app"
                  variant="secondary"
                >
                  Request access
                </AnchorButton>
              </div>
            </div>
            <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-sm text-muted md:flex-row">
              <span>Built with Next.js, Tailwind CSS, and Framer Motion.</span>
              <span>Private reflection, beautifully held.</span>
            </div>
          </Reveal>
        </footer>
      </div>
    </AppShell>
  );
}
