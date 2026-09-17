import { createFileRoute } from "@tanstack/react-router";
import hero from "@/assets/itrkunj-hero.jpg";
import duo from "@/assets/attar-duo.jpg";
export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Our Story — Itrkunj" },
      {
        name: "description",
        content: "Discover Itrkunj's devotion to the centuries-old attar craft of Kannauj.",
      },
      { property: "og:title", content: "Our Story — Itrkunj" },
      {
        property: "og:description",
        content: "Discover Itrkunj's devotion to the centuries-old attar craft of Kannauj.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});
function About() {
  return (
    <div>
      <section className="relative h-[60vh]">
        <img
          src={hero}
          alt="Itrkunj attar workshop inspiration"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 grid place-items-center bg-ink/45 px-4 text-center text-ink-foreground">
          <div>
            <p className="text-xs uppercase tracking-[.3em] text-gold">
              A house of fragrant memory
            </p>
            <h1 className="mt-4 text-6xl md:text-8xl">Born from devotion</h1>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-6xl gap-12 px-4 py-20 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-widest text-gold-strong">Our beginning</p>
          <h2 className="mt-4 text-5xl text-primary">Where fragrance is a living tradition</h2>
        </div>
        <p className="text-sm leading-8 text-muted-foreground">
          Itrkunj began with a simple belief: fragrance should bring us closer—to memory, to ritual,
          and to ourselves. We work with artisans inspired by Kannauj's centuries-old craft, pairing
          time-honoured hydro-distillation with a quiet modern sensibility. Every composition is
          alcohol-free, concentrated and made to unfold intimately on skin.
        </p>
      </section>
      <section className="grid bg-secondary md:grid-cols-2">
        <img
          loading="lazy"
          src={duo}
          alt="Oud and rose attar bottles"
          className="h-full min-h-[500px] w-full object-cover"
        />
        <div className="flex items-center p-8 md:p-16">
          <div>
            <p className="text-xs uppercase tracking-widest text-gold-strong">The journey</p>
            {[
              ["2018", "A family archive of recipes inspires Itrkunj."],
              ["2020", "Our first devotional attars are composed."],
              ["2023", "The house expands into personal fragrances."],
              ["Today", "A new generation discovers the ritual of itr."],
            ].map((x) => (
              <div
                key={x[0]}
                className="grid grid-cols-[70px_1fr] gap-5 border-l border-gold py-6 pl-6"
              >
                <b className="font-display text-xl text-primary">{x[0]}</b>
                <p className="text-sm text-muted-foreground">{x[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
