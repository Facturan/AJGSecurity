import { Calendar } from 'lucide-react';

interface LicenseFormProps {
  data: {
    licenseHolder: string;
    licenseNumber: string;
    issueDate: string;
    expirationDate: string;
  };
  onChange: (field: string, value: string) => void;
}

export function LicenseForm({ data, onChange }: LicenseFormProps) {
  return (
    <div className="space-y-6">
      {/* License Holder Name */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          License Holder Name:
        </label>
        <input
          type="text"
          value={data.licenseHolder}
          onChange={(e) => onChange('licenseHolder', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter license holder name"
        />
      </div>

      {/* License Number */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          License Number:
        </label>
        <input
          type="text"
          value={data.licenseNumber}
          onChange={(e) => onChange('licenseNumber', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter license number"
        />
      </div>

      {/* Issue Date */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Issue Date:
        </label>
        <div className="relative">
          <input
            type="date"
            value={data.issueDate}
            onChange={(e) => onChange('issueDate', e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Expiration Date */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Expiration Date:
        </label>
        <div className="relative">
          <input
            type="date"
            value={data.expirationDate}
            onChange={(e) => onChange('expirationDate', e.target.value)}
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
