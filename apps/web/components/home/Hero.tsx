import Button from "@/components/ui/Button";

export default function Hero() {
  return (
    <section className="flex min-h-[90vh] flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold">
        Welcome to CodeClash
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-gray-600">
        Practice coding, compete with others, and improve your problem-solving
        skills.
      </p>

      <Button>Get Started</Button>
    </section>
  );
}