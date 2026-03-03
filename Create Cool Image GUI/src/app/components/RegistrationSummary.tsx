import { AlertCircle } from 'lucide-react';

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

interface RegistrationSummaryProps {
  data: RegistrationData;
  currentStep: number;
}

export function RegistrationSummary({ data, currentStep }: RegistrationSummaryProps) {
  const isFieldPending = (step: number) => currentStep < step;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Registration Summary
      </h2>

      {/* Status Badge */}
      <div className="bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 mb-6 flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-yellow-700" />
        <span className="text-yellow-800 font-medium">Under Review</span>
      </div>

      {/* Summary Items */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Model:</span>
          <span className={isFieldPending(1) || !data.model ? 'text-gray-400' : 'text-gray-800'}>
            {data.model || 'Pending'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Caliber:</span>
          <span className={isFieldPending(2) || !data.caliber ? 'text-gray-400' : 'text-gray-800'}>
            {data.caliber || 'Pending'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Manufacturer:</span>
          <span className={isFieldPending(3) || !data.manufacturer ? 'text-gray-400' : 'text-gray-800'}>
            {data.manufacturer || 'Pending'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Firearm Type:</span>
          <span className={isFieldPending(4) || !data.firearmType ? 'text-gray-400' : 'text-gray-800'}>
            {data.firearmType || 'Pending'}
          </span>
        </div>

        <div className="h-px bg-gray-200 my-4" />

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">License Holder:</span>
          <span className={!data.licenseHolder ? 'text-gray-400' : 'text-gray-800'}>
            {data.licenseHolder || 'John Doe'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">License Number:</span>
          <span className={!data.licenseNumber ? 'text-gray-400' : 'text-gray-800'}>
            {data.licenseNumber || '123456789'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Issue Date:</span>
          <span className={!data.issueDate ? 'text-gray-400' : 'text-gray-800'}>
            {data.issueDate || '12/15/2021'}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-700 font-medium">Expiration Date:</span>
          <span className={!data.expirationDate ? 'text-gray-400' : 'text-gray-800'}>
            {data.expirationDate || '12/15/2026'}
          </span>
        </div>
      </div>
    </div>
  );
}
