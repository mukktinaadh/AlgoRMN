import NewsletterForm from "./NewsletterForm";

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center max-w-3xl mx-auto px-6">
      <div className="animate-fade-in-up">
        {/* Kicker */}
        <p className="font-ui text-xs tracking-[0.2em] uppercase text-accent mb-4">
          Engineering Deep-Dives
        </p>

        {/* Headline */}
        <h1 className="font-display text-6xl sm:text-7xl md:text-8xl text-text-primary leading-none mb-6">
          Systems, not syntax.
        </h1>

        {/* Tagline */}
        <p className="font-body text-base text-text-secondary max-w-xl mb-10">
          One deep engineering breakdown every week. No tutorials. No fluff.
          Just how systems actually work.
        </p>

        {/* Subscribe form */}
        <div className="max-w-md">
          <NewsletterForm />
        </div>

        {/* Social proof */}
        <p className="font-ui text-xs text-text-muted mt-3">
          Join 1,240 engineers
        </p>
      </div>
    </section>
  );
}
