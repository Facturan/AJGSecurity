interface ModelFormProps {
  data: { model: string };
  onChange: (field: string, value: string) => void;
}

const models = [
  'AR-15',
  'AK-47',
  'Glock 19',
  'Glock 17',
  'M4 Carbine',
  'Desert Eagle',
  'Beretta 92',
  'Sig Sauer P226',
  'Smith & Wesson M&P',
  'Colt 1911'
];

export function ModelForm({ data, onChange }: ModelFormProps) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Firearm Model:
      </label>
      <select
        value={data.model}
        onChange={(e) => onChange('model', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a model</option>
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-500 mt-2">
        Select the specific model of the firearm being registered.
      </p>
    </div>
  );
}
