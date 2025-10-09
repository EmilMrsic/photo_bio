import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { CONDITIONS, CONDITION_DISPLAY_NAMES } from '../lib/conditions';

interface ConditionSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (condition: string) => void;
  clientName: string;
}

export default function ConditionSelectorModal({
  isOpen,
  onClose,
  onSelect,
  clientName,
}: ConditionSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConditions = CONDITIONS.filter((condition) =>
    CONDITION_DISPLAY_NAMES[condition].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (condition: string) => {
    onSelect(condition);
    setSearchTerm('');
  };

  const handleClose = () => {
    setSearchTerm('');
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
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
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div>
                  {/* Title */}
                  <div className="text-center">
                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900">
                      Select Condition
                    </Dialog.Title>
                    <p className="mt-2 text-sm text-gray-600">
                      Choose the primary condition for <span className="font-semibold">{clientName}</span>
                    </p>
                  </div>

                  {/* Search Input */}
                  <div className="mt-6">
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Search conditions..."
                      />
                    </div>
                  </div>

                  {/* Conditions List */}
                  <div className="mt-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-2">
                      {filteredConditions.map((condition) => (
                        <button
                          key={condition}
                          onClick={() => handleSelect(condition)}
                          className="w-full text-left px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          <span className="text-base font-medium text-gray-900">
                            {CONDITION_DISPLAY_NAMES[condition]}
                          </span>
                        </button>
                      ))}
                    </div>
                    {filteredConditions.length === 0 && (
                      <p className="text-center text-sm text-gray-500 py-8">
                        No conditions found matching "{searchTerm}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Cancel Button */}
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    onClick={handleClose}
                  >
                    Cancel
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
