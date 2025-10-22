import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface Step {
  quadrant: string;
  pulse_hz: number;
  intensity_percent: number;
  duration_min: number;
}

interface ProtocolModal1070Props {
  isOpen: boolean;
  onClose: () => void;
  protocolNumber: number;
  clientName: string;
  steps: Step[];
  cycles: number;
  protocolLabel?: string;
}

export default function ProtocolModal1070({ isOpen, onClose, protocolNumber, clientName, steps, cycles, protocolLabel }: ProtocolModal1070Props) {
  // Debug logging to track quadrant values
  React.useEffect(() => {
    if (isOpen && steps) {
      console.log('🔍 ProtocolModal1070 - Steps received:', {
        protocolNumber,
        protocolLabel,
        cycles,
        stepCount: steps.length,
        steps: steps.map((s, idx) => ({
          step: idx + 1,
          quadrant: s.quadrant,
          pulse_hz: s.pulse_hz,
          intensity_percent: s.intensity_percent,
          duration_min: s.duration_min
        }))
      });
    }
  }, [isOpen, steps, protocolNumber, protocolLabel, cycles]);

  if (!isOpen) return null;

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
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">
                <div>
                  {/* Brand header */}
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
                    <span className="text-white text-2xl">🧠</span>
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900">
                      Neuroradiant 1070 Protocol {protocolLabel ? `— ${protocolLabel}` : ''}
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-600">Client: {clientName}</p>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">Helmet: Neuroradiant 1070</span>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">Cycles: {cycles}</span>
                    </div>
                  </div>

                  {/* Video Tutorial Section (1070 specific) */}
                  <div className="mt-8 relative max-w-xl mx-auto">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
                        📹 How to Set Your Client's Protocol (1070)
                      </span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden shadow-xl border-2 border-gray-200">
                      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
                        <iframe
                          src="https://customer-f57etvnofv3kxoyh.cloudflarestream.com/fc0a3b52c95f3861d6bc42740b51d22d/iframe?poster=https%3A%2F%2Fcustomer-f57etvnofv3kxoyh.cloudflarestream.com%2Ffc0a3b52c95f3861d6bc42740b51d22d%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600"
                          loading="lazy"
                          style={{ border: 'none', position: 'absolute', top: 0, left: 0, height: '100%', width: '100%' }}
                          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                          allowFullScreen
                          title="How to Set Your Client's Protocol (1070)"
                        ></iframe>
                      </div>
                    </div>
                  </div>

                  {/* Four Step Cards with richer styling */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {steps.slice(0, 4).map((step, idx) => {
                      const gradients = [
                        'from-indigo-600 to-purple-600',
                        'from-sky-500 to-indigo-600',
                        'from-violet-500 to-fuchsia-600',
                        'from-blue-600 to-cyan-500',
                      ];
                      const gradient = gradients[idx % gradients.length];
                      return (
                        <div key={idx} className="bg-white rounded-xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                          <div className={`bg-gradient-to-r ${gradient} p-5 text-white`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-xs font-medium opacity-90">Quadrant</p>
                                <h4 className="text-xl font-bold mt-1">{step.quadrant}</h4>
                              </div>
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold bg-white/20 border border-white/30">Step {idx + 1} of 4</span>
                            </div>
                          </div>
                          <div className="p-5 grid grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 text-xs uppercase">Pulse</p>
                              <p className="text-gray-900 font-semibold">{step.pulse_hz} Hz</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs uppercase">Intensity</p>
                              <p className="text-gray-900 font-semibold">{step.intensity_percent}%</p>
                            </div>
                            <div>
                              <p className="text-gray-500 text-xs uppercase">Duration</p>
                              <p className="text-gray-900 font-semibold">{step.duration_min} min</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-8 bg-gray-50 rounded-lg p-4 text-center text-xs text-gray-600">
                    Helmet-specific guidance video above helps you set the Neuroradiant 1070 correctly.
                  </div>

                  <div className="mt-6 flex justify-end gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      onClick={onClose}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}


