interface FirearmTypeFormProps {
  data: { firearmType: string };
  onChange: (field: string, value: string) => void;
}

const firearmTypes = [
  'Rifle',
  'Pistol',
  'Shotgun',
  'Carbine',
  'Submachine Gun',
  'Revolver',
  'Semi-Automatic Rifle',
  'Bolt-Action Rifle',
  'Semi-Automatic Pistol'
];

export function FirearmTypeForm({ data, onChange }: FirearmTypeFormProps) {
  return (
    <div>
      <label className="block text-gray-700 font-medium mb-2">
        Firearm Type:
      </label>
      <select
        value={data.firearmType}
        onChange={(e) => onChange('firearmType', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Select a firearm type</option>
        {firearmTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
      <p className="text-sm text-gray-500 mt-2">
        Specify the classification type of the firearm.
      </p>
    </div>
  );
}
