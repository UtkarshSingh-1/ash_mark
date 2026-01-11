"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)

  await fetch("/api/auth/request-reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })

  setLoading(false)
  setSubmitted(true)
}

    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background to-muted">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="text-3xl font-bold text-crimson-600 mb-2">ASHMARK</div>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        Enter your email to receive a password reset link
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {submitted ? (
                        <Alert className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertDescription>
                                If an account exists with that email, we've sent you instructions to reset your password.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={loading}
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Sending link..." : "Send Reset Link"}
                            </Button>
                        </form>
                    )}

                    <div className="text-center">
                        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
                            ← Back to Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
