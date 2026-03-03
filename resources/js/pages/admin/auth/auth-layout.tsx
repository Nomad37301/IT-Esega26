import type { ReactNode } from "react"

interface AuthLayoutProps {
    children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">{children}</div>
}
