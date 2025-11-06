import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-[700px] text-center text-white overflow-hidden">
      <div className="mt-40 mx-auto flex flex-col items-center z-10">
        <h1 className="max-w-md mb-6 font-bold text-4xl md:text-5xl lg:text-6xl text-gray-50">
          All your notes, in one place
        </h1>
        <p className="max-w-2xl  mb-8 text-lg text-gray-200 text-center">
          The #1 app to organize and manage your notes efficiently and securely.
        </p>
        <div className="flex flex-col md:flex-row items-center gap-3 font-medium">
          <Link
            href="/notes"
            className="inline-block px-6 py-3 text-white text-center bg-primary border-2 border-primary rounded-lg shadow-lg transition hover:bg-primary/90 hover:border-primary/90"
          >
            Go to SnapNotes
          </Link>
          <Link
            href="/register"
            className="inline-block w-fit px-6 py-3 text-gray-100 text-center border-2 border-gray-800 rounded-lg transition-colors hover:border-gray-700"
          >
            Sign up for free
          </Link>
        </div>
      </div>

      <div className="mt-22 w-full bg-primary/10 clip-custom-hero">
        <div className="py-8 flex flex-row justify-center items-start md:items-center gap-12 md:gap-24">
          <div className="text-center md:px-24 relative border-r border-gray-500">
            <p
              className="text-3xl md:text-5xl font-semibold"
              aria-label="15,000 plus active users"
            >
              15k+
            </p>
            <p className="text-sm text-gray-500 mt-1">Active Users</p>
          </div>

          <div className="text-center md:pr-24 relative border-r border-gray-500">
            <p
              className="text-3xl md:text-5xl font-semibold"
              aria-label="30,000 plus total downloads"
            >
              30k+
            </p>
            <p className="text-sm text-gray-500 mt-1">Total Downloads</p>
          </div>

          <div className="text-center">
            <p
              className="text-3xl md:text-5xl font-semibold"
              aria-label="10,000 plus customers"
            >
              10k+
            </p>
            <p className="text-sm text-gray-500 mt-1">Customers</p>
          </div>
        </div>
      </div>
    </section>
  );
}
