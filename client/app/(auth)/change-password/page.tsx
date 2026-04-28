"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP sending
      setTimeout(() => {
        setStep('otp');
        setIsLoading(false);
        alert('OTP sent to your email address');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      alert('Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter the 6-digit OTP code');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate OTP verification
      setTimeout(() => {
        if (otp === '123456') {
          setStep('password');
          setIsLoading(false);
        } else {
          setIsLoading(false);
          alert('Invalid OTP. Please try again.');
        }
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      alert('Failed to verify OTP. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate password change
      setTimeout(() => {
        setIsLoading(false);
        alert('Password changed successfully!');
        router.push('/dashboard/lecturer/settings');
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      alert('Failed to change password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Change Password</CardTitle>
          <p className="text-gray-600">Secure password change with OTP verification</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Email Verification */}
          {step === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <Input
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full"
                />
              </div>
              <Button
                onClick={handleSendOTP}
                disabled={isLoading || !email}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Sending...' : 'Send OTP'}
              </Button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter OTP Code
                </label>
                <p className="text-sm text-gray-600 mb-2">
                  We sent a 6-digit code to {email}
                </p>
                <Input
                  label="OTP Code"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="123456"
                  className="w-full text-center text-lg"
                  maxLength={6}
                />
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleVerifyOTP}
                  disabled={isLoading || otp.length !== 6}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setStep('email')}
                  className="w-full"
                >
                  Back to Email
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <Input
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleChangePassword}
                  disabled={isLoading || !newPassword || !confirmPassword}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? 'Changing...' : 'Change Password'}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setStep('otp')}
                  className="w-full"
                >
                  Back to OTP
                </Button>
              </div>
            </div>
          )}

          {/* Back to Settings */}
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard/lecturer/settings')}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
