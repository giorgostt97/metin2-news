export default function Footer() {
  return (
    <footer className="border-t border-zinc-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black text-yellow-400">
              Metin2Top
            </h3>

            <p className="text-zinc-500 mt-2">
              Discover the best Metin2 private servers.
            </p>
          </div>

          <div className="flex gap-6 text-zinc-400">
            <a
              href="/"
              className="hover:text-yellow-400"
            >
              Home
            </a>

            <a
              href="/news"
              className="hover:text-yellow-400"
            >
              News
            </a>

            <a
              href="/submit"
              className="hover:text-yellow-400"
            >
              Submit
            </a>
          </div>
        </div>

        <div className="border-t border-zinc-800 mt-8 pt-6 text-center text-zinc-600 text-sm">
          © 2026 Metin2Top. All rights reserved.
        </div>
      </div>
    </footer>
  );
}