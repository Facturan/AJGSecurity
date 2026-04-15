import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

type MasterDataContextType = {
  religions: string[];
  positions: { name: string }[];
  departments: { name: string }[];
  employeeStatuses: string[];
  firearmModels: string[];
  firearmCalibers: string[];
  firearmMakes: string[];
  firearmKinds: string[];
  firearmLicenses: string[];
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
  isLoading: boolean;
  addReligion: (name: string) => Promise<void>;
  addPosition: (name: string) => Promise<void>;
  addDepartment: (name: string) => Promise<void>;
  addEmployeeStatus: (name: string) => Promise<void>;
  addFirearmModel: (name: string) => Promise<void>;
  addFirearmCaliber: (name: string) => Promise<void>;
  addFirearmMake: (name: string) => Promise<void>;
  addFirearmKind: (name: string) => Promise<void>;
  addFirearmLicense: (name: string) => Promise<void>;
  addLoanType: (data: { loanId: string; loanType: string }) => Promise<void>;
  updateLoanType: (data: { loanId: string; loanType: string }) => Promise<void>;
  deleteLoanType: (loanId: string) => Promise<void>;
  updateOvertimeRates: (rates: { RateOTRegDay: number; RateOTSunday: number; RateOTSpecial: number; RateOTLegal: number; RateOTNDBase: number; RateOTNDAdd: number; }) => Promise<boolean | void>;
};

const MasterDataContext = createContext<MasterDataContextType | null>(null);

export function MasterDataProvider({ children }: { children: React.ReactNode }) {
  const [religions, setReligions] = useState<string[]>([]);
  const [positions, setPositions] = useState<{ name: string }[]>([]);
  const [departments, setDepartments] = useState<{ name: string }[]>([]);
  const [employeeStatuses, setEmployeeStatuses] = useState<string[]>([]);
  const [firearmModels, setFirearmModels] = useState<string[]>([]);
  const [firearmCalibers, setFirearmCalibers] = useState<string[]>([]);
  const [firearmMakes, setFirearmMakes] = useState<string[]>([]);
  const [firearmKinds, setFirearmKinds] = useState<string[]>([]);
  const [firearmLicenses, setFirearmLicenses] = useState<string[]>([]);
  const [loanTypes, setLoanTypes] = useState<{ loanId: string; loanType: string }[]>([]);
  const [overtimeRates, setOvertimeRates] = useState<MasterDataContextType['overtimeRates']>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        { data: lTypes },
        { data: otRates, error: otError }
      ] = await Promise.all([
        supabase.from('RELIGION').select('ReligionList'),
        supabase.from('EMPPOSITION').select('EmpPositionList'),
        supabase.from('DEPARTMENTS').select('name'),
        supabase.from('EMPLOYEE_STATUSES').select('name'),
        supabase.from('FIREARM_MODELS').select('name'),
        supabase.from('FIREARM_CALIBERS').select('name'),
        supabase.from('FIREARM_MAKES').select('name'),
        supabase.from('FIREARM_KINDS').select('name'),
        supabase.from('LOAN_TYPES').select('loanId, loanType'),
        supabase.from('OVERTIMERATE').select('*').limit(1),
      ]);

      if (rels) setReligions(rels.map(r => r.ReligionList));
      if (pos) {
        setPositions(pos.map((p: any) => ({
          name: p.EmpPositionList || 'Unnamed Position'
        })));
      }
      if (depts) setDepartments(depts);
      if (stats) setEmployeeStatuses(stats.map(s => s.name));
      // Fallback data for firearms (if Supabase returns 404/Empty)
      const defaultModels = ['G-17', 'M-30', 'PATROL', '1911', 'M4A1'];
      const defaultCalibers = ['9MM', '38', '12GA', '45 ACP', '5.56'];
      const defaultMakes = ['GLOCK', 'COLT', 'ARMSCOR', 'BERETTA', 'SIG SAUER'];
      const defaultKinds = ['PISTL', 'RVLVR', 'SHTGN', 'RIFLE'];

      setFirearmModels(fModels && fModels.length > 0 ? fModels.map((f: any) => f.name) : defaultModels);
      setFirearmCalibers(fCalibers && fCalibers.length > 0 ? fCalibers.map((f: any) => f.name) : defaultCalibers);
      setFirearmMakes(fMakes && fMakes.length > 0 ? fMakes.map((f: any) => f.name) : defaultMakes);
      setFirearmKinds(fKinds && fKinds.length > 0 ? fKinds.map((f: any) => f.name) : defaultKinds);
      if (lTypes) {
        setLoanTypes(lTypes.map((lt: any) => ({
          loanId: lt.loanId,
          loanType: lt.loanType
        })));
      }
      if (otRates && otRates.length > 0) {
        setOvertimeRates(otRates[0]);
      } else if (otRates) {
        setOvertimeRates(null);
      }

      setFirearmLicenses(['Regular License', 'Special Permit', 'LTO', 'PTCFOR']);

    } catch (error) {
      console.error('Error fetching master data:', error);
      toast.error('Failed to load master data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  const addReligion = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Name cannot be empty");
    try {
      const { error } = await supabase.from('RELIGION').insert([{ ReligionList: trimmed }]);
      if (error) throw error;
      setReligions(prev => [...prev, trimmed]);
      toast.success('Religion added');
    } catch (error: any) {
      toast.error('Failed to add religion: ' + error.message);
      throw error;
    }
  };

  const addPosition = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const newPos = {
      EmpPositionList: trimmed
    };
    try {
      const { error } = await supabase.from('EMPPOSITION').insert([newPos]);
      if (error) {
        console.error('Supabase error adding position:', error);
        throw error;
      }
      setPositions(prev => [...prev, { name: trimmed }]);
      toast.success('Position added successfully');
    } catch (error: any) {
      console.error('Error adding position:', error);
      toast.error('Failed to add position: ' + (error.message || 'Unknown error'));
      throw error;
    }
  };

  const addDepartment = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Name cannot be empty");
    const newDept = { name: trimmed };
    try {
      const { error } = await supabase.from('DEPARTMENTS').insert([newDept]);
      if (error) throw error;
      setDepartments(prev => [...prev, newDept]);
      toast.success('Department added');
    } catch (error: any) {
      toast.error('Failed to add department: ' + error.message);
      throw error;
    }
  };

  const addEmployeeStatus = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error("Name cannot be empty");
    try {
      const { error } = await supabase.from('EMPLOYEE_STATUSES').insert([{ name: trimmed }]);
      if (error) throw error;
      setEmployeeStatuses(prev => [...prev, trimmed]);
      toast.success('Status added');
    } catch (error: any) {
      toast.error('Failed to add status: ' + error.message);
      throw error;
    }
  };

  const addFirearmModel = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const { error } = await supabase.from('FIREARM_MODELS').insert([{ name: trimmed }]);
      if (error) throw error;
      setFirearmModels(prev => [...prev, trimmed]);
      toast.success('Firearm model added');
    } catch (error: any) {
      toast.error('Failed to add firearm model: ' + error.message);
    }
  };

  const addFirearmCaliber = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const { error } = await supabase.from('FIREARM_CALIBERS').insert([{ name: trimmed }]);
      if (error) throw error;
      setFirearmCalibers(prev => [...prev, trimmed]);
      toast.success('Firearm caliber added');
    } catch (error: any) {
      toast.error('Failed to add firearm caliber: ' + error.message);
    }
  };

  const addFirearmMake = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const { error } = await supabase.from('FIREARM_MAKES').insert([{ name: trimmed }]);
      if (error) throw error;
      setFirearmMakes(prev => [...prev, trimmed]);
      toast.success('Firearm make added');
    } catch (error: any) {
      toast.error('Failed to add firearm make: ' + error.message);
    }
  };

  const addFirearmKind = async (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const { error } = await supabase.from('FIREARM_KINDS').insert([{ name: trimmed }]);
      if (error) throw error;
      setFirearmKinds(prev => [...prev, trimmed]);
      toast.success('Firearm kind added');
    } catch (error: any) {
      toast.error('Failed to add firearm kind: ' + error.message);
    }
  };

  const addFirearmLicense = async (name: string) => {
    const trimmed = name.trim();
    if (trimmed) setFirearmLicenses((prev) => (prev.includes(trimmed) ? prev : [...prev, trimmed]));
  };

  const addLoanType = async (data: { loanId: string; loanType: string }) => {
    try {
      const { error } = await supabase.from('LOAN_TYPES').insert([data]);
      if (error) throw error;
      setLoanTypes(prev => [...prev, data]);
      toast.success('Loan type added');
    } catch (error: any) {
      toast.error('Failed to add loan type: ' + error.message);
      throw error;
    }
  };

  const updateLoanType = async (data: { loanId: string; loanType: string }) => {
    try {
      const { error } = await supabase.from('LOAN_TYPES').update({ loanType: data.loanType }).eq('loanId', data.loanId);
      if (error) throw error;
      setLoanTypes(prev => prev.map(lt => lt.loanId === data.loanId ? data : lt));
      toast.success('Loan type updated');
    } catch (error: any) {
      toast.error('Failed to update loan type: ' + error.message);
      throw error;
    }
  };
 
  const deleteLoanType = async (loanId: string) => {
    try {
      const { error } = await supabase.from('LOAN_TYPES').delete().eq('loanId', loanId);
      if (error) throw error;
      setLoanTypes(prev => prev.filter(lt => lt.loanId !== loanId));
      toast.success('Loan type deleted');
    } catch (error: any) {
      toast.error('Failed to delete loan type: ' + error.message);
      throw error;
    }
  };

  const updateOvertimeRates = async (rates: { RateOTRegDay: number; RateOTSunday: number; RateOTSpecial: number; RateOTLegal: number; RateOTNDBase: number; RateOTNDAdd: number; }) => {
    try {
      if (overtimeRates?.id) {
        const { error } = await supabase.from('OVERTIMERATE').update(rates).eq('id', overtimeRates.id);
        if (error) throw error;
        setOvertimeRates({ ...overtimeRates, ...rates });
      } else {
        // Check if a row exists but we haven't loaded it properly (e.g. initial fetch failed)
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
      console.error('Failed to update overtime rates:', error);
      toast.error('Failed to update overtime rates: ' + error.message);
      throw error;
    }
  };

  const value: MasterDataContextType = {
    religions,
    positions,
    departments,
    employeeStatuses,
    isLoading,
    addReligion,
    addPosition,
    addDepartment,
    addEmployeeStatus,
    firearmModels,
    firearmCalibers,
    firearmMakes,
    firearmKinds,
    firearmLicenses,
    loanTypes,
    overtimeRates,
    addFirearmModel,
    addFirearmCaliber,
    addFirearmMake,
    addFirearmKind,
    addFirearmLicense,
    addLoanType,
    updateLoanType,
    deleteLoanType,
    updateOvertimeRates,
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
