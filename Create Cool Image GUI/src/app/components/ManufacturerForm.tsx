interface ManufacturerFormProps {
  data: { manufacturer: string };
  onChange: (field: string, value: string) => void;
}

const manufacturers = [
  'Colt',
  'Smith & Wesson',
  'Glock',
  'Sig Sauer',
  'Beretta',
  'Ruger',
  'Remington',
  'Springfield Armory',
  'Heckler & Koch',
  'FN Herstal',
  'Walther',
  'Mossberg'
];

export function ManufacturerForm({ data, onChange }: ManufacturerFormProps) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Manufacturer:
      </label>
      <select
        value={data.manufacturer}
        onChange={(e) => onChange('manufacturer', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a manufacturer</option>
        {manufacturers.map((mfg) => (
          <option key={mfg} value={mfg}>
            {mfg}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-500 mt-2">
        Select the manufacturer of the firearm.
      </p>
    </div>
  );
}
