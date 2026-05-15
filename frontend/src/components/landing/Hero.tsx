import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-36 pb-24 text-white">
      {/* Radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 size-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
      />

      <div className="relative mx-auto max-w-lg text-center">
        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
          ✨ Simple, fast, secure note-taking
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-5xl leading-tight font-bold tracking-tight md:text-6xl lg:text-7xl">
          All your notes, <span className="text-primary">in one place</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-xl text-lg text-white/55">
          Capture your thoughts, organize your ideas, and access them from
          anywhere. Free forever.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-95"
          >
            Start for free →
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/8 hover:text-white"
          >
            See features
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="relative mx-auto mt-20 max-w-lg px-4">
        <div className="grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/4 py-6 backdrop-blur-sm">
          <div className="px-6 text-center">
            <p
              className="text-3xl font-bold md:text-4xl"
              aria-label="15,000 plus active users"
            >
              15k+
            </p>
            <p className="mt-1 text-xs text-white/45">Active Users</p>
          </div>
          <div className="px-6 text-center">
            <p
              className="text-3xl font-bold md:text-4xl"
              aria-label="30,000 plus total downloads"
            >
              30k+
            </p>
            <p className="mt-1 text-xs text-white/45">Downloads</p>
          </div>
          <div className="px-6 text-center">
            <p
              className="text-3xl font-bold md:text-4xl"
              aria-label="10,000 plus customers"
            >
              10k+
            </p>
            <p className="mt-1 text-xs text-white/45">Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
