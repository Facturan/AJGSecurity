interface CaliberFormProps {
  data: { caliber: string };
  onChange: (field: string, value: string) => void;
}

const calibers = [
  '.223 Remington',
  '5.56x45mm NATO',
  '7.62x39mm',
  '7.62x51mm NATO',
  '9mm Parabellum',
  '.45 ACP',
  '.40 S&W',
  '.357 Magnum',
  '.38 Special',
  '10mm Auto',
  '12 Gauge',
  '20 Gauge'
];

export function CaliberForm({ data, onChange }: CaliberFormProps) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Firearm Caliber:
      </label>
      <select
        value={data.caliber}
        onChange={(e) => onChange('caliber', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a caliber</option>
        {calibers.map((caliber) => (
          <option key={caliber} value={caliber}>
            {caliber}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-500 mt-2">
        Specify the ammunition caliber for this firearm.
      </p>
    </div>
  );
}
