"use client"

import { useState,useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { axiosHelper } from "@/app/utils/axiosHelper"
import { Toaster, toast } from "sonner"
import { useRouter } from "next/navigation"
import { sendPasswordResetOtp } from "@/app/service/userService";



export default function FindUser() {
    const router=useRouter()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const initialEmail = searchParams?.get("email") || ""

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const success = await sendPasswordResetOtp(email);
      if (success) {
        toast.success("Password reset otp sent to your email!")
        router.push(`/otp-verify?email=${encodeURIComponent(email)}`);
      }

    } catch (error) {
      toast.error("Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-gray-200 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-4">Find Your Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="border text-black p-2 w-full rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded w-full ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send Reset OTP"}
          </button>
        </form>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}

