import Link from 'next/link';

export default function Hero() {
  return (
    <section className="min-h-[700px] overflow-hidden text-center text-white">
      <div className="z-10 mx-auto mt-40 flex flex-col items-center">
        <h1 className="mb-6 max-w-md text-4xl font-bold text-gray-50 md:text-5xl lg:text-6xl">
          All your notes, in one place
        </h1>
        <p className="mb-8 max-w-2xl text-center text-lg text-gray-200">
          The #1 app to organize and manage your notes efficiently and securely.
        </p>
        <div className="flex flex-col items-center gap-3 font-medium md:flex-row">
          <Link
            href="/notes"
            className="inline-block rounded-lg border-2 border-primary bg-primary px-6 py-3 text-center text-white shadow-lg transition hover:border-primary/90 hover:bg-primary/90"
          >
            Go to SnapNotes
          </Link>
          <Link
            href="/register"
            className="inline-block w-fit rounded-lg border-2 border-gray-800 px-6 py-3 text-center text-gray-100 transition-colors hover:border-gray-700"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      <div className="clip-custom-hero mt-22 w-full bg-primary/10">
        <div className="flex flex-row items-start justify-center gap-12 py-8 md:items-center md:gap-24">
          <div className="relative border-r border-gray-500 text-center md:px-24">
            <p
              className="text-3xl font-semibold md:text-5xl"
              aria-label="15,000 plus active users"
            >
              15k+
            </p>
            <p className="mt-1 text-sm text-gray-500">Active Users</p>
          </div>

          <div className="relative border-r border-gray-500 text-center md:pr-24">
            <p
              className="text-3xl font-semibold md:text-5xl"
              aria-label="30,000 plus total downloads"
            >
              30k+
            </p>
            <p className="mt-1 text-sm text-gray-500">Total Downloads</p>
          </div>

          <div className="text-center">
            <p
              className="text-3xl font-semibold md:text-5xl"
              aria-label="10,000 plus customers"
            >
              10k+
            </p>
            <p className="mt-1 text-sm text-gray-500">Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
