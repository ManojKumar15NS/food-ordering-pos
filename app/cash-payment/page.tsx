"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function CashPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount") || "0.00"
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)
  const { toast } = useToast()

  const handleConfirmPayment = () => {
    setPaymentConfirmed(true)

    toast({
      title: "Payment Confirmed",
      description: "Cash payment has been confirmed",
      duration: 3000,
    })

    // Generate a random token number
    const tokenNumber = Math.floor(1000 + Math.random() * 9000).toString()

    // After 2 seconds, show the token generated toast
    setTimeout(() => {
      toast({
        title: "Token Generated",
        description: `Token number: ${tokenNumber}`,
        duration: 5000,
      })
    }, 2000)
  }

  const handleGoBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl text-center">Cash Payment</CardTitle>
          <CardDescription className="text-center">Confirm if the customer has paid the amount</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Amount to be collected</p>
            <p className="text-3xl font-bold text-gray-800">₹{amount}</p>
          </div>

          {paymentConfirmed ? (
            <div className="flex flex-col items-center justify-center py-6">
              <div className="bg-green-100 p-4 rounded-full mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-lg font-medium text-green-600">Payment Confirmed!</p>
              <p className="text-sm text-gray-500 mt-2">The payment has been successfully processed.</p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4">
              <p className="text-sm text-gray-600">
                Please confirm if the customer has paid the cash amount of ₹{amount}.
              </p>
              <p className="text-sm text-gray-600">After confirmation, a token will be generated for the order.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          {paymentConfirmed ? (
            <Button onClick={handleGoBack} className="w-full bg-blue-500 hover:bg-blue-600">
              <ArrowLeft className="h-4 w-4 mr-2" /> Return to Menu
            </Button>
          ) : (
            <>
              <Button onClick={handleConfirmPayment} className="w-full bg-green-500 hover:bg-green-600">
                Confirm Payment
              </Button>
              <Button onClick={handleGoBack} variant="outline" className="w-full">
                Cancel
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

