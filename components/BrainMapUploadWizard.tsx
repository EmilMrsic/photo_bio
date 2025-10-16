import React, { useState, useRef } from 'react';
import { CONDITIONS, CONDITION_DISPLAY_NAMES } from '../lib/conditions';

interface BrainMapUploadWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File, condition: string) => void;
  clientName: string;
}

export default function BrainMapUploadWizard({
  isOpen,
  onClose,
  onSubmit,
  clientName,
}: BrainMapUploadWizardProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const consentRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
    }
  };

  const handleNext = () => {
    if (!selectedFile) return;
    if (!consentChecked) {
      setConsentError(true);
      if (consentRef.current) {
        consentRef.current.focus();
        consentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = () => {
    if (!consentChecked) {
      setConsentError(true);
      if (consentRef.current) {
        consentRef.current.focus();
        consentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (selectedFile && selectedCondition) {
      onSubmit(selectedFile, selectedCondition);
      // Reset state
      setStep(1);
      setSelectedFile(null);
      setSelectedCondition('');
      setConsentChecked(false);
      setConsentError(false);
    }
  };

  const handleCloseModal = () => {
    // Reset state
    setStep(1);
    setSelectedFile(null);
    setSelectedCondition('');
    setDragActive(false);
    setConsentChecked(false);
    setConsentError(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleCloseModal}
        ></div>

        {/* Modal positioning trick */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-2xl leading-6 font-bold text-gray-900">
              Upload New Brain Map
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              For {clientName}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step === 1 ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'
                  }`}
                >
                  {step > 1 ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    '1'
                  )}
                </div>
                <div className="ml-2 text-sm font-medium text-gray-900">Upload PDF</div>
              </div>

              <div className={`w-24 h-1 mx-4 ${step === 2 ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>

              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step === 2 ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  2
                </div>
                <div className={`ml-2 text-sm font-medium ${step === 2 ? 'text-gray-900' : 'text-gray-500'}`}>
                  Select Condition
                </div>
              </div>
            </div>
          </div>

          {/* Step 1: Upload PDF */}
          {step === 1 && (
            <div className="space-y-4">
              <div
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  dragActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="sr-only"
                  id="file-upload-wizard"
                />
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                {selectedFile ? (
                  <div className="mt-4">
                    <div className="flex items-center justify-center">
                      <svg
                        className="h-8 w-8 text-green-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-900">{selectedFile.name}</p>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <label
                      htmlFor="file-upload-wizard"
                      className="mt-4 inline-flex cursor-pointer text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      Choose a different file
                    </label>
                  </div>
                ) : (
                  <div className="mt-4">
                    <label
                      htmlFor="file-upload-wizard"
                      className="cursor-pointer text-base font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      Click to upload
                    </label>
                    <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-2">PDF up to 10MB</p>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      ref={consentRef}
                      id="brainmap-consent"
                      name="brainmap-consent"
                      type="checkbox"
                      checked={consentChecked}
                      onChange={(e) => {
                        setConsentChecked(e.target.checked);
                        if (e.target.checked) setConsentError(false);
                      }}
                      aria-invalid={consentError ? 'true' : undefined}
                      aria-describedby={consentError ? 'brainmap-consent-error' : undefined}
                      className={`h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 ${consentError ? 'ring-2 ring-red-500 border-red-500' : ''}`}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="brainmap-consent" className="font-medium text-gray-900">
                      I have removed the name of the patient from this PDF
                    </label>
                    {consentError && (
                      <p id="brainmap-consent-error" className="mt-1 text-red-600">
                        Please check this box before continuing.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Condition */}
          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-700 mb-4">
                Select the condition that best describes this client's primary concern:
              </p>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                {CONDITIONS.map((condition) => (
                  <button
                    key={condition}
                    type="button"
                    onClick={() => setSelectedCondition(condition)}
                    className={`relative rounded-lg border px-4 py-3 text-left transition-all ${
                      selectedCondition === condition
                        ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-600'
                        : 'border-gray-300 hover:border-indigo-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {CONDITION_DISPLAY_NAMES[condition]}
                      </span>
                      {selectedCondition === condition && (
                        <svg
                          className="h-5 w-5 text-indigo-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer buttons */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={step === 1 ? handleCloseModal : handleBack}
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step === 1 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={!selectedFile || !consentChecked}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!selectedCondition}
                className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload & Analyze
                <svg className="ml-2 -mr-1 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
