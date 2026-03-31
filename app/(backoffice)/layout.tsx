export default function BackofficeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh">
      {/* Admin sidebar will be added in a future sprint */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
