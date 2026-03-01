// Matches page gets its own full-screen layout — no global Navbar/Footer
export default function MatchesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
