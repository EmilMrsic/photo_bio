import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckCircleIcon, ClockIcon, BoltIcon, CalendarIcon } from '@heroicons/react/24/solid';

interface Phase {
  phase: string;
  window: string;
  cadence: string;
  duration_min: number;
  frequency_hz: number;
  intensity_percent: number;
}

interface ProtocolModalProps {
  isOpen: boolean;
  onClose: () => void;
  protocolNumber: number;
  clientName: string;
  phases?: Phase[];
  protocolLabel?: string;
}

export default function ProtocolModal({ isOpen, onClose, protocolNumber, clientName, phases = [], protocolLabel }: ProtocolModalProps) {
  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Initial':
        return 'from-blue-500 to-blue-600';
      case 'Intermediate':
        return 'from-purple-500 to-purple-600';
      case 'Advanced':
        return 'from-indigo-600 to-purple-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'Initial':
        return '🌱';
      case 'Intermediate':
        return '🌿';
      case 'Advanced':
        return '🌳';
      default:
        return '✨';
    }
  };

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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                <div>
                  {/* Logo/Brand Header */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                    <CheckCircleIcon className="h-10 w-10 text-white" aria-hidden="true" />
                  </div>

                  {/* Title */}
                  <div className="mt-5 text-center">
                    <Dialog.Title as="h3" className="text-3xl font-bold leading-6 text-gray-900">
                      Protocol Analysis Complete
                    </Dialog.Title>

                    {/* Subtitle */}
                    <div className="mt-3">
                      <p className="text-base text-gray-600">
                        Personalized treatment plan for <span className="font-semibold text-gray-900">{clientName}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {protocolLabel || `Protocol #${protocolNumber}`} • Based on EEG brain mapping analysis
                      </p>
                    </div>
                  </div>
                </div>

                {/* Video Tutorial Section */}
                <div className="mt-8 relative max-w-xl mx-auto">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                      📹 How to Set Your Client's Protocol
                    </span>
                  </div>
                  <div className="relative rounded-lg overflow-hidden shadow-xl border-2 border-gray-200">
                    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                      <iframe
                        src="https://customer-f57etvnofv3kxoyh.cloudflarestream.com/aafcea91da21ba99d8498a3d4db1baee/iframe?poster=https%3A%2F%2Fcustomer-f57etvnofv3kxoyh.cloudflarestream.com%2Faafcea91da21ba99d8498a3d4db1baee%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
                        loading="lazy"
                        style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowFullScreen
                        title="How to Set Your Client's Protocol"
                      ></iframe>
                    </div>
                  </div>
                </div>

                {/* Phase Cards */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {phases.map((phase, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                    >
                      {/* Card Header */}
                      <div className={`bg-gradient-to-r ${getPhaseColor(phase.phase)} p-6 text-white`}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium opacity-90">{phase.window}</p>
                            <h4 className="text-2xl font-bold mt-1">{phase.phase}</h4>
                          </div>
                          <span className="text-4xl">{getPhaseIcon(phase.phase)}</span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-6 space-y-4">
                        {/* Frequency */}
                        <div className="flex items-start">
                          <BoltIcon className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Frequency</p>
                            <p className="text-lg font-bold text-gray-900">{phase.frequency_hz} Hz</p>
                          </div>
                        </div>

                        {/* Duration */}
                        <div className="flex items-start">
                          <ClockIcon className="h-5 w-5 text-blue-500 mr-3 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Duration</p>
                            <p className="text-lg font-bold text-gray-900">{phase.duration_min} minutes</p>
                          </div>
                        </div>

                        {/* Intensity */}
                        <div className="flex items-start">
                          <div className="h-5 w-5 mr-3 mt-0.5 flex items-center justify-center">
                            <div className="h-4 w-4 rounded-full bg-gradient-to-r from-green-400 to-green-600"></div>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Intensity</p>
                            <p className="text-lg font-bold text-gray-900">{phase.intensity_percent}%</p>
                          </div>
                        </div>

                        {/* Cadence */}
                        <div className="flex items-start">
                          <CalendarIcon className="h-5 w-5 text-purple-500 mr-3 mt-0.5" />
                          <div>
                            <p className="text-xs font-medium text-gray-500 uppercase">Cadence</p>
                            <p className="text-lg font-bold text-gray-900">{phase.cadence}</p>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className={`bg-gradient-to-r ${getPhaseColor(phase.phase)} px-6 py-3 border-t border-gray-100`}>
                        <p className="text-xs text-center text-white font-medium">
                          Phase {index + 1} of 3
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="mt-8 bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-center text-gray-600">
                    This protocol recommendation has been generated using advanced AI pattern recognition
                    based on comprehensive neurofeedback assessment data.
                  </p>
                </div>
                
                {/* Action Button */}
                <div className="mt-8">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 text-base font-semibold text-white shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 hover:shadow-xl"
                    onClick={onClose}
                  >
                    Save & Continue to Client Profile
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
