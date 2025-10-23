import Link from "next/link";

export default function Cta() {
  return (
    <section className="py-20 px-4 text-white">
      <div className="max-w-3xl mx-auto">
        <div className="bg-primary/10 rounded-lg p-12 text-center border border-primary/20">
          <h2 className="text-3xl font-bold mb-4">
            Ready to take better notes?
          </h2>
          <p className="text-[#b09eb8] text-lg mb-8">
            Join thousands of users who trust Snap Notes for their most
            important thoughts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="px-8 py-3 bg-primary font-bold rounded-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105"
            >
              View Pricing
            </Link>
            <Link
              href="/faq"
              className="px-8 py-3 bg-[#332938] font-bold rounded-lg hover:bg-[#3a303d] transition-all duration-300 border border-primary/30"
            >
              See FAQ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
