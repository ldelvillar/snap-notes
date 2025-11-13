import Link from 'next/link';

export default function Cta() {
  return (
    <section className="px-4 py-20 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-lg border border-primary/20 bg-primary/10 p-12 text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Ready to take better notes?
          </h2>
          <p className="mb-8 text-lg text-[#b09eb8]">
            Join thousands of users who trust Snap Notes for their most
            important thoughts.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/pricing"
              className="transform rounded-lg bg-primary px-8 py-3 font-bold transition-all duration-300 hover:scale-105 hover:bg-primary/90"
            >
              View Pricing
            </Link>
            <Link
              href="/faq"
              className="rounded-lg border border-primary/30 bg-[#332938] px-8 py-3 font-bold transition-all duration-300 hover:bg-[#3a303d]"
            >
              See FAQ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
