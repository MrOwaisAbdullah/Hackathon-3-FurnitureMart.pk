"use client";

import { Check, CircleDot } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckoutProgressProps {
  currentStep: "details" | "shipping" | "payment" | "confirmation";
  className?: string;
}

const steps = [
  { id: "details", label: "Details" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" },
] as const;

export function CheckoutProgress({
  currentStep,
  className,
}: CheckoutProgressProps) {
  const getCurrentStepIndex = () => {
    return steps.findIndex((step) => step.id === currentStep);
  };

  return (
    <div className={cn("w-full mx-auto", className)}>
      {/* Desktop Progress Bar */}
      <div className="hidden sm:block">
        <div className="relative py-8">
          {/* Progress Line */}
          <div
            className="absolute left-4 top-[38%] h-1 w-[95%] -translate-y-1/3 bg-muted"
            aria-hidden="true"
          >
            <div
              className="h-full bg-primary transition-all duration-500 ease-in-out"
              style={{
                width: `${(getCurrentStepIndex() / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = getCurrentStepIndex() > index;
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center"
                >
                  <div
                    className={cn(
                      "relative flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-200",
                      isCompleted
                        ? "border-primary bg-primary text-primary-foreground"
                        : isCurrent
                        ? "border-primary bg-background"
                        : "border-muted-foreground bg-background"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 font-bold text-white" />
                    ) : isCurrent ? (
                      <CircleDot className="h-5 w-5 text-primary" />
                    ) : (
                      <span className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "mt-2 text-sm font-medium",
                      isCurrent
                        ? "text-primary"
                        : isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Progress Bar */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <div className="relative">
              {/* Progress Line */}
              <div
                className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-muted"
                aria-hidden="true"
              >
                <div
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{
                    width: `${(getCurrentStepIndex() / (steps.length - 1)) * 100}%`,
                  }}
                />
              </div>

              {/* Steps */}
              <div className="relative flex justify-between">
                {steps.map((step, index) => {
                  const isCompleted = getCurrentStepIndex() > index;
                  const isCurrent = currentStep === step.id;

                  return (
                    <div key={step.id} className="flex flex-col items-center">
                      <div
                        className={cn(
                          "relative flex h-6 w-6 items-center justify-center rounded-full border-2 transition-colors duration-200",
                          isCompleted
                            ? "border-primary bg-primary text-primary-foreground"
                            : isCurrent
                            ? "border-primary bg-background"
                            : "border-muted-foreground bg-background"
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-3 w-3  text-white" />
                        ) : isCurrent ? (
                          <CircleDot className="h-3 w-3 text-primary" />
                        ) : (
                          <span className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Step Label */}
        <div className="mt-4 text-center">
          <span className="text-sm font-medium text-primary">
            {steps.find((step) => step.id === currentStep)?.label}
          </span>
          <span className="text-sm text-muted-foreground">
            {" "}
            ({getCurrentStepIndex() + 1} of {steps.length})
          </span>
        </div>
      </div>
    </div>
  );
}