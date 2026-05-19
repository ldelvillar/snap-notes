import Link from 'next/link';

export default function Cta() {
  return (
    <section className="px-4 py-24 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-linear-to-br from-primary/15 via-primary/5 to-transparent p-14 text-center">
          {/* Background glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-1/2 size-[400px] -translate-x-1/2 rounded-full bg-primary/15 blur-[80px]"
          />

          <div className="relative">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Ready to take better notes?
            </h2>
            <p className="mb-10 text-lg text-white/55">
              Join thousands of users who trust Snap Notes for their most
              important thoughts.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/50 active:scale-95"
              >
                Start for free →
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center rounded-xl border border-white/15 bg-white/5 px-8 py-3.5 font-semibold text-white/70 transition-all hover:border-white/25 hover:bg-white/8 hover:text-white"
              >
                Read the FAQ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
