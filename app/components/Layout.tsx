export default function Layout({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string | undefined;
}) {
  return <div className={`mx-auto max-w-7xl ${className}`}>{children}</div>;
}
