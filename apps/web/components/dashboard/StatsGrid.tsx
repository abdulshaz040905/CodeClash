import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">

      <StatCard
        title="Problems Solved"
        value={34}
      />

      <StatCard
        title="Rating"
        value={1520}
      />

      <StatCard
        title="Rank"
        value="#120"
      />

    </div>
  );
}