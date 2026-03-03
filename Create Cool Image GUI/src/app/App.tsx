import { useState } from 'react';
import { Stepper } from './components/Stepper';
import { ModelForm } from './components/ModelForm';
import { CaliberForm } from './components/CaliberForm';
import { ManufacturerForm } from './components/ManufacturerForm';
import { FirearmTypeForm } from './components/FirearmTypeForm';
import { LicenseForm } from './components/LicenseForm';
import { FileUpload } from './components/FileUpload';
import { RegistrationSummary } from './components/RegistrationSummary';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface RegistrationData {
  model: string;
  caliber: string;
  manufacturer: string;
  firearmType: string;
  licenseHolder: string;
  licenseNumber: string;
  issueDate: string;
  expirationDate: string;
}

const steps = [
  { id: 1, title: 'Model', completed: false },
  { id: 2, title: 'Caliber', completed: false },
  { id: 3, title: 'Manufacturer', completed: false },
  { id: 4, title: 'Firearm Type', completed: false },
  { id: 5, title: 'License', completed: false },
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<RegistrationData>({
    model: '',
    caliber: '',
    manufacturer: '',
    firearmType: '',
    licenseHolder: '',
    licenseNumber: '',
    issueDate: '',
    expirationDate: '',
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCompletedSteps((prev) => [...prev, currentStep]);
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileSelect = (files: File[]) => {
    setUploadedFiles(files);
  };

  const updatedSteps = steps.map((step) => ({
    ...step,
    completed: completedSteps.includes(step.id),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Security Agency - Firearm Registration System
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Complete all steps to register your firearm
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stepper */}
        <Stepper steps={updatedSteps} currentStep={currentStep} />

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
              {/* Step 1: Model */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Firearm Model
                  </h2>
                  <ModelForm data={formData} onChange={handleFieldChange} />
                </div>
              )}

              {/* Step 2: Caliber */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Firearm Caliber
                  </h2>
                  <CaliberForm data={formData} onChange={handleFieldChange} />
                </div>
              )}

              {/* Step 3: Manufacturer */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Manufacturer Information
                  </h2>
                  <ManufacturerForm data={formData} onChange={handleFieldChange} />
                </div>
              )}

              {/* Step 4: Firearm Type */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    Firearm Classification
                  </h2>
                  <FirearmTypeForm data={formData} onChange={handleFieldChange} />
                </div>
              )}

              {/* Step 5: License */}
              {currentStep === 5 && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-6">
                    License Information
                  </h2>
                  <LicenseForm data={formData} onChange={handleFieldChange} />

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Upload Documentation
                    </h3>
                    <FileUpload onFileSelect={handleFileSelect} />
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-700 font-medium mb-2">
                          Uploaded files:
                        </p>
                        <ul className="space-y-1">
                          {uploadedFiles.map((file, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              • {file.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentStep === 5}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <RegistrationSummary data={formData} currentStep={currentStep} />
          </div>
        </div>
      </div>
    </div>
  );
}
