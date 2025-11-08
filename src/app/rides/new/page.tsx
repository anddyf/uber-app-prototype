import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import NewRideClient from "./_client";

export default async function NewRidePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <main className="min-h-screen bg-[--color-bg] text-[--color-text]">
        <section className="container py-12">
          <p>
            You must <a className="text-brand underline" href="/signin">sign in</a> to create rides.
          </p>
        </section>
      </main>
    );
  }
  return <NewRideClient />;
}
