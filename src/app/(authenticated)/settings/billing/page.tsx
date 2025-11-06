"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ContentSkeleton from "@/components/ContentSkeleton";
import Toast from "@/components/Toast";
import { useAuth } from "@/context/useGlobalContext";
import { PLANS } from "@/data/plans";

type Plan = "free" | "pro" | "team";

export default function BillingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Mock data
  const [currentPlan] = useState<Plan>("free");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    document.title = "Billing & Subscription | SnapNotes";
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute(
        "content",
        "Manage your subscription and billing settings on SnapNotes"
      );
  }, []);

  const handleCancelSubscription = () => {
    setToastMessage("Subscription cancelled successfully");
    setShowToast(true);
  };

  const getPlanInfo = (plan: Plan) => {
    const planMap: { [key in Plan]: number } = {
      free: 0,
      pro: 1,
      team: 2,
    };

    const selectedPlan = PLANS[planMap[plan]];

    return {
      name: selectedPlan.name,
      price:
        selectedPlan.price === "$0"
          ? "$0/month"
          : `${selectedPlan.price}/month`,
      features: selectedPlan.features,
    };
  };

  if (loading) {
    return (
      <div className="mt-12 mx-10 md:mx-20">
        <ContentSkeleton lines={3} />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  const planInfo = getPlanInfo(currentPlan);

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}

      <div className="max-w-4xl space-y-6">
        {/* Current Plan */}
        <section className="rounded-lg border border-border">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-text-100 mb-4">
              Current Plan
            </h2>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-text-100 mb-2">
                  {planInfo.name}
                </p>
                <p className="text-xl text-primary mb-4">{planInfo.price}</p>
                <ul className="space-y-2">
                  {planInfo.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-text-300"
                    >
                      <svg
                        className="size-5 text-green-500 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/upgrade"
                  className="px-4 py-2 text-center text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {currentPlan === "free" ? "Upgrade Plan" : "Change Plan"}
                </Link>
                {currentPlan !== "free" && (
                  <button
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 text-red-400 border border-red-400/50 rounded-lg hover:bg-red-400/10 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400/50"
                  >
                    Cancel Plan
                  </button>
                )}
              </div>
            </div>
            {currentPlan !== "free" && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-gray-400">
                  Next billing date:{" "}
                  <span className="text-gray-200">November 1, 2025</span>
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
