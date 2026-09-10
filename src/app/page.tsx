import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="relative flex min-h-screen items-center justify-center bg-white px-6 dark:bg-black">
        <p className="max-w-md text-center text-lg text-zinc-500 dark:text-zinc-400">
          Rest of the portfolio goes here — selected work, case studies, about, contact.
        </p>
      </section>
    </main>
  );
}
