export default function Footer() {
  return (
    <footer className="border-t border-border py-6 px-6">
      <div className="max-w-5xl mx-auto flex justify-between items-center flex-wrap gap-2">
        {/* Logo */}
        <span className="font-display text-sm text-text-muted">Algormn</span>

        {/* Center */}
        <span className="font-ui text-xs text-text-muted">
          Built in India 🇮🇳
        </span>

        {/* Copyright */}
        <span className="font-ui text-xs text-text-muted">© 2026</span>
      </div>
    </footer>
  );
}
