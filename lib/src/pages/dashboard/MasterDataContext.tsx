import React, { createContext, useContext, useState, useCallback } from 'react';

type MasterDataContextType = {
  religions: string[];
  positions: { name: string; code: string; level: string }[];
  departments: { name: string; code: string; head: string }[];
  employeeStatuses: string[];
  firearmModels: string[];
  firearmCalibers: string[];
  firearmMakes: string[];
  firearmKinds: string[];
  firearmLicenses: string[];
  addReligion: (name: string) => void;
  addPosition: (name: string, code: string, level: string) => void;
  addDepartment: (name: string, code: string, head: string) => void;
  addEmployeeStatus: (name: string) => void;
  addFirearmModel: (name: string) => void;
  addFirearmCaliber: (name: string) => void;
  addFirearmMake: (name: string) => void;
  addFirearmKind: (name: string) => void;
  addFirearmLicense: (name: string) => void;
};

const defaultReligions = ['Catholic', 'Christian', 'Islam', 'Buddhism', 'Hinduism', 'Other'];
const defaultPositions = [
  { name: 'Manager', code: 'MGR', level: '5' },
  { name: 'Supervisor', code: 'SUP', level: '4' },
  { name: 'Staff', code: 'STF', level: '3' },
  { name: 'Human Resources', code: 'HR', level: '3' },
  { name: 'IT', code: 'IT', level: '3' },
];
const defaultDepartments = [
  { name: 'Human Resources', code: 'HR', head: 'MARIA SANTOS' },
  { name: 'IT', code: 'IT', head: 'JUAN DELA CRUZ' },
  { name: 'Finance', code: 'FIN', head: 'ANA GARCIA' },
  { name: 'Operations', code: 'OPS', head: 'PEDRO REYES' },
  { name: 'Marketing', code: 'MKT', head: 'ANA GARCIA' },
  { name: 'Sales', code: 'SLS', head: 'PEDRO REYES' },
];
const defaultEmployeeStatuses = ['Regular', 'Probationary', 'Contractual', 'Part-time', 'Project-based'];
const defaultFirearmModels = ['Glock 17', 'Beretta M9', 'Colt 1911', 'Sig Sauer P320'];
const defaultFirearmCalibers = ['9mm', '.45 ACP', '.40 S&W', '.380 ACP', '5.56x45mm'];
const defaultFirearmMakes = ['Glock', 'Beretta', 'Colt', 'Sig Sauer', 'Smith & Wesson'];
const defaultFirearmKinds = ['Pistol', 'Revolver', 'Rifle', 'Shotgun', 'Submachine Gun'];
const defaultFirearmLicenses = ['Regular License', 'Special Permit', 'LTO', 'PTCFOR'];

const MasterDataContext = createContext<MasterDataContextType | null>(null);

export function MasterDataProvider({ children }: { children: React.ReactNode }) {
  const [religions, setReligions] = useState<string[]>(defaultReligions);
  const [positions, setPositions] = useState(defaultPositions);
  const [departments, setDepartments] = useState(defaultDepartments);
  const [employeeStatuses, setEmployeeStatuses] = useState<string[]>(defaultEmployeeStatuses);
  const [firearmModels, setFirearmModels] = useState<string[]>(defaultFirearmModels);
  const [firearmCalibers, setFirearmCalibers] = useState<string[]>(defaultFirearmCalibers);
  const [firearmMakes, setFirearmMakes] = useState<string[]>(defaultFirearmMakes);
  const [firearmKinds, setFirearmKinds] = useState<string[]>(defaultFirearmKinds);
  const [firearmLicenses, setFirearmLicenses] = useState<string[]>(defaultFirearmLicenses);

  const addReligion = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      setReligions((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    }
  }, []);

  const addPosition = useCallback((name: string, code: string, level: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      setPositions((prev) =>
        prev.some((p) => p.name === trimmed) ? prev : [...prev, { name: trimmed, code: code.trim() || trimmed.slice(0, 3).toUpperCase(), level: level.trim() || '0' }]
      );
    }
  }, []);

  const addDepartment = useCallback((name: string, code: string, head: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      setDepartments((prev) =>
        prev.some((d) => d.name === trimmed) ? prev : [...prev, { name: trimmed, code: code.trim() || trimmed.slice(0, 3).toUpperCase(), head: head.trim() }]
      );
    }
  }, []);

  const addEmployeeStatus = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      setEmployeeStatuses((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
    }
  }, []);

  const addFirearmModel = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) setFirearmModels((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  }, []);

  const addFirearmCaliber = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) setFirearmCalibers((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  }, []);

  const addFirearmMake = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) setFirearmMakes((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  }, []);

  const addFirearmKind = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) setFirearmKinds((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  }, []);

  const addFirearmLicense = useCallback((name: string) => {
    const trimmed = name.trim();
    if (trimmed) setFirearmLicenses((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  }, []);

  const value: MasterDataContextType = {
    religions,
    positions,
    departments,
    employeeStatuses,
    addReligion,
    addPosition,
    addDepartment,
    addEmployeeStatus,
    firearmModels,
    firearmCalibers,
    firearmMakes,
    firearmKinds,
    firearmLicenses,
    addFirearmModel,
    addFirearmCaliber,
    addFirearmMake,
    addFirearmKind,
    addFirearmLicense,
  };

  return (
    <MasterDataContext.Provider value={value}>
      {children}
    </MasterDataContext.Provider>
  );
}

export function useMasterData() {
  const ctx = useContext(MasterDataContext);
  if (!ctx) throw new Error('useMasterData must be used within MasterDataProvider');
  return ctx;
}
