import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import type { FirearmAttribute, LicenseRecord } from './FirearmMasterData/types';

// ─────────────────────────────────────────────────────────────────────────────
//  Context Type
// ─────────────────────────────────────────────────────────────────────────────
type MasterDataContextType = {
  // ── Employee master data ──────────────────────────────────────────────────
  religions: string[];
  positions: { name: string }[];
  departments: { name: string }[];
  employeeStatuses: string[];
  loanTypes: { loanId: string; loanType: string }[];
  overtimeRates: {
    id?: number;
    RateOTRegDay: number;
    RateOTSunday: number;
    RateOTSpecial: number;
    RateOTLegal: number;
    RateOTNDBase: number;
    RateOTNDAdd: number;
  } | null;

  // ── Firearm attribute lists ───────────────────────────────────────────────
  firearmModels: FirearmAttribute[];
  firearmCalibers: FirearmAttribute[];
  firearmMakes: FirearmAttribute[];
  firearmKinds: FirearmAttribute[];

  // ── Firearm licenses ──────────────────────────────────────────────────────
  licenseRecords: LicenseRecord[];   // only active (is_active = true)

  isLoading: boolean;

  // ── Employee add functions ────────────────────────────────────────────────
  addReligion: (name: string) => Promise<void>;
  addPosition: (name: string) => Promise<void>;
  addDepartment: (name: string) => Promise<void>;
  addEmployeeStatus: (name: string) => Promise<void>;
  addLoanType: (data: { loanId: string; loanType: string }) => Promise<void>;
  updateLoanType: (data: { loanId: string; loanType: string }) => Promise<void>;
  deleteLoanType: (loanId: string) => Promise<void>;
  updateOvertimeRates: (rates: {
    RateOTRegDay: number; RateOTSunday: number; RateOTSpecial: number;
    RateOTLegal: number; RateOTNDBase: number; RateOTNDAdd: number;
  }) => Promise<boolean | void>;

  // ── Firearm attribute CRUD ────────────────────────────────────────────────
  addFirearmModel: (name: string) => Promise<void>;
  updateFirearmModel: (id: number, name: string) => Promise<void>;
  deleteFirearmModel: (id: number) => Promise<void>;

  addFirearmCaliber: (name: string) => Promise<void>;
  updateFirearmCaliber: (id: number, name: string) => Promise<void>;
  deleteFirearmCaliber: (id: number) => Promise<void>;

  addFirearmMake: (name: string) => Promise<void>;
  updateFirearmMake: (id: number, name: string) => Promise<void>;
  deleteFirearmMake: (id: number) => Promise<void>;

  addFirearmKind: (name: string) => Promise<void>;
  updateFirearmKind: (id: number, name: string) => Promise<void>;
  deleteFirearmKind: (id: number) => Promise<void>;

  // ── Firearm license CRUD ──────────────────────────────────────────────────
  addLicenseRecord: (record: Omit<LicenseRecord, 'id' | 'isActive'>) => Promise<void>;
  softDeleteLicense: (id: number) => Promise<void>;
};

// ─────────────────────────────────────────────────────────────────────────────
//  Context + Provider
// ─────────────────────────────────────────────────────────────────────────────
const MasterDataContext = createContext<MasterDataContextType | null>(null);

export function MasterDataProvider({ children }: { children: React.ReactNode }) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [religions,        setReligions]        = useState<string[]>([]);
  const [positions,        setPositions]        = useState<{ name: string }[]>([]);
  const [departments,      setDepartments]      = useState<{ name: string }[]>([]);
  const [employeeStatuses, setEmployeeStatuses] = useState<string[]>([]);
  const [loanTypes,        setLoanTypes]        = useState<{ loanId: string; loanType: string }[]>([]);
  const [overtimeRates,    setOvertimeRates]    = useState<MasterDataContextType['overtimeRates']>(null);

  const [firearmModels,   setFirearmModels]   = useState<FirearmAttribute[]>([]);
  const [firearmCalibers, setFirearmCalibers] = useState<FirearmAttribute[]>([]);
  const [firearmMakes,    setFirearmMakes]    = useState<FirearmAttribute[]>([]);
  const [firearmKinds,    setFirearmKinds]    = useState<FirearmAttribute[]>([]);
  const [licenseRecords,  setLicenseRecords]  = useState<LicenseRecord[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  // ── Default fallbacks (used if DB tables are empty) ───────────────────────
  const DEFAULT_MODELS:   FirearmAttribute[] = [{ id: -1, name: 'G-17' }, { id: -2, name: 'M-30' }, { id: -3, name: 'PATROL' }, { id: -4, name: '1911' }];
  const DEFAULT_CALIBERS: FirearmAttribute[] = [{ id: -1, name: '9MM' },  { id: -2, name: '38' },   { id: -3, name: '12GA' },   { id: -4, name: '45 ACP' }];
  const DEFAULT_MAKES:    FirearmAttribute[] = [{ id: -1, name: 'GLOCK' },{ id: -2, name: 'COLT' }, { id: -3, name: 'ARMSCOR' }, { id: -4, name: 'BERETTA' }];
  const DEFAULT_KINDS:    FirearmAttribute[] = [{ id: -1, name: 'PISTL' },{ id: -2, name: 'RVLVR' },{ id: -3, name: 'SHTGN' },  { id: -4, name: 'RIFLE' }];

  // ── Initial fetch ──────────────────────────────────────────────────────────
  const fetchMasterData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        { data: rels },
        { data: pos },
        { data: depts },
        { data: stats },
        { data: fModels },
        { data: fCalibers },
        { data: fMakes },
        { data: fKinds },
        { data: licenses },
        { data: lTypes },
        { data: otRates },
      ] = await Promise.all([
        supabase.from('RELIGION').select('ReligionList'),
        supabase.from('EMPPOSITION').select('EmpPositionList'),
        supabase.from('DEPARTMENTS').select('name'),
        supabase.from('EMPLOYEE_STATUSES').select('name'),
        supabase.from('FIREARM_MODELS').select('id, name'),
        supabase.from('FIREARM_CALIBERS').select('id, name'),
        supabase.from('FIREARM_MAKES').select('id, name'),
        supabase.from('FIREARM_KINDS').select('id, name'),
        supabase.from('FIREARM_LICENSES').select('*').eq('is_active', true).order('created_at', { ascending: false }),
        supabase.from('LOAN_TYPES').select('loanId, loanType'),
        supabase.from('OVERTIMERATE').select('*').limit(1),
      ]);

      if (rels)  setReligions(rels.map(r => r.ReligionList));
      if (pos)   setPositions(pos.map((p: any) => ({ name: p.EmpPositionList || 'Unnamed Position' })));
      if (depts) setDepartments(depts);
      if (stats) setEmployeeStatuses(stats.map((s: any) => s.name));

      setFirearmModels(fModels   && fModels.length   > 0 ? fModels   : DEFAULT_MODELS);
      setFirearmCalibers(fCalibers && fCalibers.length > 0 ? fCalibers : DEFAULT_CALIBERS);
      setFirearmMakes(fMakes     && fMakes.length     > 0 ? fMakes     : DEFAULT_MAKES);
      setFirearmKinds(fKinds     && fKinds.length     > 0 ? fKinds     : DEFAULT_KINDS);

      if (licenses) {
        setLicenseRecords(licenses.map((l: any) => ({
          id:           l.id,
          serialNo:     l.serial_no,
          kind:         l.kind,
          make:         l.make,
          caliber:      l.caliber,
          model:        l.model,
          dateApproved: l.date_approved,
          dateExpiry:   l.date_expiry,
          isActive:     l.is_active,
        })));
      }

      if (lTypes) {
        console.log(`[Diagnostic] Successfully loaded ${lTypes.length} Loan Types:`, lTypes);
        setLoanTypes(lTypes.map((lt: any) => ({ loanId: lt.loanId, loanType: lt.loanType })));
      } else {
        console.warn('[Diagnostic] Loan Types returned null or undefined.');
      }
      
      if (otRates && otRates.length > 0) {
        setOvertimeRates(otRates[0]);
      }
    } catch (error) {
      console.error('[Diagnostic] Error fetching master data from Supabase:', error);
      toast.error('Failed to load master data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchMasterData(); }, [fetchMasterData]);

  // ──────────────────────────────────────────────────────────────────────────
  //  Employee CRUD
  // ──────────────────────────────────────────────────────────────────────────
  const addReligion = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Name cannot be empty');
    const { error } = await supabase.from('RELIGION').insert([{ ReligionList: trimmed }]);
    if (error) { toast.error('Failed to add religion: ' + error.message); throw error; }
    setReligions(prev => [...prev, trimmed]);
    toast.success('Religion added');
  };

  const addPosition = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const { error } = await supabase.from('EMPPOSITION').insert([{ EmpPositionList: trimmed }]);
    if (error) { toast.error('Failed to add position: ' + error.message); throw error; }
    setPositions(prev => [...prev, { name: trimmed }]);
    toast.success('Position added successfully');
  };

  const addDepartment = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Name cannot be empty');
    const { error } = await supabase.from('DEPARTMENTS').insert([{ name: trimmed }]);
    if (error) { toast.error('Failed to add department: ' + error.message); throw error; }
    setDepartments(prev => [...prev, { name: trimmed }]);
    toast.success('Department added');
  };

  const addEmployeeStatus = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Name cannot be empty');
    const { error } = await supabase.from('EMPLOYEE_STATUSES').insert([{ name: trimmed }]);
    if (error) { toast.error('Failed to add status: ' + error.message); throw error; }
    setEmployeeStatuses(prev => [...prev, trimmed]);
    toast.success('Status added');
  };

  const addLoanType = async (data: { loanId: string; loanType: string }) => {
    const { error } = await supabase.from('LOAN_TYPES').insert([data]);
    if (error) { toast.error('Failed to add loan type: ' + error.message); throw error; }
    setLoanTypes(prev => [...prev, data]);
    toast.success('Loan type added');
  };

  const updateLoanType = async (data: { loanId: string; loanType: string }) => {
    const { error } = await supabase.from('LOAN_TYPES').update({ loanType: data.loanType }).eq('loanId', data.loanId);
    if (error) { toast.error('Failed to update loan type: ' + error.message); throw error; }
    setLoanTypes(prev => prev.map(lt => lt.loanId === data.loanId ? data : lt));
    toast.success('Loan type updated');
  };

  const deleteLoanType = async (loanId: string) => {
    const { error } = await supabase.from('LOAN_TYPES').delete().eq('loanId', loanId);
    if (error) { toast.error('Failed to delete loan type: ' + error.message); throw error; }
    setLoanTypes(prev => prev.filter(lt => lt.loanId !== loanId));
    toast.success('Loan type deleted');
  };

  const updateOvertimeRates = async (rates: {
    RateOTRegDay: number; RateOTSunday: number; RateOTSpecial: number;
    RateOTLegal: number; RateOTNDBase: number; RateOTNDAdd: number;
  }) => {
    try {
      if (overtimeRates?.id) {
        const { error } = await supabase.from('OVERTIMERATE').update(rates).eq('id', overtimeRates.id);
        if (error) throw error;
        setOvertimeRates({ ...overtimeRates, ...rates });
      } else {
        const { data: existing } = await supabase.from('OVERTIMERATE').select('id').limit(1);
        if (existing && existing.length > 0) {
          const { error } = await supabase.from('OVERTIMERATE').update(rates).eq('id', existing[0].id);
          if (error) throw error;
          setOvertimeRates({ id: existing[0].id, ...rates });
        } else {
          const { data, error } = await supabase.from('OVERTIMERATE').insert([rates]).select();
          if (error) throw error;
          if (data && data.length > 0) setOvertimeRates(data[0]);
        }
      }
      toast.success('Overtime rates updated successfully');
      return true;
    } catch (error: any) {
      toast.error('Failed to update overtime rates: ' + error.message);
      throw error;
    }
  };

  // ──────────────────────────────────────────────────────────────────────────
  //  Firearm Attribute CRUD — generic helper
  // ──────────────────────────────────────────────────────────────────────────
  const makeAttributeCRUD = (
    table: string,
    setter: React.Dispatch<React.SetStateAction<FirearmAttribute[]>>,
    label: string,
  ) => ({
    add: async (name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const { data, error } = await supabase.from(table).insert([{ name: trimmed }]).select('id, name').single();
      if (error) { toast.error(`Failed to add ${label}: ` + error.message); return; }
      setter(prev => [...prev, data]);
      toast.success(`${label} added`);
    },
    update: async (id: number, name: string) => {
      const trimmed = name.trim();
      if (!trimmed) return;
      const { error } = await supabase.from(table).update({ name: trimmed }).eq('id', id);
      if (error) { toast.error(`Failed to update ${label}: ` + error.message); return; }
      setter(prev => prev.map(item => item.id === id ? { id, name: trimmed } : item));
      toast.success(`${label} updated`);
    },
    delete: async (id: number) => {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) { toast.error(`Failed to delete ${label}: ` + error.message); return; }
      setter(prev => prev.filter(item => item.id !== id));
      toast.success(`${label} deleted`);
    },
  });

  const modelCRUD   = makeAttributeCRUD('FIREARM_MODELS',   setFirearmModels,   'Firearm model');
  const caliberCRUD = makeAttributeCRUD('FIREARM_CALIBERS', setFirearmCalibers, 'Firearm caliber');
  const makeCRUD    = makeAttributeCRUD('FIREARM_MAKES',    setFirearmMakes,    'Firearm make');
  const kindCRUD    = makeAttributeCRUD('FIREARM_KINDS',    setFirearmKinds,    'Firearm kind');

  // ──────────────────────────────────────────────────────────────────────────
  //  Firearm License CRUD
  // ──────────────────────────────────────────────────────────────────────────
  const addLicenseRecord = async (record: Omit<LicenseRecord, 'id' | 'isActive'>) => {
    const dbRecord = {
      serial_no:     record.serialNo,
      kind:          record.kind,
      make:          record.make,
      caliber:       record.caliber,
      model:         record.model,
      date_approved: record.dateApproved,
      date_expiry:   record.dateExpiry,
      is_active:     true,
    };
    const { data, error } = await supabase.from('FIREARM_LICENSES').insert([dbRecord]).select().single();
    if (error) { toast.error('Failed to save license: ' + error.message); throw error; }
    setLicenseRecords(prev => [{
      id:           data.id,
      serialNo:     data.serial_no,
      kind:         data.kind,
      make:         data.make,
      caliber:      data.caliber,
      model:        data.model,
      dateApproved: data.date_approved,
      dateExpiry:   data.date_expiry,
      isActive:     true,
    }, ...prev]);
    toast.success('License registered successfully');
  };

  const softDeleteLicense = async (id: number) => {
    const { error } = await supabase.from('FIREARM_LICENSES').update({ is_active: false }).eq('id', id);
    if (error) { toast.error('Failed to archive license: ' + error.message); throw error; }
    setLicenseRecords(prev => prev.filter(r => r.id !== id));
    toast.success('License archived');
  };

  // ──────────────────────────────────────────────────────────────────────────
  //  Context value
  // ──────────────────────────────────────────────────────────────────────────
  const value: MasterDataContextType = {
    religions, positions, departments, employeeStatuses,
    loanTypes, overtimeRates, isLoading,
    firearmModels, firearmCalibers, firearmMakes, firearmKinds,
    licenseRecords,

    addReligion, addPosition, addDepartment, addEmployeeStatus,
    addLoanType, updateLoanType, deleteLoanType, updateOvertimeRates,

    addFirearmModel:    modelCRUD.add,
    updateFirearmModel: modelCRUD.update,
    deleteFirearmModel: modelCRUD.delete,

    addFirearmCaliber:    caliberCRUD.add,
    updateFirearmCaliber: caliberCRUD.update,
    deleteFirearmCaliber: caliberCRUD.delete,

    addFirearmMake:    makeCRUD.add,
    updateFirearmMake: makeCRUD.update,
    deleteFirearmMake: makeCRUD.delete,

    addFirearmKind:    kindCRUD.add,
    updateFirearmKind: kindCRUD.update,
    deleteFirearmKind: kindCRUD.delete,

    addLicenseRecord,
    softDeleteLicense,
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
