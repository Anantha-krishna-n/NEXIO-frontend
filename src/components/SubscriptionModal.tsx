"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import axiosInstance from "@/app/utils/axiosInstance"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import stripePromise from "@/app/utils/stripe"
import { useUserStore } from "@/stores/authStore"
import { Loader2 } from "lucide-react"

interface SubscriptionPlan {
  _id: string
  name: string
  price: number
  features: string[]
}

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
}

interface SubscriptionReceipt {
  message: string
  userData: {
    subscription: {
      plan: string
      startDate: string
      endDate: string
      availableClassroom: {
        public: number
        private: number
      }
    }
  }
  remainingClassrooms: {
    public: number
    private: number
  }
  payment_info: {
    amount: number
    status: string
    created: number
  }
}

const fetchSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  try {
    const response = await axiosInstance.get("/subscription/plans")
    return response.data.subscriptions
  } catch (error) {
    console.error("Error fetching subscription plans:", error)
    throw error
  }
}

const CheckoutForm: React.FC<{
  name: string
  price: number
  onSubscriptionConfirmed: (receipt: SubscriptionReceipt) => void
}> = ({ name, price, onSubscriptionConfirmed }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) return
    setProcessing(true)

    const result = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (result.error) {
      setError(result.error.message ?? "An unknown error occurred")
    } else if (result.paymentIntent) {
      const confirmSubscription = async () => {
        try {
          console.log(result.paymentIntent,"Hello payment")
          const res = await axiosInstance.post("/auth/confirm-subscription", {
            price,
            name,
            paymentIntent: result.paymentIntent,
          })
          console.log(res.data,"Hello world")
          if (res.data.userData) {
            onSubscriptionConfirmed(res.data)
          } else {
            // canceled logic
          }
        } catch (error) {
          console.error("Error confirming subscription:", error)
        }
      }

      confirmSubscription()
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <PaymentElement />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Button type="submit" disabled={processing} className="w-full mt-4">
        {processing ? "Processing..." : "Pay Now"}
      </Button>
    </form>
  )
}

const SubscriptionReceipt: React.FC<{ receipt: SubscriptionReceipt }> = ({ receipt }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4">Subscription Confirmed</h2>
    <p className="mb-2">{receipt.message}</p>
    <p className="mb-2">
      Remaining Classrooms: Public - {receipt.remainingClassrooms?.public ?? 0}, Private - {receipt.remainingClassrooms?.private ?? 0}
    </p>
    <h3 className="text-xl font-semibold mt-4 mb-2">Plan Details</h3>
    <p><strong>Plan:</strong> {receipt.userData.subscription.plan}</p>
    <p><strong>Start Date:</strong> {new Date(receipt.userData.subscription.startDate).toLocaleString()}</p>
    <p><strong>End Date:</strong> {new Date(receipt.userData.subscription.endDate).toLocaleString()}</p>
    <h3 className="text-xl font-semibold mt-4 mb-2">Payment Information</h3>
    <p><strong>Amount:</strong> ${receipt.payment_info.amount / 100}</p>
    <p><strong>Status:</strong> {receipt.payment_info.status}</p>
    <p><strong>Date:</strong> {new Date(receipt.payment_info.created * 1000).toLocaleString()}</p>
  </div>
  )
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
  const { user } = useUserStore()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [subscriptionReceipt, setSubscriptionReceipt] = useState<SubscriptionReceipt | null>(null)

  useEffect(() => {
    const loadPlans = async () => {
      setLoading(true)
      try {
        const fetchedPlans = await fetchSubscriptionPlans()
        setPlans(fetchedPlans)
        setError(null)
      } catch (err) {
        setError("Failed to load subscription plans. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    loadPlans()
  }, [])

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    try {
      const response = await axiosInstance.post("/subscription/create-checkout-session", { planId: plan._id })
      setClientSecret(response.data.clientSecret)
    } catch (error) {
      console.error("Error creating checkout session:", error)
      setSelectedPlan(null)
    }
  }

  const handleSubscriptionConfirmed = (receipt: SubscriptionReceipt) => {
    setSubscriptionReceipt(receipt)
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] flex flex-col overflow-scroll">
        <DialogHeader>
          <DialogTitle>Subscription Plans</DialogTitle>
          <DialogDescription>Choose a plan that best fits your needs.</DialogDescription>
        </DialogHeader>
        {loading ? (
          <p>Loading plans...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : subscriptionReceipt ? (
          <SubscriptionReceipt receipt={subscriptionReceipt} />
        ) : clientSecret && selectedPlan ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              name={selectedPlan.name}
              price={selectedPlan.price}
              onSubscriptionConfirmed={handleSubscriptionConfirmed}
            />
          </Elements>
        ) : (
          <div className="grid gap-4">
            {plans.map((plan) => (
              <Card key={plan._id}>
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>${plan.price}/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5">
                    {plan.features.map((feature, index) => (
                      <li key={`${plan._id}-feature-${index}`}>{feature}</li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {selectedPlan && selectedPlan._id === plan._id ? (
                    <div className="flex items-center justify-center w-full">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                  ) : (
                    <Button className="w-full" onClick={() => handleSubscribe(plan)}>
                      Select {plan.name}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

