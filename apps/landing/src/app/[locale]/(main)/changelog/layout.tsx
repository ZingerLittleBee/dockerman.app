export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return <main className="mx-auto mt-36 w-full max-w-4xl px-4 pb-20 md:px-8">{children}</main>
}
