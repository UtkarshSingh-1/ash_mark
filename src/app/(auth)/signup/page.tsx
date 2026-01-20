"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState<"signup" | "verify">("signup")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [otp, setOtp] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const sendOtp = async () => {
    setLoading(true)
    const res = await fetch("/api/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (!res.ok) toast({ variant: "destructive", title: data.error })
    else {
      toast({ title: "OTP sent to your email" })
      setStep("verify")
    }
    setLoading(false)
  }

  const verifyOtp = async () => {
    setLoading(true)
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, otp }),
    })

    const data = await res.json()
    if (!res.ok) {
      toast({ variant: "destructive", title: data.error })
      setLoading(false)
      return
    }

    toast({ title: "Account created" })

    const login = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">

          {step === "signup" && (
            <>
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                  <Button variant="ghost" className="absolute right-0 top-0" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
              </div>
              <Button onClick={sendOtp} disabled={loading}>
                {loading ? "Sending OTP..." : "Verify Email"}
              </Button>
            </>
          )}

          {step === "verify" && (
            <>
              <Label>Enter OTP</Label>
              <Input value={otp} onChange={e => setOtp(e.target.value)} />
              <Button onClick={verifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Create Account"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
