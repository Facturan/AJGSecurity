import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Printer, Loader2, ChevronDown, Search, Calculator, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useHeader } from './components/Header';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';
import { useMasterData } from './MasterDataContext';

import { formatCurrency, formatWithCommas, parseCurrency } from './ui/formatters';
import { DatePicker } from './ui/date-picker';

function formatNumber(value: number, precision: number = 2): string {
  return value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: precision });
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
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  // Employee Info
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmpId, setSelectedEmpId] = useState<string>('');
  const [empName, setEmpName] = useState('');
  const [empIdNo, setEmpIdNo] = useState('');
  const [empDailyRate, setEmpDailyRate] = useState(0);
  const [empMonthlyRate, setEmpMonthlyRate] = useState(0);
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
  const [incentiveRate, setIncentiveRate] = useState('');
  const [incentiveAmount, setIncentiveAmount] = useState('');
  const [cashGasAllowance, setCashGasAllowance] = useState('');
  const [foodAllowanceIncome, setFoodAllowanceIncome] = useState('');
  const [loadAllowance, setLoadAllowance] = useState('');
  const [incentivesIncome, setIncentivesIncome] = useState('');
  const [commsIncome, setCommsIncome] = useState('');
  const [otRefund, setOtRefund] = useState('');
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
  const [pagIbigLoan, setPagIbigLoan] = useState('');
  const [riceCa, setRiceCa] = useState('');
  const [rice, setRice] = useState('');
  const [cpLoan, setCpLoan] = useState('');
  const [sssPenaltyJohndorf, setSssPenaltyJohndorf] = useState('');
  const [thailandCA, setThailandCA] = useState('');
  const [motorUrc, setMotorUrc] = useState('');
  const [chx, setChx] = useState('');
  const [flagXUniform, setFlagXUniform] = useState('');
  const [totalDeduction, setTotalDeduction] = useState('');
  const [activeLoans, setActiveLoans] = useState<any[]>([]);

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
    setHeaderInfo({ title: 'Payroll Data Entry', subtitle: 'Payroll Management', icon: Calculator, showSearch: false });
    fetchEmployees();
  }, [setHeaderInfo]);

  useEffect(() => {
    if (selectedEmpId) {
      if (salaryMethod === 'monthly') {
        setDailyRate(formatNumber(empMonthlyRate, 4));
      } else {
        setDailyRate(formatNumber(empDailyRate, 4));
      }
    }
  }, [salaryMethod, selectedEmpId, empDailyRate, empMonthlyRate]);

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

  // Sync input value when dropdown closes
  useEffect(() => {
    if (!open && selectedEmpId) {
      setSearchQuery(empName);
    }
  }, [open, selectedEmpId, empName]);

  useEffect(() => {
    fetchHistory();
  }, [selectedEmpId, dateFrom, dateTo, datePosting]);

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

  const fetchHistory = async () => {
    if (!selectedEmpId || !dateFrom || !dateTo || !datePosting) return;

    try {
      const { data, error } = await supabase
        .from('PAYROLLDATA')
        .select('*')
        .eq('EmpID', parseInt(selectedEmpId))
        .eq('DateFrom', dateFrom)
        .eq('DateTo', dateTo)
        .eq('DatePosting', datePosting)
        .order('PID', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      if (data) {
        // Income
        setSalaryMethod(data.SalaryMethod || 'daily');
        setDailyRate(formatNumber(data.DailyRate || 0, 4));
        setNoOfDays(String(data.NoOfDays || ''));
        setBasePay(formatNumber(data.BasicRate || 0));
        setOtRegDayHours(String(data.OTRegHrs || ''));
        setOtSundayHours(String(data.OTSunHrs || ''));
        setOtSpecialHours(String(data.OTSpecialHrs || ''));
        setOtLegalHours(String(data.OTLegalHrs || ''));
        setOtNdHours(String(data.OTNightDiffHrs || ''));

        // Holiday
        setSpecialHolidayHours(String(data.SpecHolHRS || ''));
        setSpecialHolidayMult(String(data.SpecHolMult || ''));
        setLegalHolidayHours(String(data.LegHolHRS || ''));
        setLegalHolidayMult(String(data.LegHolMult || ''));
        setSpecialHolidayAmount(formatNumber(data.TotalSpecialDay || 0));
        setLegalHolidayAmount(formatNumber(data.TotalLegalDay || 0));
        setTotalHoliday(formatNumber(data.TotalHoliday || 0));

        setAllowance(formatNumber(data.AllowanceRate || 0));
        setCashGasAllowance(formatNumber(data.CashGasAllowance || 0));
        setFoodAllowanceIncome(formatNumber(data.FoodAllowanceIncome || 0));
        setLoadAllowance(formatNumber(data.LoadAllowance || 0));
        setIncentivesIncome(formatNumber(data.IncentivesIncome || 0));
        setCommsIncome(String(data.CommsIncome || ''));
        setOtRefund(String(data.OTRefund || ''));
        setOuPay(String(data.OverUnderPay || ''));

        // OT Rates (Rates from DB)
        setOtRegDayAmount(formatNumber(data.OTRegDay || 0, 4));
        setOtSundayAmount(formatNumber(data.OTSunday || 0, 4));
        setOtSpecialAmount(formatNumber(data.OTSpecial || 0, 4));
        setOtLegalAmount(formatNumber(data.OTLegal || 0, 4));
        setOtNdAmount(formatNumber(data.OTND || 0, 4));

        // Deductions
        setAbsentDays(String(data.Absent || ''));
        setLateMinutes(String(data.Late || ''));
        setComms(formatNumber(data.GlobeExcess || 0));
        setMpl(formatNumber(data.MPL || 0));
        setHdmfLoan(formatNumber(data.HDMFLoan || 0));
        setSssLoan(formatNumber(data.SSSLoan || 0));
        setElBonitaLoan(formatNumber(data.ElBonitaLoan || 0));
        setCashAdvance(formatNumber(data.CashAdvance || 0));
        setStoreAcct(formatNumber(data.StoreAccount || 0));
        setUniform(formatNumber(data.Uniform || 0));
        setSafetyShoes(formatNumber(data.Shoes || 0));
        setFoodAllowance(formatNumber(data.TravelAllowance || 0));
        setPagIbigPhilhealth(formatNumber(data.PagIbigPhilhealth || 0));
        setPagIbigLoan(formatNumber(data.PagIbigLoan || 0));
        setRiceCa(formatNumber(data.RiceCA || 0));
        setRice(formatNumber(data.Rice || 0));
        setCpLoan(formatNumber(data.CPLoan || 0));
        setSssPenaltyJohndorf(formatNumber(data.SSSPenaltyJohndorf || 0));
        setThailandCA(formatNumber(data.ThailandCA || 0));
        setMotorUrc(formatNumber(data.MotorURC || 0));
        setChx(formatNumber(data.CHX || 0));
        setFlagXUniform(formatNumber(data.FlagXUniform || 0));

        // Contributions
        setSssEmp(formatNumber(data.EmpSSS || 0));
        setPhicEmp(formatNumber(data.PHIC || 0));
        setHdmfEmp(formatNumber(data.EmpHDMF || 0));
        setWtax(formatNumber(data.WTAX || 0));

        setSssEmployer(formatNumber(data.ComSSS || 0));
        setPhicEmployer(formatNumber(data.ComPHIC || 0));
        setHdmfEmployer(formatNumber(data.ComHDMF || 0));

        toast.info('Historical data found and populated.');
      }
    } catch (err: any) {
      console.error('Error fetching historical data:', err);
    }
  };

  const handleSelectEmployee = async (emplID: string) => {
    const emp = employees.find(e => e.EmplID.toString() === emplID);
    if (emp) {
      const fullName = `${emp.Fname} ${emp.LName}`.trim();
      setSelectedEmpId(emplID);
      setEmpIdNo(emp.idno);
      setEmpName(fullName);
      setSearchQuery(fullName);
      setEmpDailyRate(emp.DailyRate || 0);
      setEmpMonthlyRate(emp.MonthlyRate || 0);
      setSalaryMethod(emp.EmpRate?.toLowerCase() || 'daily');

      // Reset input fields for a fresh entry
      setNoOfDays('');
      setOtRegDayHours(''); setOtSundayHours(''); setOtSpecialHours(''); setOtLegalHours(''); setOtNdHours('');
      setSpecialHolidayHours(''); setLegalHolidayHours('');
      setCashGasAllowance(''); setFoodAllowanceIncome(''); setLoadAllowance('');
      setIncentivesIncome(''); setCommsIncome(''); setOtRefund('');
      setOuPay('');
      setAbsentDays(''); setLateMinutes('');


      // Populate Contributions
      setSssEmp(formatNumber(emp.MempSSS || 0));
      setPhicEmp(formatNumber(emp.MempPHIC || 0));
      setHdmfEmp(formatNumber(emp.MempHDMF || 0));

      setSssEmployer(formatNumber(emp.MComSSS || 0));
      setPhicEmployer(formatNumber(emp.MComPHIC || 0));
      setHdmfEmployer(formatNumber(emp.MComHDMF || 0));

      // Reset all deductions first
      setMpl(''); setHdmfLoan(''); setSssLoan(''); setElBonitaLoan('');
      setCpLoan(''); setCashAdvance(''); setStoreAcct(''); setUniform('');
      setSafetyShoes(''); setRiceCa(''); setRice(''); setSssPenaltyJohndorf('');
      setThailandCA(''); setMotorUrc(''); setChx(''); setFlagXUniform('');
      setPagIbigPhilhealth(''); setPagIbigLoan(''); setComms('');

      // Fetch active loans automatically
      try {
        console.log(`[Diagnostic] Fetching active loans for EmpID: ${emplID}`);
        const { data: loans, error } = await supabase
          .from('LOANS')
          .select('*')
          .eq('employeeId', parseInt(emplID))
          .eq('status', 'Active');

        if (error) {
          console.error('[Diagnostic] Error fetching loans:', error);
          throw error;
        }

        console.log(`[Diagnostic] Loans found for ${fullName}:`, loans);
        if (loans && loans.length > 0) {
          toast.info(`Loaded ${loans.length} active loans for ${fullName}`);
          setActiveLoans(loans);
          loans.forEach((loan: any) => {
            const rawType = (loan.loanType || '').toLowerCase();
            const lType = rawType.replace(/[^a-z0-9]/g, '');
            const amt = parseFloat(loan.biMonthlyPayment) || 0;
            if (amt <= 0) return;

            const formattedAmt = formatNumber(amt);

            if (lType.includes('mpl')) setMpl(formattedAmt);
            else if (lType.includes('hdmfloan')) setHdmfLoan(formattedAmt);
            else if (lType === 'pagibigloan') setPagIbigLoan(formattedAmt);
            else if (lType.includes('sssloan') || (lType.includes('sss') && !lType.includes('penalty'))) setSssLoan(formattedAmt);
            else if (lType.includes('elbonita')) setElBonitaLoan(formattedAmt);
            else if (lType.includes('cp') || lType.includes('office')) setCpLoan(formattedAmt);
            else if (lType.includes('cashadvance') || lType === 'ca') setCashAdvance(formattedAmt);
            else if (lType.includes('store') || lType.includes('egg') || lType.includes('car')) setStoreAcct(formattedAmt);
            else if (lType.includes('uniform') && !lType.includes('flagx')) setUniform(formattedAmt);
            else if (lType.includes('shoe')) setSafetyShoes(formattedAmt);
            else if (lType.includes('riceca')) setRiceCa(formattedAmt);
            else if (lType === 'rice') setRice(formattedAmt);
            else if (lType.includes('thailand')) setThailandCA(formattedAmt);
            else if (lType.includes('motor') || lType.includes('urc')) setMotorUrc(formattedAmt);
            else if (lType.includes('penalty') || lType.includes('johndorf')) setSssPenaltyJohndorf(formattedAmt);
            else if (lType.includes('chx')) setChx(formattedAmt);
            else if (lType.includes('flagx') || lType.includes('jersey')) setFlagXUniform(formattedAmt);
            else if (lType.includes('pagibigphilhealth') || lType.includes('pagibig') || lType.includes('philhealth')) setPagIbigPhilhealth(formattedAmt);
          });
        } else {
          console.log(`[Diagnostic] No active loans found for ${fullName}`);
          setActiveLoans([]);
        }
      } catch (err) {
        console.error('Error auto-filling loans:', err);
      }

      // Trigger a recalc if needed
      setTimeout(calculateNetPay, 100);
    }
  };

  const processLoanPayments = async (pPostingDate: string) => {
    if (!selectedEmpId) return;

    try {
      console.log('[Diagnostic] processLoanPayments: Starting fresh fetch for loans...');

      // Fetch fresh loans directly within the save process to avoid state race conditions
      const { data: loans, error: fetchError } = await supabase
        .from('LOANS')
        .select('*')
        .eq('employeeId', parseInt(selectedEmpId))
        .eq('status', 'Active');

      if (fetchError) throw fetchError;
      if (!loans || loans.length === 0) {
        console.log('[Diagnostic] No active loans found in DB for this employee.');
        return;
      }

      console.log(`[Diagnostic] Found ${loans.length} active loans for processing.`);

      // Map of deduction field values
      const deductions = {
        mpl: parseInput(mpl),
        hdmfloan: parseInput(hdmfLoan),
        pagibigloan: parseInput(pagIbigLoan),
        sssloan: parseInput(sssLoan),
        elbonitaloan: parseInput(elBonitaLoan),
        cploan: parseInput(cpLoan),
        cashadvance: parseInput(cashAdvance),
        storeaccount: parseInput(storeAcct),
        uniform: parseInput(uniform),
        shoes: parseInput(safetyShoes),
        riceca: parseInput(riceCa),
        rice: parseInput(rice),
        thailandca: parseInput(thailandCA),
        motorurc: parseInput(motorUrc),
        ssspenaltyjohndorf: parseInput(sssPenaltyJohndorf),
        chx: parseInput(chx),
        flagxuniform: parseInput(flagXUniform),
        pagibigphilhealth: parseInput(pagIbigPhilhealth)
      };

      const paymentRecords: any[] = [];

      loans.forEach(loan => {
        const rawType = (loan.loanType || '').toLowerCase();
        const lType = rawType.replace(/[^a-z0-9]/g, '');
        let matchedAmount = 0;

        if (lType.includes('mpl')) matchedAmount = deductions.mpl;
        else if (lType.includes('hdmfloan')) matchedAmount = deductions.hdmfloan;
        else if (lType === 'pagibigloan') matchedAmount = deductions.pagibigloan;
        else if (lType.includes('sssloan') || (lType.includes('sss') && !lType.includes('penalty'))) matchedAmount = deductions.sssloan;
        else if (lType.includes('elbonita')) matchedAmount = deductions.elbonitaloan;
        else if (lType.includes('cp') || lType.includes('office')) matchedAmount = deductions.cploan;
        else if (lType.includes('cashadvance') || lType === 'ca') matchedAmount = deductions.cashadvance;
        else if (lType.includes('store') || lType.includes('egg') || lType.includes('car')) matchedAmount = deductions.storeaccount;
        else if (lType.includes('uniform') && !lType.includes('flagx')) matchedAmount = deductions.uniform;
        else if (lType.includes('shoe')) matchedAmount = deductions.shoes;
        else if (lType.includes('riceca')) matchedAmount = deductions.riceca;
        else if (lType === 'rice') matchedAmount = deductions.rice;
        else if (lType.includes('thailand')) matchedAmount = deductions.thailandca;
        else if (lType.includes('motor') || lType.includes('urc')) matchedAmount = deductions.motorurc;
        else if (lType.includes('penalty') || lType.includes('johndorf')) matchedAmount = deductions.ssspenaltyjohndorf;
        else if (lType.includes('chx')) matchedAmount = deductions.chx;
        else if (lType.includes('flagx') || lType.includes('jersey')) matchedAmount = deductions.flagxuniform;
        else if (lType.includes('pagibigphilhealth') || lType.includes('pagibig') || lType.includes('philhealth')) matchedAmount = deductions.pagibigphilhealth;

        if (matchedAmount > 0) {
          console.log(`[Diagnostic] Success! Matched ${loan.loanType} (${loan.loanId}) with amount: ${matchedAmount}`);
          paymentRecords.push({
            loanId: loan.loanId,
            paymentDate: pPostingDate,
            paymentAmount: matchedAmount
          });
        }
      });

      if (paymentRecords.length > 0) {
        console.log('[Diagnostic] Final Step: Inserting to LOAN_PAYMENTS...', paymentRecords);
        const { error: insertError } = await supabase
          .from('LOAN_PAYMENTS')
          .insert(paymentRecords);

        if (insertError) throw insertError;

        console.log('[Diagnostic] Loan Ledger updated successfully.');
        toast.success(`Recorded ${paymentRecords.length} loan payment(s) to ledger.`);
      } else {
        console.log('[Diagnostic] No loan matches were found among entered deductions.');
      }
    } catch (err: any) {
      console.error('[Diagnostic] Loan Sync critical error:', err);
      toast.error(`Loan Ledger update failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSave = async () => {
    if (!selectedEmpId) {
      toast.error('Please select an employee');
      return;
    }
    if (!dateFrom || !dateTo) {
      toast.error('Please specify the payroll period (From/To dates)');
      return;
    }
    setShowSaveConfirm(true);
  };

  const confirmSave = async () => {
    setShowSaveConfirm(false);
    // Ensure all calculations are up to date before saving
    calculateNetPay();

    setIsSubmitting(true);
    try {
      // Duplicate detection: Check if record exists for this employee and period
      const { data: existing, error: checkError } = await supabase
        .from('PAYROLLDATA')
        .select('PID')
        .eq('EmpID', parseInt(selectedEmpId))
        .eq('DatePosting', datePosting)
        .eq('DateFrom', dateFrom || null)
        .eq('DateTo', dateTo || null)
        .maybeSingle();

      if (checkError) throw checkError;
      if (existing) {
        setShowDuplicateModal(true);
        setIsSubmitting(false);
        return;
      }

      const dbData = {
        EmpID: parseInt(selectedEmpId),
        EmpName: empName,
        SalaryMethod: salaryMethod,
        DateFrom: dateFrom || null,
        DateTo: dateTo || null,
        DatePosting: datePosting,
        DailyRate: parseInput(dailyRate),
        NoOfDays: parseInput(noOfDays),
        BasicRate: parseInput(basePay),

        // Overtime Hours
        OTRegHrs: parseInput(otRegDayHours),
        OTSunHrs: parseInput(otSundayHours),
        OTSpecialHrs: parseInput(otSpecialHours),
        OTLegalHrs: parseInput(otLegalHours),
        OTNightDiffHrs: parseInput(otNdHours),

        // Overtime Amounts
        TotalOTRegHrs: parseInput(otRegDayAmount) * parseInput(otRegDayHours),
        TotalOTSunHrs: parseInput(otSundayAmount) * parseInput(otSundayHours),
        TotalOTSpecialHrs: parseInput(otSpecialAmount) * parseInput(otSpecialHours),
        TotalOTLegalHrs: parseInput(otLegalAmount) * parseInput(otLegalHours),
        TotalOTNightDiffHrs: parseInput(otNdAmount) * parseInput(otNdHours),
        TotalOTPay: parseInput(totalOtPay),

        // Holiday
        TotalSpecialDay: parseInput(specialHolidayAmount),
        TotalLegalDay: parseInput(legalHolidayAmount),
        TotalHoliday: parseInput(totalHoliday),
        SpecHolHRS: parseInput(specialHolidayHours),
        SpecHolMult: parseInput(specialHolidayMult),
        LegHolHRS: parseInput(legalHolidayHours),
        LegHolMult: parseInput(legalHolidayMult),

        // Allowances and Income
        AllowanceRate: parseInput(allowance),
        TotalAllowance: parseInput(allowanceDisplay),
        FiveDaysIncentiveDays: parseInput(noOfDays),
        FiveDaysIncentiveAmount: parseInput(incentiveAmount),
        CashGasAllowance: parseInput(cashGasAllowance),
        FoodAllowanceIncome: parseInput(foodAllowanceIncome),
        LoadAllowance: parseInput(loadAllowance),
        IncentivesIncome: parseInput(incentivesIncome),
        CommsIncome: parseInput(commsIncome),
        OTRefund: parseInput(otRefund),
        OverUnderPay: parseInput(ouPay),
        TotalIncome: parseInput(totalIncome),

        // Deductions
        Absent: parseInput(absentDays),
        TotalAbsent: parseInput(absentAmount),
        Late: parseInput(lateMinutes),
        TotalLate: parseInput(lateAmount),
        GlobeExcess: parseInput(comms),
        MPL: parseInput(mpl),
        HDMFLoan: parseInput(hdmfLoan),
        SSSLoan: parseInput(sssLoan),
        ElBonitaLoan: parseInput(elBonitaLoan),
        CashAdvance: parseInput(cashAdvance),
        StoreAccount: parseInput(storeAcct),
        Uniform: parseInput(uniform),
        Shoes: parseInput(safetyShoes),
        TravelAllowance: parseInput(foodAllowance),
        PagIbigPhilhealth: parseInput(pagIbigPhilhealth),
        PagIbigLoan: parseInput(pagIbigLoan),
        RiceCA: parseInput(riceCa),
        Rice: parseInput(rice),
        CPLoan: parseInput(cpLoan),
        SSSPenaltyJohndorf: parseInput(sssPenaltyJohndorf),
        ThailandCA: parseInput(thailandCA),
        MotorURC: parseInput(motorUrc),
        CHX: parseInput(chx),
        FlagXUniform: parseInput(flagXUniform),
        TotalDeduc: parseInput(totalDeduction),

        // Employee Contributions
        EmpSSS: parseInput(sssEmp),
        PHIC: parseInput(phicEmp),
        EmpHDMF: parseInput(hdmfEmp),
        WTAX: parseInput(wtax),
        TotalEmpCont: parseInput(totalEmpContribution),

        // Employer Contributions
        ComSSS: parseInput(sssEmployer),
        ComPHIC: parseInput(phicEmployer),
        ComHDMF: parseInput(hdmfEmployer),

        // Rates
        OTRegDay: parseInput(otRegDayAmount),
        OTSunday: parseInput(otSundayAmount),
        OTSpecial: parseInput(otSpecialAmount),
        OTLegal: parseInput(otLegalAmount),
        OTND: parseInput(otNdAmount),

        NetPay: parseInput(netPay)
      };

      const { error } = await supabase
        .from('PAYROLLDATA')
        .insert([dbData]);

      if (error) throw error;

      // Update Loan Ledger automatically
      await processLoanPayments(datePosting);

      toast.success('Payroll saved and Loan Ledger updated successfully');
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
    setOpen(false);
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
    setAllowance(''); setAllowanceDisplay(''); setIncentiveRate(''); setIncentiveAmount('');
    setCashGasAllowance(''); setFoodAllowanceIncome(''); setLoadAllowance('');
    setIncentivesIncome(''); setCommsIncome(''); setOtRefund('');
    setOuPay(''); setTotalIncome('');
    // Deductions
    setAbsentDays(''); setAbsentAmount('');
    setLateMinutes(''); setLateAmount('');
    setComms(''); setMpl(''); setHdmfLoan(''); setSssLoan('');
    setElBonitaLoan(''); setCashAdvance(''); setStoreAcct('');
    setUniform(''); setSafetyShoes(''); setFoodAllowance('');
    setPagIbigPhilhealth(''); setPagIbigLoan(''); setRiceCa(''); setRice('');
    setCpLoan(''); setSssPenaltyJohndorf(''); setThailandCA(''); setMotorUrc(''); setChx(''); setFlagXUniform('');
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
    const hr = salaryMethod === 'monthly' ? (empDailyRate > 0 ? empDailyRate / 8 : (rate / 26) / 8) : rate / 8;
    const otReg = hr * parseInput(otRegDayMult);
    const otSun = hr * parseInput(otSundayMult);
    const otSpec = hr * parseInput(otSpecialMult);
    const otLeg = hr * parseInput(otLegalMult);
    const otNd = (hr * parseInput(otNdMult1)) * parseInput(otNdMult2);
    setOtRegDayAmount(formatNumber(otReg, 4));
    setOtSundayAmount(formatNumber(otSun, 4));
    setOtSpecialAmount(formatNumber(otSpec, 4));
    setOtLegalAmount(formatNumber(otLeg, 4));
    setOtNdAmount(formatNumber(otNd, 4));
  }, [dailyRate, otRegDayMult, otSundayMult, otSpecialMult, otLegalMult, otNdMult1, otNdMult2, salaryMethod, empDailyRate]);

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
    const dRate = parseInput(dailyRate);
    const actualDailyRate = salaryMethod === 'monthly' ? (empDailyRate > 0 ? empDailyRate : dRate / 26) : dRate;
    const hr = actualDailyRate / 8;
    const special = parseInput(specialHolidayMult) * parseInput(specialHolidayHours) * hr;
    const legal = parseInput(legalHolidayMult) * parseInput(legalHolidayHours) * hr;
    setSpecialHolidayAmount(formatNumber(special));
    setLegalHolidayAmount(formatNumber(legal));
    setTotalHoliday(formatNumber(special + legal));
  }, [dailyRate, specialHolidayMult, specialHolidayHours, legalHolidayMult, legalHolidayHours, salaryMethod, empDailyRate]);

  const recalcAllowance = useCallback(() => {
    setAllowanceDisplay(allowance);
  }, [allowance]);

  const recalcIncentive = useCallback(() => {
    const dRate = parseInput(dailyRate);
    const rate = (dRate * 5 / 12 / 31);
    const amt = rate * parseInput(noOfDays);
    setIncentiveAmount(formatNumber(amt));
    setIncentiveRate(formatNumber(rate));
  }, [dailyRate, noOfDays]);


  const recalcTotalIncome = useCallback(() => {
    const base = parseInput(basePay);
    const ot = parseInput(totalOtPay);
    const holiday = parseInput(totalHoliday);
    const allow = parseInput(allowanceDisplay);
    const incentive = parseInput(incentiveAmount);
    const cashGas = parseInput(cashGasAllowance);
    const food = parseInput(foodAllowanceIncome);
    const load = parseInput(loadAllowance);
    const incentivesInc = parseInput(incentivesIncome);
    const commsInc = parseInput(commsIncome);
    const refund = parseInput(otRefund);
    const ou = parseInput(ouPay);
    const total = base + ot + holiday + allow + incentive + cashGas + food + load + incentivesInc + commsInc + refund + ou;
    setTotalIncome(formatNumber(total));
  }, [basePay, totalOtPay, totalHoliday, allowanceDisplay, incentiveAmount, cashGasAllowance, foodAllowanceIncome, loadAllowance, incentivesIncome, commsIncome, otRefund, ouPay]);

  const recalcAbsent = useCallback(() => {
    const dRate = parseInput(dailyRate);
    const actualDailyRate = salaryMethod === 'monthly' ? (empDailyRate > 0 ? empDailyRate : dRate / 26) : dRate;
    const amt = parseInput(absentDays) * actualDailyRate;
    setAbsentAmount(formatNumber(amt));
  }, [absentDays, dailyRate, salaryMethod, empDailyRate]);

  const recalcLate = useCallback(() => {
    const dRate = parseInput(dailyRate);
    const actualDailyRate = salaryMethod === 'monthly' ? (empDailyRate > 0 ? empDailyRate : dRate / 26) : dRate;
    const amt = (parseInput(lateMinutes) / 60) * (actualDailyRate / 8);
    setLateAmount(formatNumber(amt));
  }, [lateMinutes, dailyRate, salaryMethod, empDailyRate]);

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
      parseInput(pagIbigLoan) +
      parseInput(pagIbigPhilhealth) +
      parseInput(riceCa) +
      parseInput(rice) +
      parseInput(cpLoan) +
      parseInput(sssPenaltyJohndorf) +
      parseInput(thailandCA) +
      parseInput(motorUrc) +
      parseInput(chx) +
      parseInput(flagXUniform);
    setTotalDeduction(formatNumber(total));
  }, [absentAmount, lateAmount, comms, mpl, hdmfLoan, sssLoan, elBonitaLoan, cashAdvance, storeAcct, uniform, safetyShoes, foodAllowance, pagIbigPhilhealth, riceCa, rice, cpLoan, sssPenaltyJohndorf, thailandCA, motorUrc, chx, flagXUniform]);

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
    recalcIncentive();
    recalcTotalIncome();
    recalcAbsent();
    recalcLate();
    recalcTotalDeduction();
    recalcEmpContribution();

    const dRate = parseInput(dailyRate);
    const actualDailyRate = salaryMethod === 'monthly' ? (empDailyRate > 0 ? empDailyRate : dRate / 26) : dRate;
    const hr = actualDailyRate / 8;

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

    const incentiveAmt = (dRate * parseInput(noOfDays) * 5 / 12 / 31);
    const income = base + totalOt + totalHol + parseInput(allowance) + incentiveAmt
      + parseInput(cashGasAllowance) + parseInput(foodAllowanceIncome) + parseInput(loadAllowance)
      + parseInput(incentivesIncome) + parseInput(commsIncome) + parseInput(otRefund)
      + parseInput(ouPay);

    const deduction =
      parseInput(absentDays) * actualDailyRate +
      (parseInput(lateMinutes) / 60) * hr +
      parseInput(comms) + parseInput(mpl) + parseInput(hdmfLoan) + parseInput(sssLoan) +
      parseInput(elBonitaLoan) +
      parseInput(cashAdvance) + parseInput(storeAcct) + parseInput(uniform) + parseInput(safetyShoes) +
      parseInput(foodAllowance) +
      parseInput(pagIbigLoan) +
      parseInput(pagIbigPhilhealth) +
      parseInput(riceCa) + parseInput(rice) + parseInput(cpLoan) + parseInput(sssPenaltyJohndorf) + parseInput(thailandCA) + parseInput(motorUrc) +
      parseInput(chx) + parseInput(flagXUniform);

    const contribution = parseInput(sssEmp) + parseInput(phicEmp) + parseInput(hdmfEmp) + parseInput(wtax);

    const net = income - deduction - contribution;
    setNetPay(formatNumber(Math.max(0, net)));
  }, [dailyRate, noOfDays, otRegDayMult, otRegDayHours, otSundayMult, otSundayHours, otSpecialMult, otSpecialHours,
    otLegalMult, otLegalHours, otNdMult1, otNdMult2, otNdHours, specialHolidayMult, specialHolidayHours, legalHolidayMult, legalHolidayHours,
    allowance, incentiveRate, cashGasAllowance, foodAllowanceIncome, loadAllowance, incentivesIncome, commsIncome, otRefund, ouPay,
    absentDays, lateMinutes, comms, mpl, hdmfLoan, sssLoan, elBonitaLoan, cashAdvance, storeAcct, uniform, safetyShoes, foodAllowance, pagIbigPhilhealth, riceCa, rice, cpLoan, sssPenaltyJohndorf, thailandCA, motorUrc, chx, flagXUniform,
    sssEmp, phicEmp, hdmfEmp, wtax, recalcBasePay, recalcOtRates, recalcOtAmounts, recalcHoliday, recalcAllowance, recalcIncentive, recalcTotalIncome, recalcAbsent, recalcLate, recalcTotalDeduction, recalcEmpContribution, salaryMethod, empDailyRate]);

  useEffect(() => {
    if (!selectedEmpId) {
      setNetPay('0.00');
      return;
    }
    calculateNetPay();
  }, [selectedEmpId, dailyRate, noOfDays, otRegDayMult, otRegDayHours, otSundayMult, otSundayHours, otSpecialMult, otSpecialHours,
    otLegalMult, otLegalHours, otNdMult1, otNdMult2, otNdHours, specialHolidayMult, specialHolidayHours, legalHolidayMult, legalHolidayHours,
    allowance, incentiveRate, cashGasAllowance, foodAllowanceIncome, loadAllowance, incentivesIncome, commsIncome, otRefund, ouPay,
    absentDays, lateMinutes, comms, mpl, hdmfLoan, sssLoan, elBonitaLoan, cashAdvance, storeAcct, uniform, safetyShoes, foodAllowance, pagIbigPhilhealth, riceCa, rice, cpLoan, sssPenaltyJohndorf, thailandCA, motorUrc, chx, flagXUniform,
    sssEmp, phicEmp, hdmfEmp, wtax, calculateNetPay]);


  return (
    <div className="w-full flex justify-center py-4 px-2">
      <div className="w-full max-w-[1180px] bg-card border border-[#E5E7EB] rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] overflow-hidden">
        {/* Top Section - Employee and Period Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-6 py-4 bg-white border-b border-[#E5E7EB]">
          <div className="space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-[80px_140px_160px_1fr] gap-2 items-start sm:items-center">
              <Label className="font-bold text-sm text-[#1C2B33]">ID No</Label>
              <Input className="h-8 bg-white border-black font-bold text-[#1C2B33]" value={empIdNo} readOnly />
              <Input className="h-8 text-left tabular-nums bg-white border-black font-bold text-[#1C2B33]" value={selectedEmpId || ''} readOnly />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[80px_308px_1fr] gap-2 items-start sm:items-center">
              <Label className="font-bold text-sm text-[#1C2B33]">Employee</Label>
              <div className="relative" ref={dropdownRef}>
                <div className="relative flex items-center w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    placeholder="Type name or ID..."
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (!open) setOpen(true);
                      if (selectedEmpId) {
                        setSelectedEmpId('');
                        setEmpIdNo('');
                        setEmpName('');
                      }
                    }}
                    onFocus={() => {
                      setOpen(true);
                      setSearchQuery('');
                    }}
                    className="h-8 w-full bg-card border border-black rounded-md pl-3 pr-8 text-[#1C2B33] font-bold text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 transition-all placeholder:font-normal placeholder:text-muted-foreground/50"
                  />
                  <ChevronDown
                    className={`absolute right-3 h-4 w-4 shrink-0 text-[#1C2B33] pointer-events-none transition-transform ${open ? 'rotate-180' : ''}`}
                  />
                </div>

                {/* Dropdown panel */}
                {open && (
                  <div className="absolute z-50 mt-1 w-full bg-card border border-[#E5E7EB] rounded-md shadow-2xl overflow-hidden backdrop-blur-xl">
                    {/* Results list */}
                    <div className="max-h-[260px] overflow-y-auto">
                      {employees
                        .filter(emp =>
                          !searchQuery ||
                          `${emp.LName} ${emp.Fname} ${emp.EmplID} ${emp.idno}`.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .length === 0 ? (
                        <div className="px-3 py-4 text-center text-sm text-[#1C2B33]">No employee found.</div>
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
                              className={`w-full flex flex-col items-start px-3 py-2 text-left hover:bg-muted transition-colors border-b border-[#E5E7EB]/50 last:border-0 ${selectedEmpId === emp.EmplID.toString() ? 'bg-muted' : ''
                                }`}
                            >
                              <span className="font-bold text-sm text-[#1C2B33]">{emp.Fname} {emp.LName}</span>
                              <div className="flex items-center gap-2 text-[10px] text-[#1C2B33] mt-0.5">
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
              <Label className="font-bold text-sm text-[#1C2B33]">Method</Label>
              <Select value={salaryMethod} onValueChange={setSalaryMethod}>
                <SelectTrigger className="h-8 text-[#1C2B33] bg-card border-black">
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
              <Label className="font-bold text-sm text-[#1C2B33]">Posting</Label>
              <DatePicker
                value={datePosting}
                onChange={setDatePosting}
                className="h-8 border-black shadow-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[110px_1fr_40px_1fr] gap-2 items-start sm:items-center">
              <Label className="font-bold text-sm text-[#1C2B33]">From</Label>
              <DatePicker
                value={dateFrom}
                onChange={setDateFrom}
                className="h-8 border-black shadow-none"
              />
              <Label className="font-bold text-sm sm:text-right text-[#1C2B33]">To:</Label>
              <DatePicker
                value={dateTo}
                onChange={setDateTo}
                className="h-8 border-black shadow-none"
              />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] p-[1px] border-t border-black bg-border/50">
          {/* Column 1 - Income */}
          <div className="bg-card text-[#1C2B33] shadow-sm border-r border-black">
            <div className="bg-white px-3 py-2 font-bold text-sm tracking-wide border-b border-black text-[#1C2B33] uppercase">
              Income
            </div>
            <div className="p-3 space-y-2">
              {/* Daily Rate / No of Days - labels inline with inputs */}
              <div className="grid grid-cols-[auto_1fr_auto_1fr] gap-x-3 gap-y-1 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33] whitespace-nowrap">{salaryMethod === 'monthly' ? 'Monthly Rate' : 'Daily Rate'}</Label>
                <Input
                  className="h-7 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md text-[#1C2B33]"
                  value={dailyRate}
                  onChange={(e) => setDailyRate(formatWithCommas(e.target.value))}
                  onBlur={(e) => setDailyRate(formatCurrency(e.target.value))}
                />
                <Label className="text-[11px] font-bold text-[#1C2B33]">No of Days</Label>
                <Input
                  className="h-7 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md text-[#1C2B33]"
                  value={noOfDays}
                  onChange={(e) => setNoOfDays(formatWithCommas(e.target.value))}
                />
              </div>

              {/* Base pay - label | read-only input */}
              <div className="grid grid-cols-[50px_1fr] gap-2 items-center py-0.5">
                <Label className="text-[12px] font-bold text-black">AMOUNT</Label>
                <Input
                  className="h-8 bg-white font-black text-right tabular-nums text-black px-2 w-full border-black"
                  value={basePay}
                  readOnly
                />
              </div>

              {/* 5 Days Incentive and Total - above OT rows */}
              <div className="grid grid-cols-[110px_1fr_70px_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">5 Days Incentive</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-muted/20"
                  value={incentiveRate}
                  readOnly
                />
                <Input
                  className="h-6 text-xs bg-white font-black text-[#1C2B33] px-2 text-right tabular-nums border-black"
                  value={incentiveAmount}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[50px_1fr] gap-2 items-center pt-1 mt-1">
                <Label className="text-[11px] font-black text-black uppercase tracking-wide">Total</Label>
                <Input
                  className="h-7 text-xs bg-white font-black text-black px-2 text-right tabular-nums border-black"
                  value={formatNumber(parseInput(basePay) + parseInput(incentiveAmount))}
                  readOnly
                />
              </div>

              {/* OT rows - label | hours input | amount read-only */}
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">OT Reg Day</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={otRegDayHours}
                  onChange={(e) => setOtRegDayHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-white font-black text-[#1C2B33] px-2 text-right tabular-nums border-black"
                  value={otRegDayHours ? otRegDayAmount : ''}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">OT Sunday</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={otSundayHours}
                  onChange={(e) => setOtSundayHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-white font-black text-[#1C2B33] px-2 text-right tabular-nums border-black"
                  value={otSundayHours ? otSundayAmount : ''}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">OT Special</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={otSpecialHours}
                  onChange={(e) => setOtSpecialHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-white font-black text-[#1C2B33] px-2 text-right tabular-nums border-black"
                  value={otSpecialHours ? otSpecialAmount : ''}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">OT Legal</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={otLegalHours}
                  onChange={(e) => setOtLegalHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-white font-black text-[#1C2B33] px-2 text-right tabular-nums border-black"
                  value={otLegalHours ? otLegalAmount : ''}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[120px_1fr_90px_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">OT ND</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={otNdHours}
                  onChange={(e) => setOtNdHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-white font-black text-[#1C2B33] px-2 text-right tabular-nums border-black"
                  value={otNdHours ? otNdAmount : ''}
                  readOnly
                />
              </div>

              {/* Total OT - EXE button | bold amount */}
              <div className="flex gap-2 items-center py-0.5">
                <Button
                  className="h-7 w-12 bg-[#0082FB] hover:bg-[#0064E0] text-white border-none rounded-md text-[10px] font-black shrink-0"
                  onClick={() => {
                    recalcOtRates();
                    recalcOtAmounts();
                  }}
                >
                  EXE
                </Button>
                <Input
                  className="h-7 flex-1 bg-white font-black text-right tabular-nums text-[#1C2B33] px-2 border-black"
                  value={totalOtPay}
                  readOnly
                />
              </div>

              {/* Holiday rows - label | mult input | hours input | amount read-only */}
              <div className="grid grid-cols-[70px_1fr_70px_70px_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">Special/hr</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums border-black bg-white rounded-md"
                  value={specialHolidayMult}
                  onChange={(e) => setSpecialHolidayMult(e.target.value)}
                />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums border-black bg-white rounded-md"
                  value={specialHolidayHours}
                  onChange={(e) => setSpecialHolidayHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-white font-black text-[#1C2B33] px-2 text-right tabular-nums border-black"
                  value={specialHolidayAmount}
                  readOnly
                />
              </div>
              <div className="grid grid-cols-[70px_1fr_70px_70px_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">Legal/hr</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums border-black bg-white rounded-md"
                  value={legalHolidayMult}
                  onChange={(e) => setLegalHolidayMult(e.target.value)}
                />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums border-black bg-white rounded-md"
                  value={legalHolidayHours}
                  onChange={(e) => setLegalHolidayHours(e.target.value)}
                />
                <Input
                  className="h-6 text-xs bg-white font-black text-[#1C2B33] px-2 text-right tabular-nums border-black"
                  value={legalHolidayAmount}
                  readOnly
                />
              </div>

              {/* Total Holiday - label | EXE | amount */}
              <div className="flex gap-2 items-center py-0.5">
                <Label className="text-[10px] font-black text-[#1C2B33] uppercase tracking-widest shrink-0">Total Holiday</Label>
                <div className="flex-1 flex gap-2 justify-end">
                  <Button
                    className="h-7 w-12 shrink-0 bg-[#0082FB] hover:bg-[#0064E0] text-white border-none rounded-md text-[10px] font-black"
                    onClick={recalcHoliday}
                  >
                    EXE
                  </Button>
                  <Input
                    className="h-7 flex-1 bg-white font-black text-right tabular-nums text-[#1C2B33] px-2 border-black"
                    value={totalHoliday}
                    readOnly
                  />
                </div>
              </div>
              {/* Additional Allowance Fields */}
              <div className="grid grid-cols-[110px_1fr_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">Cash/Gas Allowance</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={cashGasAllowance}
                  onChange={(e) => setCashGasAllowance(formatWithCommas(e.target.value))}
                  onBlur={(e) => setCashGasAllowance(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[110px_1fr_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">Food Allowance</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={foodAllowanceIncome}
                  onChange={(e) => setFoodAllowanceIncome(formatWithCommas(e.target.value))}
                  onBlur={(e) => setFoodAllowanceIncome(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[110px_1fr_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">Load Allowance</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={loadAllowance}
                  onChange={(e) => setLoadAllowance(formatWithCommas(e.target.value))}
                  onBlur={(e) => setLoadAllowance(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[110px_1fr_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">Incentives</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={incentivesIncome}
                  onChange={(e) => setIncentivesIncome(formatWithCommas(e.target.value))}
                  onBlur={(e) => setIncentivesIncome(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[110px_1fr_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">COMMS</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={commsIncome}
                  onChange={(e) => setCommsIncome(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-[110px_1fr_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">OT Refund</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={otRefund}
                  onChange={(e) => setOtRefund(e.target.value)}
                />
              </div>


              <div className="grid grid-cols-[70px_1fr_100px] gap-2 items-center">
                <Label className="text-[11px] font-bold text-[#1C2B33]">O/U Pay</Label>
                <div />
                <Input
                  className="h-6 text-xs text-[#1C2B33] font-bold px-2 text-right tabular-nums border-black bg-white rounded-md"
                  value={ouPay}
                  onChange={(e) => setOuPay(e.target.value)}
                />
              </div>

              { }
              <div className="flex gap-2 items-center pt-1 border-black mt-2">
                <Label className="text-[10px] font-black text-[#1C2B33] uppercase tracking-widest shrink-0">Gross Income</Label>
                <Button
                  className="h-8 w-12 shrink-0 bg-[#0082FB] hover:bg-[#0064E0] text-white border-none rounded-md text-[10px] font-black"
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
                  className="h-9 flex-1 bg-white text-[#1C2B33] font-black text-right tabular-nums text-lg px-2 border-black"
                  value={totalIncome}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Column 2 - Deductions */}
          <div className="bg-card text-[#1C2B33] border-r border-black">
            <div className="bg-white px-3 py-2 font-bold text-sm tracking-wide border-b border-black text-[#1C2B33] uppercase">
              Deductions
            </div>
            <div className="p-2 space-y-2">
              <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-[#1C2B33]">Absent (Days)</Label>
                <Input className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md" value={absentDays} onChange={(e) => setAbsentDays(e.target.value)} />
                <Input className="h-6 text-xs bg-white text-right tabular-nums font-black text-[#1C2B33] px-1 border-black" value={absentAmount} onChange={(e) => setAbsentAmount(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_120px_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">Late (Minutes)</Label>
                <Input className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md" value={lateMinutes} onChange={(e) => setLateMinutes(e.target.value)} />
                <Input className="h-6 text-xs bg-white text-right tabular-nums font-black text-[#1C2B33] px-1 border-black" value={lateAmount} onChange={(e) => setLateAmount(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-black text-black">Pag-Ibig Loan</Label>
                <Input
                  className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md"
                  value={pagIbigLoan}
                  onChange={(e) => setPagIbigLoan(formatWithCommas(e.target.value))}
                  onBlur={(e) => setPagIbigLoan(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-black text-black">Pag-Ibig/Philhealth</Label>
                <Input
                  className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md"
                  value={pagIbigPhilhealth}
                  onChange={(e) => setPagIbigPhilhealth(formatWithCommas(e.target.value))}
                  onBlur={(e) => setPagIbigPhilhealth(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">MPL(Pag-ibig Loan)</Label>
                <Input
                  className="h-6 text-xs bg-white text-black font-bold px-1 text-right tabular-nums border-black"
                  value={mpl}
                  onChange={(e) => setMpl(formatWithCommas(e.target.value))}
                  onBlur={(e) => setMpl(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">CP Office Loan</Label>
                <Input
                  className="h-6 text-xs bg-white text-black font-bold px-1 text-right tabular-nums border-black"
                  value={cpLoan}
                  onChange={(e) => setCpLoan(formatWithCommas(e.target.value))}
                  onBlur={(e) => setCpLoan(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-black text-black">El Bonita Loan</Label>
                <Input
                  className="h-6 text-xs bg-white text-black font-bold px-1 text-right tabular-nums border-black"
                  value={elBonitaLoan}
                  onChange={(e) => setElBonitaLoan(formatWithCommas(e.target.value))}
                  onBlur={(e) => setElBonitaLoan(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">HDMF Loan(Pag-ibig Loan)</Label>
                <Input
                  className="h-6 text-xs bg-white text-black font-bold px-1 text-right tabular-nums border-black"
                  value={hdmfLoan}
                  onChange={(e) => setHdmfLoan(formatWithCommas(e.target.value))}
                  onBlur={(e) => setHdmfLoan(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">SSS Loan</Label>
                <Input
                  className="h-6 text-xs bg-white text-black font-bold px-1 text-right tabular-nums border-black"
                  value={sssLoan}
                  onChange={(e) => setSssLoan(formatWithCommas(e.target.value))}
                  onBlur={(e) => setSssLoan(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">SSS Penalty Johndorf</Label>
                <Input className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md" value={sssPenaltyJohndorf} onChange={(e) => setSssPenaltyJohndorf(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">Cash Advance(CA)</Label>
                <Input
                  className="h-6 text-xs bg-white text-black font-bold px-1 text-right tabular-nums border-black"
                  value={cashAdvance}
                  onChange={(e) => setCashAdvance(formatWithCommas(e.target.value))}
                  onBlur={(e) => setCashAdvance(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">EGG/CAR</Label>
                <Input
                  className="h-6 text-xs bg-white text-black font-bold px-1 text-right tabular-nums border-black"
                  value={storeAcct}
                  onChange={(e) => setStoreAcct(formatWithCommas(e.target.value))}
                  onBlur={(e) => setStoreAcct(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">Uniform P.O</Label>
                <Input
                  className="h-6 text-xs bg-white text-black font-bold px-1 text-right tabular-nums border-black"
                  value={uniform}
                  onChange={(e) => setUniform(formatWithCommas(e.target.value))}
                  onBlur={(e) => setUniform(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">CHX</Label>
                <Input
                  className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md"
                  value={chx}
                  onChange={(e) => setChx(formatWithCommas(e.target.value))}
                  onBlur={(e) => setChx(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">Flag X Uniform/Jersey</Label>
                <Input
                  className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md"
                  value={flagXUniform}
                  onChange={(e) => setFlagXUniform(formatWithCommas(e.target.value))}
                  onBlur={(e) => setFlagXUniform(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">Safety shoes</Label>
                <Input
                  className="h-6 text-xs bg-white text-black font-bold px-1 text-right tabular-nums border-black"
                  value={safetyShoes}
                  onChange={(e) => setSafetyShoes(formatWithCommas(e.target.value))}
                  onBlur={(e) => setSafetyShoes(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">Rice CA</Label>
                <Input
                  className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md"
                  value={riceCa}
                  onChange={(e) => setRiceCa(formatWithCommas(e.target.value))}
                  onBlur={(e) => setRiceCa(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">Rice</Label>
                <Input
                  className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md"
                  value={rice}
                  onChange={(e) => setRice(formatWithCommas(e.target.value))}
                  onBlur={(e) => setRice(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">Thailand (C.A)</Label>
                <Input
                  className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md"
                  value={thailandCA}
                  onChange={(e) => setThailandCA(formatWithCommas(e.target.value))}
                  onBlur={(e) => setThailandCA(formatCurrency(e.target.value))}
                />
              </div>
              <div className="grid grid-cols-[1fr_120px] gap-3 items-center">
                <Label className="text-xs font-bold text-black">Motor URC</Label>
                <Input
                  className="h-6 text-xs text-black font-bold px-1 text-right tabular-nums bg-white border-black rounded-md"
                  value={motorUrc}
                  onChange={(e) => setMotorUrc(formatWithCommas(e.target.value))}
                  onBlur={(e) => setMotorUrc(formatCurrency(e.target.value))}
                />
              </div>

              <div className="flex gap-2 items-center pt-1 border-black mt-2">
                <Label className="text-[10px] font-black text-black uppercase tracking-widest shrink-0">Total Deduction</Label>
                <div className="flex flex-1 gap-1 items-center">
                  <Button className="h-8 w-12 bg-[#0082FB] hover:bg-[#0064E0] text-white border-none text-[10px] font-black" onClick={() => { recalcAbsent(); recalcLate(); recalcTotalDeduction(); }}>EXE</Button>
                  <Input className="h-8 flex-1 bg-white text-black font-black text-right tabular-nums text-lg px-2 border-black" value={totalDeduction} readOnly />
                </div>
              </div>


            </div>
          </div>

          {/* Column 3 - Contributions and OT Rates */}
          <div className="bg-white space-y-[1px]">
            <div className="bg-card text-[#1C2B33]">
              <div className="bg-white px-3 py-2 font-bold text-sm tracking-wide border-b border-black text-[#1C2B33] uppercase">
                Employee Contributions
              </div>
              <div className="p-2 space-y-2">
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs font-bold text-[#1C2B33]">SSS</Label>
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[120px] bg-white border-black rounded-md" value={sssEmp} readOnly />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs font-bold text-[#1C2B33]">PHIC</Label>
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[120px] bg-white border-black rounded-md" value={phicEmp} readOnly />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs font-bold text-[#1C2B33]">HDMF</Label>
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[120px] bg-white border-black rounded-md" value={hdmfEmp} readOnly />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs font-bold text-[#1C2B33]">WTax</Label>
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[120px] bg-white border-black rounded-md" value={wtax} readOnly />
                </div>
                <div className="pt-1">
                  <div className="flex gap-1">
                    <Button className="h-7 w-12 bg-[#0082FB] hover:bg-[#0064E0] text-white border-none text-[10px] font-black" onClick={recalcEmpContribution}>EXE</Button>
                    <Input className="h-7 flex-1 bg-white font-black text-right tabular-nums text-[#1C2B33] px-2 border-black" value={totalEmpContribution} readOnly />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card text-[#1C2B33]">
              <div className="bg-white px-3 py-2 font-bold text-sm tracking-wide border-t border-b border-black text-[#1C2B33] uppercase">
                Employer Contributions
              </div>
              <div className="p-2 space-y-2">
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs font-bold text-[#1C2B33]">SSS</Label>
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[120px] bg-white border-black rounded-md" value={sssEmployer} readOnly />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs font-bold text-[#1C2B33]">PHIC</Label>
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[120px] bg-white border-black rounded-md" value={phicEmployer} readOnly />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs font-bold text-[#1C2B33]">HDMF</Label>
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[120px] bg-white border-black rounded-md" value={hdmfEmployer} readOnly />
                </div>
              </div>
            </div>

            <div className="bg-card text-[#1C2B33]">
              <div className="bg-white px-3 py-2 font-bold text-sm tracking-wide border-t border-b border-black text-[#1C2B33] uppercase">
                Overtime Rates Per Hour
              </div>
              <div className="p-2 space-y-2">
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-[11px] font-bold text-[#1C2B33]">OTRegDay</Label>
                  <Input className="h-6 text-xs bg-white text-right tabular-nums text-[#1C2B33] font-bold px-1 w-[100px] border-black" value={otRegDayAmount} readOnly />
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[60px] bg-white border-black rounded-md" value={otRegDayMult} readOnly />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-[11px] font-bold text-[#1C2B33]">OTSunday</Label>
                  <Input className="h-6 text-xs bg-white text-right tabular-nums text-[#1C2B33] font-bold px-1 w-[100px] border-black" value={otSundayAmount} readOnly />
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[60px] bg-white border-black rounded-md" value={otSundayMult} readOnly />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-[11px] font-bold text-[#1C2B33]">OTSpecial</Label>
                  <Input className="h-6 text-xs bg-white text-right tabular-nums text-[#1C2B33] font-bold px-1 w-[100px] border-black" value={otSpecialAmount} readOnly />
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[60px] bg-white border-black rounded-md" value={otSpecialMult} readOnly />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-[11px] font-bold text-[#1C2B33]">OTLegal</Label>
                  <Input className="h-6 text-xs bg-white text-right tabular-nums text-[#1C2B33] font-bold px-1 w-[100px] border-black" value={otLegalAmount} readOnly />
                  <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 text-right tabular-nums w-[60px] bg-white border-black rounded-md" value={otLegalMult} readOnly />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-[11px] font-bold text-[#1C2B33]">OT ND</Label>
                  <Input className="h-6 text-xs bg-white text-right tabular-nums text-[#1C2B33] font-bold px-1 w-[60px] border-black" value={otNdAmount} readOnly />
                  <div className="flex gap-0.5">
                    <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 flex-1 min-w-0 text-right tabular-nums w-[50px] bg-white border-black rounded-md" value={otNdMult1} readOnly />
                    <Input className="h-6 text-xs text-[#1C2B33] font-bold px-1 flex-1 min-w-0 text-right tabular-nums w-[50px] bg-white border-black rounded-md" value={otNdMult2} readOnly />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 gap-4 bg-muted/10 border-t border-black">
          {/* Left side: Calculate + Print */}
          <div className="flex items-center gap-2">
            <Button
              className="h-10 px-6 bg-[#0082FB] hover:bg-[#0064E0] text-white font-black rounded-lg shadow-lg shadow-[#0082FB]/20 transition-all active:scale-95"
              onClick={calculateNetPay}
            >
              CALCULATE NET PAY
            </Button>
            <Button
              className="h-10 px-6 bg-[#10B981] hover:bg-[#059669] text-white font-black rounded-lg shadow-lg shadow-[#10B981]/20 transition-all active:scale-95 disabled:opacity-50"
              onClick={handleSave}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  SAVING...
                </div>
              ) : (
                'SAVE'
              )}
            </Button>
            <Button
              variant="outline"
              className="h-10 w-10 flex items-center justify-center bg-card hover:bg-muted border border-black rounded-lg text-[#1C2B33]"
            >
              <Printer className="w-4 h-4" />
            </Button>
          </div>

          {/* Right side: Net Income display */}
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-black text-[#1C2B33] lg:tracking-[0.2em] uppercase">Net Income</span>
            <div className="border border-black rounded-lg px-6 py-2 min-w-[200px] flex items-center justify-center bg-white">
              <span className="text-3xl leading-none font-black tracking-tighter tabular-nums text-red-500">
                {netPay}
              </span>
            </div>
          </div>
        </div>


        {/* Save Confirmation Modal */}
        <AnimatePresence>
          {showSaveConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl border border-border w-full max-w-md overflow-hidden"
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                    <Calculator className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-black text-slate-950 mb-2">Save Payroll?</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    Are you sure you want to save this payroll data for <span className="font-bold text-slate-950">{empName}</span>?
                  </p>
                </div>
                <div className="bg-slate-50 p-4 flex gap-3 justify-center border-t border-slate-100">
                  <Button
                    variant="outline"
                    onClick={() => setShowSaveConfirm(false)}
                    className="flex-1 font-bold border-black hover:bg-slate-100"
                  >
                    NO
                  </Button>
                  <Button
                    onClick={confirmSave}
                    className="flex-1 bg-slate-950 hover:bg-slate-800 text-white font-black transition-all active:scale-95 shadow-lg shadow-slate-950/20"
                  >
                    YES
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Duplicate Data Modal */}
        <AnimatePresence>
          {showDuplicateModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-2xl border border-border w-full max-w-md overflow-hidden"
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-black text-slate-950 mb-2">Already Exists</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                    Payroll data for this employee and period already exists.
                  </p>
                </div>
                <div className="bg-slate-50 p-4 flex justify-center border-t border-slate-100">
                  <Button
                    onClick={() => setShowDuplicateModal(false)}
                    className="bg-slate-950 hover:bg-slate-800 text-white font-black px-10 rounded-lg transition-all active:scale-95 shadow-lg shadow-slate-950/20"
                  >
                    OKAY, GOT IT
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
