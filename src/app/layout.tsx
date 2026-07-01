import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import SignOutButton from "@/components/SignOutButton";
import ToastHub from "@/components/ToastHub";
import ProfileMenu from "@/components/ProfileMenu";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className="bg-[--color-bg] text-[--color-text]">
        <header className="border-b border-[--color-border] bg-[--color-surface]">
          <nav className="container py-4 flex items-center gap-4">
            <a href="/" className="font-semibold">Home</a>
            <a href="/users">Users</a>
            <a href="/rides">Rides</a>
            <a href="/rides/new">New Ride</a>

            <span className="flex-1" />

          {session ? (
            <ProfileMenu
              label={(session.user?.name ?? session.user?.email) || "User"}
              role={(session.user as any)?.role}
            />
          ) : (
            <a className="btn-primary" href="/signin">Sign in</a>
          )}
          </nav>
        </header>
        {children}
        <ToastHub /> 
      </body>
    </html>
  );
}
