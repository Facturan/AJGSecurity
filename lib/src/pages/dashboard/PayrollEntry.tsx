import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Printer, Loader2, ChevronDown, Search } from 'lucide-react';
import { useHeader } from './components/Header';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useMasterData } from './MasterDataContext';

function formatNumber(value: number): string {
  return value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseInput(value: any): number {
  if (value === null || value === undefined) return 0;
  const cleaned = String(value).replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function PayrollEntry() {
  const { setHeaderInfo } = useHeader();
  const [netPay, setNetPay] = useState('0.00');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Employee Info
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [empName, setEmpName] = useState('');
  const [empIdNo, setEmpIdNo] = useState('');
  const [salaryMethod, setSalaryMethod] = useState('daily');
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Period info
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [datePosting, setDatePosting] = useState(new Date().toISOString().split('T')[0]);

  // Income
  const [dailyRate, setDailyRate] = useState('');
  const [noOfDays, setNoOfDays] = useState('');
  const [basePay, setBasePay] = useState('');
  const [otRegDayHours, setOtRegDayHours] = useState('');
  const [otRegDayAmount, setOtRegDayAmount] = useState('');
  const [otSundayHours, setOtSundayHours] = useState('');
  const [otSundayAmount, setOtSundayAmount] = useState('');
  const [otSpecialHours, setOtSpecialHours] = useState('');
  const [otSpecialAmount, setOtSpecialAmount] = useState('');
  const [otLegalHours, setOtLegalHours] = useState('');
  const [otLegalAmount, setOtLegalAmount] = useState('');
  const [otNdHours, setOtNdHours] = useState('');
  const [otNdAmount, setOtNdAmount] = useState('');
  const [totalOtPay, setTotalOtPay] = useState('');
  const [specialHolidayMult, setSpecialHolidayMult] = useState('');
  const [specialHolidayHours, setSpecialHolidayHours] = useState('');
  const [specialHolidayAmount, setSpecialHolidayAmount] = useState('');
  const [legalHolidayMult, setLegalHolidayMult] = useState('');
  const [legalHolidayHours, setLegalHolidayHours] = useState('');
  const [legalHolidayAmount, setLegalHolidayAmount] = useState('');
  const [totalHoliday, setTotalHoliday] = useState('');
  const [allowance, setAllowance] = useState('');
  const [allowanceDisplay, setAllowanceDisplay] = useState('');
  const [ouPay, setOuPay] = useState('');
  const [totalIncome, setTotalIncome] = useState('');

  // Deductions
  const [absentDays, setAbsentDays] = useState('');
  const [absentAmount, setAbsentAmount] = useState('');
  const [lateMinutes, setLateMinutes] = useState('');
  const [lateAmount, setLateAmount] = useState('');
  const [comms, setComms] = useState('');
  const [mpl, setMpl] = useState('');
  const [hdmfLoan, setHdmfLoan] = useState('');
  const [sssLoan, setSssLoan] = useState('');
  const [elBonitaLoan, setElBonitaLoan] = useState('');
  const [cashAdvance, setCashAdvance] = useState('');
  const [storeAcct, setStoreAcct] = useState('');
  const [uniform, setUniform] = useState('');
  const [safetyShoes, setSafetyShoes] = useState('');
  const [foodAllowance, setFoodAllowance] = useState('');
  const [pagIbigPhilhealth, setPagIbigPhilhealth] = useState('');
  const [riceCa, setRiceCa] = useState('');
  const [rice, setRice] = useState('');
  const [cpLoan, setCpLoan] = useState('');
  const [sssPenalty, setSssPenalty] = useState('');
  const [motorUrc, setMotorUrc] = useState('');
  const [totalDeduction, setTotalDeduction] = useState('');

  // Employee Contribution
  const [sssEmp, setSssEmp] = useState('');
  const [phicEmp, setPhicEmp] = useState('');
  const [hdmfEmp, setHdmfEmp] = useState('');
  const [wtax, setWtax] = useState('');
  const [totalEmpContribution, setTotalEmpContribution] = useState('');

  // Employer Contribution
  const [sssEmployer, setSssEmployer] = useState('');
  const [phicEmployer, setPhicEmployer] = useState('');
  const [hdmfEmployer, setHdmfEmployer] = useState('');
  const [otRegDayMult, setOtRegDayMult] = useState('1.25');
  const [otSundayMult, setOtSundayMult] = useState('1.30');
  const [otSpecialMult, setOtSpecialMult] = useState('1.30');
  const [otLegalMult, setOtLegalMult] = useState('2.00');
  const [otNdMult1, setOtNdMult1] = useState('1.25');
  const [otNdMult2, setOtNdMult2] = useState('0.10');

  const { overtimeRates } = useMasterData();

  useEffect(() => {
    if (overtimeRates) {
      setOtRegDayMult(overtimeRates.RateOTRegDay.toString());
      setOtSundayMult(overtimeRates.RateOTSunday.toString());
      setOtSpecialMult(overtimeRates.RateOTSpecial.toString());
      setOtLegalMult(overtimeRates.RateOTLegal.toString());
      setOtNdMult1(overtimeRates.RateOTNDBase.toString());
      setOtNdMult2(overtimeRates.RateOTNDAdd.toString());
    }
  }, [overtimeRates]);

  useEffect(() => {
    setHeaderInfo({ title: 'Payroll Data Entry', subtitle: 'Payroll Management', showSearch: false });
    fetchEmployees();
  }, [setHeaderInfo]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('EMPDETAILS')
        .select('EmplID, idno, Fname, MName, LName, DailyRate, MonthlyRate, EmpRate, MempSSS, MempPHIC, MempHDMF, MComSSS, MComPHIC, MComHDMF')
        .order('LName', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast.error('Error fetching employees: ' + error.message);
    }
  };

  const handleSelectEmployee = async (emplID: string) => {
    const emp = employees.find(e => e.EmplID.toString() === emplID);
    if (emp) {
      setSelectedEmpId(emplID);
      setEmpIdNo(emp.idno);
      setEmpName(`${emp.Fname} ${emp.LName}`.trim());
      setSalaryMethod(emp.EmpRate || 'daily');
      setDailyRate(formatNumber(emp.DailyRate || 0));

      // Populate Contributions
      setSssEmp(formatNumber(emp.MempSSS || 0));
      setPhicEmp(formatNumber(emp.MempPHIC || 0));
      setHdmfEmp(formatNumber(emp.MempHDMF || 0));

      setSssEmployer(formatNumber(emp.MComSSS || 0));
      setPhicEmployer(formatNumber(emp.MComPHIC || 0));
      setHdmfEmployer(formatNumber(emp.MComHDMF || 0));

      // Fetch active loans automatically
      try {
        const { data: loans, error } = await supabase
          .from('LOANS')
          .select('*')
          .eq('employeeId', parseInt(emplID))
          .eq('status', 'Active');

        if (!error && loans) {
          let vMpl = 0, vHdmfLoan = 0, vSssLoan = 0, vElBonita = 0, vCpLoan = 0;
          let vCashAdvance = 0, vStoreAcct = 0, vUniform = 0, vShoes = 0;

          loans.forEach((loan: any) => {
            const lType = (loan.loanType || '').toLowerCase().replace(/[^a-z0-9]/g, '');
            const amt = parseFloat(loan.biMonthlyPayment) || 0;
            
            if (lType.includes('mpl')) vMpl += amt;
            else if (lType.includes('hdmf')) vHdmfLoan += amt;
            else if (lType.includes('sss')) vSssLoan += amt;
            else if (lType.includes('elbonita')) vElBonita += amt;
            else if (lType.includes('cp')) vCpLoan += amt;
            else if (lType.includes('cashadvance') || lType.includes('ca')) vCashAdvance += amt;
            else if (lType.includes('store') || lType.includes('egg') || lType.includes('car')) vStoreAcct += amt;
            else if (lType.includes('uniform')) vUniform += amt;
            else if (lType.includes('shoe')) vShoes += amt;
          });

          setMpl(vMpl > 0 ? formatNumber(vMpl) : '');
          setHdmfLoan(vHdmfLoan > 0 ? formatNumber(vHdmfLoan) : '');
          setSssLoan(vSssLoan > 0 ? formatNumber(vSssLoan) : '');
          setElBonitaLoan(vElBonita > 0 ? formatNumber(vElBonita) : '');
          setCpLoan(vCpLoan > 0 ? formatNumber(vCpLoan) : '');
          setCashAdvance(vCashAdvance > 0 ? formatNumber(vCashAdvance) : '');
          setStoreAcct(vStoreAcct > 0 ? formatNumber(vStoreAcct) : '');
          setUniform(vUniform > 0 ? formatNumber(vUniform) : '');
          setSafetyShoes(vShoes > 0 ? formatNumber(vShoes) : '');
        }
      } catch (err) {
        console.error('Error auto-filling loans:', err);
      }

      // Trigger a recalc if needed
      setTimeout(calculateNetPay, 100);
    }
  };

  const handleSave = async () => {
    if (!selectedEmpId) {
      toast.error('Please select an employee');
      return;
    }

    setIsSubmitting(true);
    try {
      const dbData = {
        EmpID: parseInt(selectedEmpId),
        EmpName: empName,
        SalaryMethod: salaryMethod,
        DateFrom: dateFrom || null,
        DateTo: dateTo || null,
        DailyRate: parseInput(dailyRate),
        NoOfDays: parseInput(noOfDays),
        BasicRate: parseInput(basePay),
        OTRegHrs: parseInput(otRegDayHours),
        TotalOTRegHrs: parseInput(otRegDayAmount),
        OTSunHrs: parseInput(otSundayHours),
        TotalOTSunHrs: parseInput(otSundayAmount),
        OTSpecialHrs: parseInput(otSpecialHours),
        TotalOTSpecialHrs: parseInput(otSpecialAmount),
        OTLegalHrs: parseInput(otLegalHours),
        TotalOTLegalHrs: parseInput(otLegalAmount),
        OTNightDiffHrs: parseInput(otNdHours),
        TotalOTNightDiffHrs: parseInput(otNdAmount),
        TotalOTPay: parseInput(totalOtPay),
        TotalSpecialDay: parseInput(specialHolidayAmount),
        TotalLegalDay: parseInput(legalHolidayAmount),
        TotalHoliday: parseInput(totalHoliday),
        AllowanceRate: parseInput(allowance),
        TotalAllowance: parseInput(allowanceDisplay),
        OverUnderPay: parseInput(ouPay),
        TotalIncome: parseInput(totalIncome),
        Absent: parseInput(absentDays),
        TotalAbsent: parseInput(absentAmount),
        Late: parseInput(lateMinutes),
        TotalLate: parseInput(lateAmount),
        GlobeExcess: parseInput(comms),
        MPL: parseInput(mpl),
        HDMFLoan: parseInput(hdmfLoan),
        SSSLoan: parseInput(sssLoan),
        CashAdvance: parseInput(cashAdvance),
        StoreAccount: parseInput(storeAcct),
        Uniform: parseInput(uniform),
        Shoes: parseInput(safetyShoes),
        TravelAllowance: parseInput(foodAllowance),
        TotalDeduc: parseInput(totalDeduction),
        EmpSSS: parseInput(sssEmp),
        PHIC: parseInput(phicEmp),
        EmpHDMF: parseInput(hdmfEmp),
        WTAX: parseInput(wtax),
        TotalEmpCont: parseInput(totalEmpContribution),
        ComSSS: parseInput(sssEmployer),
        ComPHIC: parseInput(phicEmployer),
        ComHDMF: parseInput(hdmfEmployer),
        NetPay: parseInput(netPay),
        DatePosting: datePosting,
        ElBonitaLoan: parseInput(elBonitaLoan),
        PagIbigPhilhealth: parseInput(pagIbigPhilhealth),
        RiceCA: parseInput(riceCa),
        Rice: parseInput(rice),
        CPLoan: parseInput(cpLoan),
        SSSPenalty: parseInput(sssPenalty),
        MotorURC: parseInput(motorUrc)
      };

      const { error } = await supabase
        .from('PAYROLLDATA')
        .insert([dbData]);

      if (error) throw error;
      toast.success('Payroll data saved successfully');
    } catch (error: any) {
      toast.error('Error saving payroll data: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNew = () => {
    setSelectedEmpId('');
    setEmpIdNo('');
    setEmpName('');
    setSalaryMethod('daily');
    setDateFrom('');
    setDateTo('');
    setSearchQuery('');
    // Income
    setDailyRate(''); setNoOfDays(''); setBasePay('');
    setOtRegDayHours(''); setOtRegDayAmount('');
    setOtSundayHours(''); setOtSundayAmount('');
    setOtSpecialHours(''); setOtSpecialAmount('');
    setOtLegalHours(''); setOtLegalAmount('');
    setOtNdHours(''); setOtNdAmount('');
    setTotalOtPay('');
    setSpecialHolidayMult(''); setSpecialHolidayHours(''); setSpecialHolidayAmount('');
    setLegalHolidayMult(''); setLegalHolidayHours(''); setLegalHolidayAmount('');
    setTotalHoliday('');
    setAllowance(''); setAllowanceDisplay(''); setOuPay(''); setTotalIncome('');
    // Deductions
    setAbsentDays(''); setAbsentAmount('');
    setLateMinutes(''); setLateAmount('');
    setComms(''); setMpl(''); setHdmfLoan(''); setSssLoan('');
    setElBonitaLoan(''); setCashAdvance(''); setStoreAcct('');
    setUniform(''); setSafetyShoes(''); setFoodAllowance('');
    setPagIbigPhilhealth(''); setRiceCa(''); setRice('');
    setCpLoan(''); setSssPenalty(''); setMotorUrc('');
    setTotalDeduction('');
    // Contributions
    setSssEmp(''); setPhicEmp(''); setHdmfEmp(''); setWtax('');
    setTotalEmpContribution('');
    setSssEmployer(''); setPhicEmployer(''); setHdmfEmployer('');
    setNetPay('');
    toast.info('Form cleared for new entry');
  };

  const recalcBasePay = useCallback(() => {
    const base = parseInput(dailyRate) * parseInput(noOfDays);
    setBasePay(formatNumber(base));
  }, [dailyRate, noOfDays]);

  const recalcOtRates = useCallback(() => {
    const rate = parseInput(dailyRate);
    const hr = rate / 8;
    const otReg = hr * parseInput(otRegDayMult);
    const otSun = hr * parseInput(otSundayMult);
    const otSpec = hr * parseInput(otSpecialMult);
    const otLeg = hr * parseInput(otLegalMult);
    const otNd = (hr * parseInput(otNdMult1)) * parseInput(otNdMult2);
    setOtRegDayAmount(formatNumber(otReg));
    setOtSundayAmount(formatNumber(otSun));
    setOtSpecialAmount(formatNumber(otSpec));
    setOtLegalAmount(formatNumber(otLeg));
    setOtNdAmount(formatNumber(otNd));
  }, [dailyRate, otRegDayMult, otSundayMult, otSpecialMult, otLegalMult, otNdMult1, otNdMult2]);

  const recalcOtAmounts = useCallback(() => {
    const reg = parseInput(otRegDayAmount) * parseInput(otRegDayHours);
    const sun = parseInput(otSundayAmount) * parseInput(otSundayHours);
    const spec = parseInput(otSpecialAmount) * parseInput(otSpecialHours);
    const leg = parseInput(otLegalAmount) * parseInput(otLegalHours);
    const nd = parseInput(otNdAmount) * parseInput(otNdHours);
    const total = reg + sun + spec + leg + nd;
    setTotalOtPay(formatNumber(total));
  }, [otRegDayAmount, otRegDayHours, otSundayAmount, otSundayHours, otSpecialAmount, otSpecialHours, otLegalAmount, otLegalHours, otNdAmount, otNdHours]);

  const recalcHoliday = useCallback(() => {
    const hr = parseInput(dailyRate) / 8;
    const special = parseInput(specialHolidayMult) * parseInput(specialHolidayHours) * hr;
    const legal = parseInput(legalHolidayMult) * parseInput(legalHolidayHours) * hr;
    setSpecialHolidayAmount(formatNumber(special));
    setLegalHolidayAmount(formatNumber(legal));
    setTotalHoliday(formatNumber(special + legal));
  }, [dailyRate, specialHolidayMult, specialHolidayHours, legalHolidayMult, legalHolidayHours]);

  const recalcAllowance = useCallback(() => {
    setAllowanceDisplay(allowance);
  }, [allowance]);


  const recalcTotalIncome = useCallback(() => {
    const base = parseInput(basePay);
    const ot = parseInput(totalOtPay);
    const holiday = parseInput(totalHoliday);
    const allow = parseInput(allowanceDisplay);
    const ou = parseInput(ouPay);
    const total = base + ot + holiday + allow + ou;
    setTotalIncome(formatNumber(total));
  }, [basePay, totalOtPay, totalHoliday, allowanceDisplay, ouPay]);

  const recalcAbsent = useCallback(() => {
    const amt = parseInput(absentDays) * parseInput(dailyRate);
    setAbsentAmount(formatNumber(amt));
  }, [absentDays, dailyRate]);

  const recalcLate = useCallback(() => {
    const amt = (parseInput(lateMinutes) / 60) * (parseInput(dailyRate) / 8);
    setLateAmount(formatNumber(amt));
  }, [lateMinutes, dailyRate]);

  const recalcTotalDeduction = useCallback(() => {
    const total =
      parseInput(absentAmount) +
      parseInput(lateAmount) +
      parseInput(comms) +
      parseInput(mpl) +
      parseInput(hdmfLoan) +
      parseInput(sssLoan) +
      parseInput(elBonitaLoan) +
      parseInput(cashAdvance) +
      parseInput(storeAcct) +
      parseInput(uniform) +
      parseInput(safetyShoes) +
      parseInput(foodAllowance) +
      parseInput(pagIbigPhilhealth) +
      parseInput(riceCa) +
      parseInput(rice) +
      parseInput(cpLoan) +
      parseInput(sssPenalty) +
      parseInput(motorUrc);
    setTotalDeduction(formatNumber(total));
  }, [absentAmount, lateAmount, comms, mpl, hdmfLoan, sssLoan, elBonitaLoan, cashAdvance, storeAcct, uniform, safetyShoes, foodAllowance, pagIbigPhilhealth, riceCa, rice, cpLoan, sssPenalty, motorUrc]);

  const recalcEmpContribution = useCallback(() => {
    const total = parseInput(sssEmp) + parseInput(phicEmp) + parseInput(hdmfEmp) + parseInput(wtax);
    setTotalEmpContribution(formatNumber(total));
  }, [sssEmp, phicEmp, hdmfEmp, wtax]);

  const calculateNetPay = useCallback(() => {
    recalcBasePay();
    recalcOtRates();
    recalcOtAmounts();
    recalcHoliday();
    recalcAllowance();
    recalcTotalIncome();
    recalcAbsent();
    recalcLate();
    recalcTotalDeduction();
    recalcEmpContribution();

    const dRate = parseInput(dailyRate);
    const hr = dRate / 8;
    
    // Sync Income calculation
    const base = dRate * parseInput(noOfDays);
    
    const regOt = hr * parseInput(otRegDayMult) * parseInput(otRegDayHours);
    const sunOt = hr * parseInput(otSundayMult) * parseInput(otSundayHours);
    const specOt = hr * parseInput(otSpecialMult) * parseInput(otSpecialHours);
    const legOt = hr * parseInput(otLegalMult) * parseInput(otLegalHours);
    const ndOt = hr * parseInput(otNdMult1) * parseInput(otNdMult2) * parseInput(otNdHours);
    const totalOt = regOt + sunOt + specOt + legOt + ndOt;

    const specHol = hr * parseInput(specialHolidayMult) * parseInput(specialHolidayHours);
    const legHol = hr * parseInput(legalHolidayMult) * parseInput(legalHolidayHours);
    const totalHol = specHol + legHol;

    const income = base + totalOt + totalHol + parseInput(allowance) + parseInput(ouPay);

    const deduction =
      parseInput(absentDays) * dRate +
      (parseInput(lateMinutes) / 60) * hr +
      parseInput(comms) + parseInput(mpl) + parseInput(hdmfLoan) + parseInput(sssLoan) +
      parseInput(elBonitaLoan) +
      parseInput(cashAdvance) + parseInput(storeAcct) + parseInput(uniform) + parseInput(safetyShoes) +
      parseInput(foodAllowance) + parseInput(pagIbigPhilhealth) +
      parseInput(riceCa) + parseInput(rice) + parseInput(cpLoan) + parseInput(sssPenalty) + parseInput(motorUrc);

    const contribution = parseInput(sssEmp) + parseInput(phicEmp) + parseInput(hdmfEmp) + parseInput(wtax);

    const net = income - deduction - contribution;
    setNetPay(formatNumber(Math.max(0, net)));
  }, [dailyRate, noOfDays, otRegDayMult, otRegDayHours, otSundayMult, otSundayHours, otSpecialMult, otSpecialHours,
    otLegalMult, otLegalHours, otNdMult1, otNdMult2, otNdHours, specialHolidayMult, specialHolidayHours, legalHolidayMult, legalHolidayHours,
    allowance, ouPay, absentDays, lateMinutes, comms, mpl, hdmfLoan, sssLoan, elBonitaLoan, cashAdvance, storeAcct, uniform, safetyShoes, foodAllowance, pagIbigPhilhealth, riceCa, rice, cpLoan, sssPenalty, motorUrc,
    sssEmp, phicEmp, hdmfEmp, wtax, recalcBasePay, recalcOtRates, recalcOtAmounts, recalcHoliday, recalcAllowance, recalcTotalIncome, recalcAbsent, recalcLate, recalcTotalDeduction, recalcEmpContribution]);

  useEffect(() => {
    if (!selectedEmpId) {
      setNetPay('0.00');
      return;
    }
    calculateNetPay();
  }, [selectedEmpId, dailyRate, noOfDays, otRegDayMult, otRegDayHours, otSundayMult, otSundayHours, otSpecialMult, otSpecialHours,
    otLegalMult, otLegalHours, otNdMult1, otNdMult2, otNdHours, specialHolidayMult, specialHolidayHours, legalHolidayMult, legalHolidayHours,
    allowance, ouPay, absentDays, lateMinutes, comms, mpl, hdmfLoan, sssLoan, elBonitaLoan, cashAdvance, storeAcct, uniform, safetyShoes, foodAllowance, pagIbigPhilhealth, riceCa, rice, cpLoan, sssPenalty, motorUrc,
    sssEmp, phicEmp, hdmfEmp, wtax, calculateNetPay]);


  return (
    <div className="w-full flex justify-center py-4 px-2">
      <div className="w-full max-w-[1180px] bg-white border border-gray-200 rounded-xl shadow-[0_18px_45px_rgba(15,23,42,0.16)] overflow-hidden">
        {/* Top Section - Employee and Period Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 py-4 bg-[#f6f7fb] border-b border-gray-200">
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-[80px_140px_160px_1fr] gap-2 items-start sm:items-center">
              <Label className="font-bold text-sm text-black">ID No</Label>
              <Input className="h-8 bg-gray-100 font-bold text-black" value={empIdNo} readOnly />
              <Input className="h-8 text-left tabular-nums bg-gray-100 font-bold text-black" value={selectedEmpId || ''} readOnly />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr] gap-2 items-start sm:items-center">
              <Label className="font-bold text-sm text-black">Employee</Label>
              <div className="relative" ref={dropdownRef}>
                {/* Trigger button */}
                <button
                  type="button"
                  onClick={() => { setOpen(prev => !prev); setSearchQuery(''); }}
                  className="h-8 w-full flex items-center justify-between bg-white border border-gray-300 rounded-md px-3 text-black font-bold text-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-slate-400 transition-all"
                >
                  <span className="truncate">
                    {selectedEmpId ? empName : ''}
                  </span>
                  <ChevronDown className={`ml-2 h-4 w-4 shrink-0 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown panel */}
                {open && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg overflow-hidden">
                    {/* Search input */}
                    <div className="flex items-center border-b border-gray-200 px-3">
                      <Search className="h-4 w-4 text-gray-400 shrink-0 mr-2" />
                      <input
                        autoFocus
                        type="text"
                        placeholder="Search by name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-9 text-sm text-black bg-transparent outline-none placeholder:text-gray-400"
                      />
                    </div>
                    {/* Results list */}
                    <div className="max-h-[260px] overflow-y-auto">
                      {employees
                        .filter(emp =>
                          !searchQuery ||
                          `${emp.LName} ${emp.Fname} ${emp.EmplID} ${emp.idno}`.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .length === 0 ? (
                        <div className="px-3 py-4 text-center text-sm text-gray-400">No employee found.</div>
                      ) : (
                        employees
                          .filter(emp =>
                            !searchQuery ||
                            `${emp.LName} ${emp.Fname} ${emp.EmplID} ${emp.idno}`.toLowerCase().includes(searchQuery.toLowerCase())
                          )
                          .map(emp => (
                            <button
                              key={emp.EmplID}
                              type="button"
                              onClick={() => {
                                handleSelectEmployee(emp.EmplID.toString());
                                setOpen(false);
                                setSearchQuery('');
                              }}
                              className={`w-full flex flex-col items-start px-3 py-2 text-left hover:bg-slate-50 transition-colors border-b border-gray-100 last:border-0 ${selectedEmpId === emp.EmplID.toString() ? 'bg-slate-50' : ''
                                }`}
                            >
                              <span className="font-bold text-sm text-black">{emp.Fname} {emp.LName}</span>
                              <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 font-medium">ID: {emp.idno}</span>
                                <span className="text-gray-300">|</span>
                                <span className="italic">Sys: {emp.EmplID}</span>
                              </div>
                            </button>
                          ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[80px_1fr_100px_1fr] gap-2 items-start sm:items-center">
              <Label className="font-bold text-sm text-black">Method</Label>
              <Select value={salaryMethod} onValueChange={setSalaryMethod}>
                <SelectTrigger className="h-8 text-black bg-white">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">DAILY</SelectItem>
                  <SelectItem value="monthly">MONTHLY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr] gap-2 items-start sm:items-center">
              <Label className="font-bold text-sm text-black">Posting</Label>
              <Input className="h-8 text-black bg-white" type="date" value={datePosting} onChange={(e) => setDatePosting(e.target.value)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_40px_1fr] gap-2 items-start sm:items-center">
              <Label className="font-bold text-sm text-black">From</Label>
              <Input className="h-8 text-black bg-white" type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              <Label className="font-bold text-sm sm:text-right text-black">To:</Label>
              <Input className="h-8 text-black bg-white" type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] p-[1px] bg-gray-300">
          {/* Column 1 - Income */}
          <div className="bg-white text-black shadow-sm">
            <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs tracking-wide border-b border-gray-300 text-black uppercase">
              Income
            </div>
            <div className="p-3 space-y-2">
              {/* Daily Rate / No of Days - labels inline with inputs */}
              <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-3 gap-y-1 items-center">
                <Label className="text-xs text-black">Daily Rate</Label>
                <Input
                  className="h-7 text-sm text-black px-2 text-right tabular-nums border-gray-300"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(e.target.value)}
                />
                <Label className="text-xs text-black">No of Days</Label>
                <Input
                  className="h-7 text-sm text-black px-2 text-right tabular-nums border-gray-300"
                  value={noOfDays}
                  onChange={(e) => setNoOfDays(e.target.value)}
                />
              </div>

              {/* Base pay - large bold read-only spanning below */}
              <div className="py-0.5">
                <Input
                  className="h-8 bg-gray-100 font-bold text-right tabular-nums text-black px-2 w-full border-gray-300"
                  value={basePay}
                  readOnly
                />
              </div>

              {/* OT rows - label | hours input | amount read-only */}
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-xs text-black">OT Reg Day</Label>
                <div />
                <Input
                  className="h-6 text-xs text-black px-2 text-right tabular-nums border-gray-300"
                  value={otRegDayHours}
                  onChange={(e) => setOtRegDayHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-gray-100 font-semibold text-black px-2 text-right tabular-nums border-gray-300"
                  value={otRegDayAmount}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-xs text-black">OT Sunday</Label>
                <div />
                <Input
                  className="h-6 text-xs text-black px-2 text-right tabular-nums border-gray-300"
                  value={otSundayHours}
                  onChange={(e) => setOtSundayHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-gray-100 font-semibold text-black px-2 text-right tabular-nums border-gray-300"
                  value={otSundayAmount}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-xs text-black">OT Special</Label>
                <div />
                <Input
                  className="h-6 text-xs text-black px-2 text-right tabular-nums border-gray-300"
                  value={otSpecialHours}
                  onChange={(e) => setOtSpecialHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-gray-100 font-semibold text-black px-2 text-right tabular-nums border-gray-300"
                  value={otSpecialAmount}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-xs text-black">OT Legal</Label>
                <div />
                <Input
                  className="h-6 text-xs text-black px-2 text-right tabular-nums border-gray-300"
                  value={otLegalHours}
                  onChange={(e) => setOtLegalHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-gray-100 font-semibold text-black px-2 text-right tabular-nums border-gray-300"
                  value={otLegalAmount}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-xs text-black">OT ND</Label>
                <div />
                <Input
                  className="h-6 text-xs text-black px-2 text-right tabular-nums border-gray-300"
                  value={otNdHours}
                  onChange={(e) => setOtNdHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-gray-100 font-semibold text-black px-2 text-right tabular-nums border-gray-300"
                  value={otNdAmount}
                  readOnly
                />
              </div>

              {/* Total OT - EXE button | bold amount */}
              <div className="flex gap-2 items-center py-0.5">
                <Button
                  className="h-7 w-12 bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 rounded text-xs font-bold shrink-0"
                  onClick={() => {
                    recalcOtRates();
                    recalcOtAmounts();
                  }}
                >
                  EXE
                </Button>
                <Input
                  className="h-7 flex-1 bg-gray-100 font-bold text-right tabular-nums text-black px-2 border-gray-300"
                  value={totalOtPay}
                  readOnly
                />
              </div>

              {/* Holiday rows - label | mult input | hours input | amount read-only */}
              <div className="grid grid-cols-[70px_1fr_70px_70px_100px] gap-2 items-center">
                <Label className="text-xs text-black">Special/hr</Label>
                <div />
                <Input
                  className="h-6 text-xs text-black px-1 text-right tabular-nums border-gray-300"
                  value={specialHolidayMult}
                  onChange={(e) => setSpecialHolidayMult(e.target.value)}
                />
                <Input
                  className="h-6 text-xs text-black px-1 text-right tabular-nums border-gray-300"
                  value={specialHolidayHours}
                  onChange={(e) => setSpecialHolidayHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-gray-100 font-semibold text-black px-2 text-right tabular-nums border-gray-300"
                  value={specialHolidayAmount}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[70px_1fr_70px_70px_100px] gap-2 items-center">
                <Label className="text-xs text-black">Legal/hr</Label>
                <div />
                <Input
                  className="h-6 text-xs text-black px-1 text-right tabular-nums border-gray-300"
                  value={legalHolidayMult}
                  onChange={(e) => setLegalHolidayMult(e.target.value)}
                />
                <Input
                  className="h-6 text-xs text-black px-1 text-right tabular-nums border-gray-300"
                  value={legalHolidayHours}
                  onChange={(e) => setLegalHolidayHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-gray-100 font-semibold text-black px-2 text-right tabular-nums border-gray-300"
                  value={legalHolidayAmount}
                  readOnly
                />
              </div>

              {/* Total Holiday - label | EXE | amount */}
              <div className="flex gap-2 items-center py-0.5">
                <Label className="text-xs text-black shrink-0">Total Holiday</Label>
                <Button
                  className="h-7 w-12 shrink-0 bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 rounded text-xs font-bold"
                  onClick={recalcHoliday}
                >
                  EXE
                </Button>
                <Input
                  className="h-7 flex-1 bg-gray-100 font-bold text-right tabular-nums text-black px-2 border-gray-300"
                  value={totalHoliday}
                  readOnly
                />
              </div>

              {/* Allowance - label | editable input | read-only display */}
              <div className="grid grid-cols-[70px_1fr_70px_100px] gap-2 items-center">
                <Label className="text-xs text-black">Allowance</Label>
                <div />
                <Input
                  className="h-6 text-xs text-black px-2 text-right tabular-nums border-gray-300"
                  value={allowance}
                  onChange={(e) => setAllowance(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-gray-100 font-semibold text-black px-2 text-right tabular-nums border-gray-300"
                  value={allowanceDisplay}
                  readOnly
                />
              </div>

              {/* O/U Pay - label | editable input */}
              <div className="grid grid-cols-[70px_1fr_100px] gap-2 items-center">
                <Label className="text-xs text-black">O/U Pay</Label>
                <div />
                <Input
                  className="h-6 text-xs text-black px-2 text-right tabular-nums border-gray-300"
                  value={ouPay}
                  onChange={(e) => setOuPay(e.target.value)}
                />
              </div>

              { }
              <div className="flex gap-2 items-center pt-1">
                <Label className="text-xs text-black font-bold shrink-0">Gross Income</Label>
                <Button
                  className="h-8 w-12 shrink-0 bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 rounded text-xs font-bold"
                  onClick={() => {
                    recalcBasePay();
                    recalcOtRates();
                    recalcOtAmounts();
                    recalcHoliday();
                    recalcAllowance();
                    recalcTotalIncome();
                  }}
                >
                  EXE
                </Button>
                <Input
                  className="h-9 flex-1 bg-gray-100 text-black font-bold text-right tabular-nums text-lg px-2 border-gray-300"
                  value={totalIncome}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Column 2 - Deductions */}
          <div className="bg-white text-black">
            <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs tracking-wide border-b border-gray-300 text-black uppercase">
              Deductions
            </div>
            <div className="p-2 space-y-1">
              <div className="grid grid-cols-[1fr_120px_120px] gap-1 items-center">
                <Label className="text-xs text-black">Absent (Days)</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={absentDays} onChange={(e) => setAbsentDays(e.target.value)} />
                <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums font-semibold text-black px-1" value={absentAmount} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px_120px] gap-1 items-center">
                <Label className="text-xs text-black">Late (Minutes)</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={lateMinutes} onChange={(e) => setLateMinutes(e.target.value)} />
                <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums font-semibold text-black px-1" value={lateAmount} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">Comms</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={comms} onChange={(e) => setComms(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">MPL(Pag-ibig Loan)</Label>
                <Input className="h-6 text-xs bg-gray-100 text-slate-600 px-1 text-right tabular-nums" value={mpl} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">HDMF Loan(Pag-ibig Loan)</Label>
                <Input className="h-6 text-xs bg-gray-100 text-slate-600 px-1 text-right tabular-nums" value={hdmfLoan} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">SSS Loan</Label>
                <Input className="h-6 text-xs bg-gray-100 text-slate-600 px-1 text-right tabular-nums" value={sssLoan} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black font-semibold">El Bonita Loan</Label>
                <Input className="h-6 text-xs bg-gray-100 text-slate-600 px-1 text-right tabular-nums" value={elBonitaLoan} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">Cash Advance(CA)</Label>
                <Input className="h-6 text-xs bg-gray-100 text-slate-600 px-1 text-right tabular-nums" value={cashAdvance} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">EGG/CAR</Label>
                <Input className="h-6 text-xs bg-gray-100 text-slate-600 px-1 text-right tabular-nums" value={storeAcct} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">Uniform</Label>
                <Input className="h-6 text-xs bg-gray-100 text-slate-600 px-1 text-right tabular-nums" value={uniform} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">Safety shoes</Label>
                <Input className="h-6 text-xs bg-gray-100 text-slate-600 px-1 text-right tabular-nums" value={safetyShoes} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">Food Allowance</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={foodAllowance} onChange={(e) => setFoodAllowance(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black font-semibold">Pag-Ibig/Philhealth</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={pagIbigPhilhealth} onChange={(e) => setPagIbigPhilhealth(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">Rice CA</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={riceCa} onChange={(e) => setRiceCa(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">Rice</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={rice} onChange={(e) => setRice(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">CP Loan</Label>
                <Input className="h-6 text-xs bg-gray-100 text-slate-600 px-1 text-right tabular-nums" value={cpLoan} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">SSS Penalty</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={sssPenalty} onChange={(e) => setSssPenalty(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-1 items-center">
                <Label className="text-xs text-black">Motor URC</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={motorUrc} onChange={(e) => setMotorUrc(e.target.value)} />
              </div>

              <div className="flex gap-1">
                <Label className="text-xs text-black font-bold shrink-0">Total Deduction</Label>
                <div className="flex flex-1 gap-1 items-center">
                  <Button className="h-8 w-12 bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 text-xs font-bold" onClick={() => { recalcAbsent(); recalcLate(); recalcTotalDeduction(); }}>EXE</Button>
                  <Input className="h-8 flex-1 bg-gray-100 text-black font-bold text-right tabular-nums text-lg px-1" value={totalDeduction} readOnly />
                </div>
              </div>


            </div>
          </div>

          {/* Column 3 - Contributions and OT Rates */}
          <div className="bg-white space-y-[1px]">
            <div className="bg-white text-black">
              <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs tracking-wide border-b border-gray-300 text-black uppercase">
                Employee Contributions
              </div>
              <div className="p-2 space-y-1">
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">SSS</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={sssEmp} onChange={(e) => setSssEmp(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">PHIC</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={phicEmp} onChange={(e) => setPhicEmp(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">HDMF</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={hdmfEmp} onChange={(e) => setHdmfEmp(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">WTax</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={wtax} onChange={(e) => setWtax(e.target.value)} />
                </div>
                <div className="pt-1">
                  <div className="flex gap-1">
                    <Button className="h-7 w-12 bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 text-xs font-bold" onClick={recalcEmpContribution}>EXE</Button>
                    <Input className="h-7 flex-1 bg-gray-100 font-bold text-right tabular-nums text-black px-1 max-w-[320px] ml-auto" value={totalEmpContribution} readOnly />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white text-black border-t border-gray-200">
              <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs tracking-wide border-b border-gray-300 text-black uppercase">
                Employer Contributions
              </div>
              <div className="p-2 space-y-1">
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">SSS</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={sssEmployer} onChange={(e) => setSssEmployer(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">PHIC</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={phicEmployer} onChange={(e) => setPhicEmployer(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">HDMF</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={hdmfEmployer} onChange={(e) => setHdmfEmployer(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bg-white text-black border-t border-gray-200">
              <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs tracking-wide border-b border-gray-300 text-black uppercase">
                Overtime Rates Per Hour
              </div>
              <div className="p-2 space-y-1">
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OTRegDay</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[120px]" value={otRegDayAmount} readOnly />
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={otRegDayMult} onChange={(e) => setOtRegDayMult(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OTSunday</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[120px]" value={otSundayAmount} readOnly />
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={otSundayMult} onChange={(e) => setOtSundayMult(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OTSpecial</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[120px]" value={otSpecialAmount} readOnly />
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={otSpecialMult} onChange={(e) => setOtSpecialMult(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OTLegal</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[120px]" value={otLegalAmount} readOnly />
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[120px]" value={otLegalMult} onChange={(e) => setOtLegalMult(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OT ND</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[80px]" value={otNdAmount} readOnly />
                  <div className="flex gap-0.5">
                    <Input className="h-6 text-xs text-black px-1 flex-1 min-w-0 text-right tabular-nums w-[120px]" value={otNdMult1} onChange={(e) => setOtNdMult1(e.target.value)} placeholder="1.25" />
                    <Input className="h-6 text-xs text-black px-1 flex-1 min-w-0 text-right tabular-nums w-[120px]" value={otNdMult2} onChange={(e) => setOtNdMult2(e.target.value)} placeholder=".10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 bg-white border-t border-gray-200">
          {/* Left side: Calculate + Print */}
          <div className="flex items-center gap-2">
            <Button
              className="h-10 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-lg shadow-slate-200 transition-all active:scale-95"
              onClick={calculateNetPay}
            >
              CALCULATE NET PAY
            </Button>
            <Button
              variant="outline"
              className="h-9 w-10 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-black"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>

          {/* Right side: Net Income display */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-500 tracking-wide">NET INCOME</span>
            <div className="border border-gray-300 rounded-lg px-5 py-1.5 min-w-[160px] flex items-center justify-center bg-gray-50">
              <span className="text-[26px] leading-none font-extrabold tracking-tight tabular-nums text-red-600">
                {netPay}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
