import React from 'react';

interface ProgressIndicatorProps {
  currentStep: 'details' | 'payment' | 'confirmation';
}

const ProgressIndicator = ({ currentStep }: ProgressIndicatorProps) => {
  return (
    <div className="flex justify-between items-center mb-8">
      {/* Step 1: Shipping */}
      <div
        className={`step flex-1 text-center p-2 border-b-2 ${
          currentStep === 'details' ? 'border-primary text-primary' : 'border-gray-300 text-gray-500'
        }`}
      >
        Shipping
      </div>

      {/* Step 2: Payment */}
      <div
        className={`step flex-1 text-center p-2 border-b-2 ${
          currentStep === 'payment' ? 'border-primary text-primary' : 'border-gray-300 text-gray-500'
        }`}
      >
        Payment
      </div>

      {/* Step 3: Confirmation */}
      <div
        className={`step flex-1 text-center p-2 border-b-2 ${
          currentStep === 'confirmation' ? 'border-primary text-primary' : 'border-gray-300 text-gray-500'
        }`}
      >
        Confirmation
      </div>
    </div>
  );
};

export default ProgressIndicator;