import NewsletterForm from "./NewsletterForm";

export default function NewsletterCTA() {
  return (
    <section id="newsletter" className="bg-surface border-y border-border py-16 px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Headline */}
        <h2 className="font-display text-3xl md:text-4xl text-text-primary mb-4">
          The best engineers understand their systems.
        </h2>

        {/* Subtext */}
        <p className="font-body text-sm text-text-secondary mb-8">
          Get one deep-dive article delivered every week. System design,
          database internals, and the engineering decisions that matter.
        </p>

        {/* Form */}
        <div className="max-w-md mx-auto">
          <NewsletterForm placeholder="your@email.com" />
        </div>

        {/* Fine print */}
        <p className="font-ui text-xs text-text-muted mt-4">
          No spam. One article per week. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
