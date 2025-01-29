"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Toaster, toast } from "sonner"
import { axiosHelper } from "@/app/utils/axiosHelper"
import Link from "next/link"

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
   const email = searchParams?.get("email") || ""
  const otp = searchParams?.get("otp") || ""
  console.log(email,"email")
  console.log(otp,"otp")
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

 

    try {
      setIsLoading(true)
      const response = await axiosHelper({
        method: "POST",
        url: "/auth/reset-password",
        data: { email, otp, newPassword, confirmPassword },
      })

      if (response) {
        toast.success("Password reset successful! Redirecting to login")
        setTimeout(() => {
          router.push("/login")
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
      <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <label className="block mb-2 font-semibold" htmlFor="newPassword">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                className="border p-2 w-full rounded-md pr-10"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div className="mb-6">
            <label className="block mb-2 font-semibold" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              className="border p-2 w-full rounded-md"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-orange-400 hover:bg-orange-600 text-white px-4 py-2 rounded-md w-full transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

