import React from 'react';

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SubscriptionRequiredModal({
  isOpen,
  onClose,
}: SubscriptionRequiredModalProps) {
  if (!isOpen) return null;

  const handleSubscribe = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal positioning trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          {/* Close button */}
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <span className="sr-only">Close</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Icon */}
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg
                className="h-6 w-6 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Subscription Required
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Your subscription has expired. To continue uploading brain maps and creating new clients, please reactivate your subscription.
                </p>
              </div>
            </div>
          </div>

          {/* Subscription Options */}
          <div className="mt-6 space-y-3">
            {/* Monthly Option */}
            <div className="rounded-lg border-2 border-gray-300 p-4 hover:border-indigo-500 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Monthly Plan</p>
                  <p className="text-xs text-gray-500">Pay as you go</p>
                </div>
                <p className="text-xl font-bold text-gray-900">$40<span className="text-sm font-normal text-gray-500">/mo</span></p>
              </div>
              <button
                type="button"
                onClick={() => handleSubscribe('https://buy.stripe.com/4gMaEX0fI7oReCU1bke3e03')}
                className="w-full inline-flex justify-center rounded-md border-2 border-indigo-600 px-4 py-2 text-sm font-semibold text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Reactivate Monthly
              </button>
            </div>

            {/* Annual Option */}
            <div className="rounded-lg border-2 border-indigo-600 p-4 bg-indigo-50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  BEST VALUE - Save $80
                </span>
              </div>
              <div className="flex items-center justify-between mb-3 mt-1">
                <div>
                  <p className="text-sm font-semibold text-gray-900">Annual Plan</p>
                  <p className="text-xs text-gray-600">Save 2 months</p>
                </div>
                <p className="text-xl font-bold text-gray-900">$400<span className="text-sm font-normal text-gray-500">/yr</span></p>
              </div>
              <button
                type="button"
                onClick={() => handleSubscribe('https://buy.stripe.com/9B63cv0fI24x0M4g6ee3e04')}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
              >
                Reactivate Annually
              </button>
            </div>
          </div>

          {/* Close Button */}
          <div className="mt-5">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

