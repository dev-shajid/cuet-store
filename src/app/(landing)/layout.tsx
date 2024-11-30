import PublicLayout from "@/components/layout/PublicLayout"

export const metadata = {
  title: 'CUET E-Bazar',
  description: 'Generated by Next.js',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicLayout>
        {children}
      </PublicLayout>
    </>
  )
}
