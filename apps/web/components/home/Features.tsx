export default function Features() {
  return (
    <section className="px-6 py-20">
      <h2 className="text-center text-4xl font-bold">
        Why Choose CodeClash?
      </h2>

      <div className="mt-12 grid gap-8 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h3 className="text-xl font-semibold">
            Practice Problems
          </h3>

          <p className="mt-3 text-gray-600">
            Solve coding questions from easy to hard.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="text-xl font-semibold">
            Live Battles
          </h3>

          <p className="mt-3 text-gray-600">
            Challenge your friends in real-time coding battles.
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h3 className="text-xl font-semibold">
            Leaderboards
          </h3>

          <p className="mt-3 text-gray-600">
            Compete globally and climb the rankings.
          </p>
        </div>
      </div>
    </section>
  );
}