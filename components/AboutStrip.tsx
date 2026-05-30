export default function AboutStrip() {
  return (
    <section className="bg-base py-16 px-6 border-b border-border">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left — Author */}
        <div>
          <p className="font-ui text-xs tracking-widest text-text-muted uppercase mb-4">
            Who Writes This
          </p>

          {/* Avatar circle */}
          <div className="w-12 h-12 rounded-full bg-elevated border border-border flex items-center justify-center font-display text-lg text-accent">
            R
          </div>

          {/* Name */}
          <p className="font-display text-xl text-text-primary mt-3 mb-2">
            RMN
          </p>

          {/* Bio */}
          <p className="font-body text-sm text-text-secondary leading-relaxed">
            Software Engineer writing about the internals of systems most
            engineers use but never fully understand. One article a week, built
            from first principles.
          </p>
        </div>

        {/* Right — Value props */}
        <div className="flex flex-col justify-center gap-4">
          <p className="font-ui text-sm text-text-secondary">
            <span className="text-accent mr-2">✦</span>
            One article, every week
          </p>
          <p className="font-ui text-sm text-text-secondary">
            <span className="text-accent mr-2">✦</span>
            System design from first principles
          </p>
          <p className="font-ui text-sm text-text-secondary">
            <span className="text-accent mr-2">✦</span>
            No paywalls. No padding.
          </p>
        </div>
      </div>
    </section>
  );
}
