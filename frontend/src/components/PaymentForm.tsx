'use client';

import { useState, FormEvent } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import Lock from '@/assets/Lock';
import { useAuth } from '@/context/useGlobalContext';
import { PlanName } from '@/types';

interface PaymentFormProps {
  planName: string;
  planPrice: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentForm({
  planName,
  planPrice,
  onSuccess,
  onCancel,
}: PaymentFormProps) {
  const API_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
  const stripe = useStripe();
  const elements = useElements();
  const { refreshSession } = useAuth();

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateUserSubscription = async (plan: PlanName) => {
    const response = await fetch(`${API_URL}/auth/subscription`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ plan }),
    });

    if (!response.ok) {
      throw new Error('Failed to update subscription');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/settings/billing`,
        },
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'An unexpected error occurred.');
      } else if (paymentIntent?.status === 'succeeded') {
        await updateUserSubscription(planName.toLowerCase() as PlanName);
        await refreshSession();

        onSuccess?.();
        // Use window.location for hard redirect to prevent useEffect from redirecting elsewhere
        window.location.href = '/settings/billing';
      }
    } catch (err) {
      setErrorMessage('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-border bg-bg-sidebar p-5">
        <h3 className="mb-4 text-lg font-semibold text-text-100">
          Payment Details
        </h3>
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="rounded-lg bg-bg-danger px-4 py-3 text-sm text-text-danger">
          {errorMessage}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="flex-1 rounded-lg border border-border bg-transparent px-6 py-3 font-medium text-text-200 transition-colors hover:bg-bg-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!stripe || isProcessing}
          className="flex-1 rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div
                className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"
                role="status"
                aria-label="Processing payment"
              />
              <span>Processing...</span>
            </div>
          ) : (
            `Pay ${planPrice}`
          )}
        </button>
      </div>

      {/* Security Note */}
      <p className="text-center text-xs text-text-400">
        <Lock className="mr-1 inline-block size-4" />
        Your payment is secured with SSL encryption
      </p>
    </form>
  );
}
