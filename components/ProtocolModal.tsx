import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocolNumber: number;
  clientName: string;
}

export default function ProtocolModal({ isOpen, onClose, protocolNumber, clientName }: ProtocolModalProps) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <div>
                  {/* Logo/Brand Header */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                    <CheckCircleIcon className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>
                  
                  {/* Title */}
                  <div className="mt-5 text-center">
                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900">
                      Protocol Analysis Complete
                    </Dialog.Title>
                    
                    {/* Subtitle */}
                    <div className="mt-3">
                      <p className="text-sm text-gray-600">
                        Advanced AI Analysis Results
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Main Content */}
                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Recommended Protocol for
                    </p>
                    <p className="text-lg font-semibold text-gray-900 mb-4">
                      {clientName}
                    </p>
                    
                    {/* Protocol Number Display */}
                    <div className="bg-white rounded-full mx-auto w-24 h-24 flex items-center justify-center shadow-md border-4 border-indigo-200">
                      <span className="text-3xl font-bold text-indigo-600">
                        #{protocolNumber}
                      </span>
                    </div>
                    
                    <p className="mt-4 text-xs text-gray-500">
                      Based on comprehensive EEG brain mapping analysis
                    </p>
                  </div>
                </div>
                
                {/* Footer */}
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-center text-gray-600">
                    This protocol recommendation has been generated using advanced pattern recognition 
                    and is based on page 10 of the uploaded neurofeedback report.
                  </p>
                </div>
                
                {/* Action Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
                    onClick={onClose}
                  >
                    Continue to Client Dashboard
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
