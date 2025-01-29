"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Toaster, toast } from "sonner"
import { axiosHelper } from "@/app/utils/axiosHelper"

export default function VerifyOtp() {
    const searchParams = useSearchParams();
  const [otp, setOtp] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const email = searchParams?.get("email") || ""; 
  console.log(email,"email")


  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        console.log("email",email,"otp",otp)
      setIsLoading(true)
      const response = await axiosHelper({
        method: "POST",
        url: "/auth/verify",
        data: {email, otp },
      })

      if (response) {
        toast.success("Verification successful! Now enter your new Password")
        setTimeout(() => {

          router.push(`/reset-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`)
        }, 2000)
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(err.response.data.error)
      } else {
        toast.error("An unexpected error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Verify OTP</h1>
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleVerifyOtp}>
          <label className="block mb-2 font-semibold" htmlFor="otp">
            Enter OTP
          </label>
          <input
            id="otp"
            type="text"
            className="border p-2 w-full rounded-md mb-4"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded-md w-full transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  )
}

