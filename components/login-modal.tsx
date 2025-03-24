"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: (phone: string) => void
}

export default function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [otp, setOtp] = useState("")
  const { toast } = useToast()

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!phone || phone.length !== 10 || !/^\d+$/.test(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit phone number",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate OTP sending
    setTimeout(() => {
      setIsLoading(false)
      setStep("otp")

      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${phone}`,
      })
    }, 1500)
  }

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!otp || otp.length !== 4 || !/^\d+$/.test(otp)) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate OTP verification
    setTimeout(() => {
      setIsLoading(false)
      onLogin(phone)
      resetForm()
    }, 1500)
  }

  const resetForm = () => {
    setPhone("")
    setOtp("")
    setStep("phone")
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{step === "phone" ? "Sign In / Register" : "Verify Phone Number"}</DialogTitle>
          <DialogDescription>
            {step === "phone" ? "Enter your phone number to continue" : `Enter the 4-digit code sent to ${phone}`}
          </DialogDescription>
        </DialogHeader>

        {step === "phone" ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                maxLength={10}
                className="border-gray-300 focus:border-red-500 focus:ring-red-500"
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={isLoading}>
                {isLoading ? "Sending OTP..." : "Continue"}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp">Verification Code</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 4-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={4}
                className="border-gray-300 focus:border-red-500 focus:ring-red-500 text-center text-lg tracking-widest"
              />
            </div>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("phone")}
                className="text-sm text-blue-500 hover:text-blue-700"
              >
                Change phone number
              </button>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

