import React, { useState, useEffect, useCallback } from 'react';
import { Printer } from 'lucide-react';
import { useHeader } from './components/Header';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

function formatNumber(value: number): string {
  return value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseInput(value: string): number {
  const cleaned = value.replace(/,/g, '').trim();
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function PayrollEntry() {
  const { setHeaderInfo } = useHeader();
  const [netPay, setNetPay] = useState('0.00');

  // Income
  const [dailyRate, setDailyRate] = useState('318.00');
  const [noOfDays, setNoOfDays] = useState('6.00');
  const [basePay, setBasePay] = useState('1,908.00');
  const [otRegDayHours, setOtRegDayHours] = useState('1.00');
  const [otRegDayAmount, setOtRegDayAmount] = useState('49.69');
  const [otSundayHours, setOtSundayHours] = useState('1.00');
  const [otSundayAmount, setOtSundayAmount] = useState('51.68');
  const [otSpecialHours, setOtSpecialHours] = useState('1.00');
  const [otSpecialAmount, setOtSpecialAmount] = useState('51.68');
  const [otLegalHours, setOtLegalHours] = useState('1.00');
  const [otLegalAmount, setOtLegalAmount] = useState('79.50');
  const [otNdHours, setOtNdHours] = useState('1.00');
  const [otNdAmount, setOtNdAmount] = useState('4.97');
  const [totalOtPay, setTotalOtPay] = useState('237.52');
  const [specialHolidayMult, setSpecialHolidayMult] = useState('2.0');
  const [specialHolidayHours, setSpecialHolidayHours] = useState('16.0');
  const [specialHolidayAmount, setSpecialHolidayAmount] = useState('190.88');
  const [legalHolidayMult, setLegalHolidayMult] = useState('1.0');
  const [legalHolidayHours, setLegalHolidayHours] = useState('8.0');
  const [legalHolidayAmount, setLegalHolidayAmount] = useState('318.00');
  const [totalHoliday, setTotalHoliday] = useState('508.88');
  const [allowance, setAllowance] = useState('100.00');
  const [allowanceDisplay, setAllowanceDisplay] = useState('597.92');
  const [ouPay, setOuPay] = useState('100.00');
  const [totalIncome, setTotalIncome] = useState('3,352.32');

  // Deductions
  const [absentDays, setAbsentDays] = useState('2.00');
  const [absentAmount, setAbsentAmount] = useState('636.00');
  const [lateMinutes, setLateMinutes] = useState('10.00');
  const [lateAmount, setLateAmount] = useState('6.63');
  const [globeExcess, setGlobeExcess] = useState('10.00');
  const [mpl, setMpl] = useState('10.00');
  const [hdmfLoan, setHdmfLoan] = useState('10.00');
  const [sssLoan, setSssLoan] = useState('10.00');
  const [cashAdvance, setCashAdvance] = useState('10.00');
  const [storeAcct, setStoreAcct] = useState('10.00');
  const [uniform, setUniform] = useState('10.00');
  const [safetyShoes, setSafetyShoes] = useState('10.00');
  const [taAllowance, setTaAllowance] = useState('10.00');
  const [otherDeduc, setOtherDeduc] = useState('10.00');
  const [totalDeduction, setTotalDeduction] = useState('782.63');

  // Employee Contribution
  const [sssEmp, setSssEmp] = useState('10.00');
  const [phicEmp, setPhicEmp] = useState('10.00');
  const [hdmfEmp, setHdmfEmp] = useState('10.00');
  const [wtax, setWtax] = useState('10.00');
  const [totalEmpContribution, setTotalEmpContribution] = useState('40.00');

  // Employer Contribution
  const [sssEmployer, setSssEmployer] = useState('10.00');
  const [phicEmployer, setPhicEmployer] = useState('10.00');
  const [hdmfEmployer, setHdmfEmployer] = useState('10.00');

  // OT Rate multipliers (from Master Data - can be made configurable later)
  const [otRegDayMult, setOtRegDayMult] = useState('1.25');
  const [otSundayMult, setOtSundayMult] = useState('1.30');
  const [otSpecialMult, setOtSpecialMult] = useState('1.30');
  const [otLegalMult, setOtLegalMult] = useState('2.00');
  const [otNdMult1, setOtNdMult1] = useState('1.25');
  const [otNdMult2, setOtNdMult2] = useState('0.10');

  useEffect(() => {
    setHeaderInfo({ title: 'PAYROLL', subtitle: 'Payroll Management', searchPlaceholder: 'Search employee...' });
  }, []);

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
    const otNd = hr * parseInput(otNdMult1) * parseInput(otNdMult2); // Night diff: base × OT mult × ND mult
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

  useEffect(() => {
    calculateNetPay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      parseInput(globeExcess) +
      parseInput(mpl) +
      parseInput(hdmfLoan) +
      parseInput(sssLoan) +
      parseInput(cashAdvance) +
      parseInput(storeAcct) +
      parseInput(uniform) +
      parseInput(safetyShoes) +
      parseInput(taAllowance) +
      parseInput(otherDeduc);
    setTotalDeduction(formatNumber(total));
  }, [absentAmount, lateAmount, globeExcess, mpl, hdmfLoan, sssLoan, cashAdvance, storeAcct, uniform, safetyShoes, taAllowance, otherDeduc]);

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

    const income = parseInput(dailyRate) * parseInput(noOfDays) +
      parseInput(otRegDayAmount) * parseInput(otRegDayHours) +
      parseInput(otSundayAmount) * parseInput(otSundayHours) +
      parseInput(otSpecialAmount) * parseInput(otSpecialHours) +
      parseInput(otLegalAmount) * parseInput(otLegalHours) +
      parseInput(otNdAmount) * parseInput(otNdHours) +
      (parseInput(dailyRate) / 8) * (parseInput(specialHolidayMult) * parseInput(specialHolidayHours) + parseInput(legalHolidayMult) * parseInput(legalHolidayHours)) +
      parseInput(allowance) +
      parseInput(ouPay);

    const deduction =
      parseInput(absentDays) * parseInput(dailyRate) +
      (parseInput(lateMinutes) / 60) * (parseInput(dailyRate) / 8) +
      parseInput(globeExcess) + parseInput(mpl) + parseInput(hdmfLoan) + parseInput(sssLoan) +
      parseInput(cashAdvance) + parseInput(storeAcct) + parseInput(uniform) + parseInput(safetyShoes) +
      parseInput(taAllowance) + parseInput(otherDeduc);

    const contribution = parseInput(sssEmp) + parseInput(phicEmp) + parseInput(hdmfEmp) + parseInput(wtax);

    const net = income - deduction - contribution;
    setNetPay(formatNumber(Math.max(0, net)));
  }, [dailyRate, noOfDays, otRegDayAmount, otRegDayHours, otSundayAmount, otSundayHours, otSpecialAmount, otSpecialHours,
    otLegalAmount, otLegalHours, otNdAmount, otNdHours, specialHolidayMult, specialHolidayHours, legalHolidayMult, legalHolidayHours,
    allowance, ouPay, absentDays, lateMinutes, globeExcess, mpl, hdmfLoan, sssLoan, cashAdvance, storeAcct, uniform, safetyShoes, taAllowance, otherDeduc,
    sssEmp, phicEmp, hdmfEmp, wtax]);


  return (
    <div className="w-full flex justify-center py-4">
      <div className="w-[1180px] bg-white border border-gray-200 rounded-x shadow-[0_18px_45px_rgba(15,23,42,0.16)] overflow-hidden">
        {/* Top Section - Employee and Period Info */}
        <div className="grid grid-cols-2 gap-4 px-6 py-4 bg-[#f6f7fb] border-b border-gray-200">
          <div className="space-y-2">
            <div className="grid grid-cols-[80px_100px_100px] gap-2 items-center">
              <Label className="font-bold text-sm text-black">ID No</Label>
              <Input className="h-8 text-right tabular-nums text-black" defaultValue="19" />
              <Input className="h-8 text-right tabular-nums bg-gray-100 font-bold text-black" defaultValue="354354" readOnly />
            </div>
            <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
              <Label className="font-bold text-sm text-black">Employee</Label>
              <Input className="h-8 bg-gray-100 font-bold text-black" defaultValue="RIO FACTURAN" readOnly />
            </div>
            <div className="grid grid-cols-[80px_1fr_100px_1fr] gap-2 items-center">
              <Label className="font-bold text-sm text-black">Method</Label>
              <Select defaultValue="daily">
                <SelectTrigger className="h-8 text-black">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">DAILY</SelectItem>
                  <SelectItem value="monthly">MONTHLY</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="grid grid-cols-[110px_1fr] gap-2 items-center">
              <Label className="font-bold text-sm text-black">Posting</Label>
              <Input className="h-8 text-black" type="date" defaultValue="2017-05-02" />
            </div>
            <div className="grid grid-cols-[110px_1fr_40px_1fr] gap-2 items-center">
              <Label className="font-bold text-sm text-black">From</Label>
              <Input className="h-8 text-black" type="date" defaultValue="2017-04-24" />
              <Label className="font-bold text-sm text-right text-black">To:</Label>
              <Input className="h-8 text-black" type="date" defaultValue="2017-04-29" />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-3 gap-[1px] p-[1px] bg-gray-300">
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
              <div className="grid grid-cols-[90px_1fr_70px_100px] gap-2 items-center">
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
              <div className="grid grid-cols-[90px_1fr_70px_100px] gap-2 items-center">
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
              <div className="grid grid-cols-[90px_1fr_70px_100px] gap-2 items-center">
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
              <div className="grid grid-cols-[90px_1fr_70px_100px] gap-2 items-center">
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
              <div className="grid grid-cols-[90px_1fr_70px_100px] gap-2 items-center">
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
              <div className="grid grid-cols-[70px_1fr_40px_40px_100px] gap-2 items-center">
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
              <div className="grid grid-cols-[70px_1fr_40px_40px_100px] gap-2 items-center">
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

              {/* Total Income - label | EXE | large bold amount */}
              <div className="flex gap-2 items-center pt-1">
                <Label className="text-xs text-black font-bold shrink-0">Total Income</Label>
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
              <div className="grid grid-cols-[1fr_50px_70px] gap-1 items-center">
                <Label className="text-xs text-black">Absent (Days)</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={absentDays} onChange={(e) => setAbsentDays(e.target.value)} />
                <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums font-semibold text-black px-1" value={absentAmount} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_50px_70px] gap-1 items-center">
                <Label className="text-xs text-black">Late (Minutes)</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={lateMinutes} onChange={(e) => setLateMinutes(e.target.value)} />
                <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums font-semibold text-black px-1" value={lateAmount} readOnly />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">Globe Excess</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={globeExcess} onChange={(e) => setGlobeExcess(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">MPL</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={mpl} onChange={(e) => setMpl(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">HDMF Loan</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={hdmfLoan} onChange={(e) => setHdmfLoan(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">SSS Loan</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={sssLoan} onChange={(e) => setSssLoan(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">Cash Advance</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={cashAdvance} onChange={(e) => setCashAdvance(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">Store Acct</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={storeAcct} onChange={(e) => setStoreAcct(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">Uniform</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={uniform} onChange={(e) => setUniform(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">Safety shoes</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={safetyShoes} onChange={(e) => setSafetyShoes(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">TA Allowance</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={taAllowance} onChange={(e) => setTaAllowance(e.target.value)} />
              </div>
              <div className="grid grid-cols-[1fr_70px] gap-1 items-center">
                <Label className="text-xs text-black">Other Deduc</Label>
                <Input className="h-6 text-xs text-black px-1 text-right tabular-nums" value={otherDeduc} onChange={(e) => setOtherDeduc(e.target.value)} />
              </div>

              <div className="pt-2">
                <Label className="text-xs text-black font-bold">Total Deduction</Label>
                <div className="flex gap-1">
                  <Button className="h-8 w-12 bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 text-xs font-bold" onClick={() => { recalcAbsent(); recalcLate(); recalcTotalDeduction(); }}>EXE</Button>
                  <Input className="h-8 flex-1 bg-gray-100 text-black font-bold text-right tabular-nums text-lg px-1" value={totalDeduction} readOnly />
                </div>
              </div>

              <Button className="w-full h-10 bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 font-bold mt-2" onClick={calculateNetPay}>
                CALCULATE NET PAY
              </Button>
            </div>
          </div>

          {/* Column 3 - Contributions and OT Rates */}
          <div className="bg-white space-y-[1px]">
            <div className="bg-white text-black">
              <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs tracking-wide border-b border-gray-300 text-black uppercase">
                Employee Cont
              </div>
              <div className="p-2 space-y-1">
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">SSS</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[80px]" value={sssEmp} onChange={(e) => setSssEmp(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">PHIC</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[80px]" value={phicEmp} onChange={(e) => setPhicEmp(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">HDMF</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[80px]" value={hdmfEmp} onChange={(e) => setHdmfEmp(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">WTax</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[80px]" value={wtax} onChange={(e) => setWtax(e.target.value)} />
                </div>
                <div className="pt-1">
                  <div className="flex gap-1">
                    <Button className="h-7 w-12 bg-gray-200 hover:bg-gray-300 text-black border border-gray-400 text-xs font-bold" onClick={recalcEmpContribution}>EXE</Button>
                    <Input className="h-7 flex-1 bg-gray-100 font-bold text-right tabular-nums text-black px-1 max-w-[120px] ml-auto" value={totalEmpContribution} readOnly />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white text-black border-t border-gray-200">
              <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs tracking-wide border-b border-gray-300 text-black uppercase">
                Employer Cont
              </div>
              <div className="p-2 space-y-1">
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">SSS</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[80px]" value={sssEmployer} onChange={(e) => setSssEmployer(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">PHIC</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[80px]" value={phicEmployer} onChange={(e) => setPhicEmployer(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto] gap-2 items-center">
                  <Label className="text-xs text-black">HDMF</Label>
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[80px]" value={hdmfEmployer} onChange={(e) => setHdmfEmployer(e.target.value)} />
                </div>
              </div>
            </div>

            <div className="bg-white text-black border-t border-gray-200">
              <div className="bg-gray-100 px-3 py-1.5 font-bold text-xs tracking-wide border-b border-gray-300 text-black uppercase">
                OT Rates
              </div>
              <div className="p-2 space-y-1">
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OTRegDay</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[70px]" value={otRegDayAmount} readOnly />
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[60px]" value={otRegDayMult} onChange={(e) => setOtRegDayMult(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OTSunday</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[70px]" value={otSundayAmount} readOnly />
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[60px]" value={otSundayMult} onChange={(e) => setOtSundayMult(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OTSpecial</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[70px]" value={otSpecialAmount} readOnly />
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[60px]" value={otSpecialMult} onChange={(e) => setOtSpecialMult(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OTLegal</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[70px]" value={otLegalAmount} readOnly />
                  <Input className="h-6 text-xs text-black px-1 text-right tabular-nums w-[60px]" value={otLegalMult} onChange={(e) => setOtLegalMult(e.target.value)} />
                </div>
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-1 items-center">
                  <Label className="text-xs text-black">OT ND</Label>
                  <Input className="h-6 text-xs bg-gray-100 text-right tabular-nums text-black px-1 w-[70px]" value={otNdAmount} readOnly />
                  <div className="flex gap-0.5">
                    <Input className="h-6 text-xs text-black px-1 flex-1 min-w-0 text-right tabular-nums w-[60px]" value={otNdMult1} onChange={(e) => setOtNdMult1(e.target.value)} placeholder="1.25" />
                    <Input className="h-6 text-xs text-black px-1 flex-1 min-w-0 text-right tabular-nums w-[60px]" value={otNdMult2} onChange={(e) => setOtNdMult2(e.target.value)} placeholder=".10" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-6 py-3 bg-white border-t border-gray-200">
          <Button
            variant="outline"
            className="min-w-[120px] h-10 bg-white hover:bg-gray-50 border border-gray-300 rounded-[10px] font-bold tracking-widest text-black text-sm"
          >
            NEW
          </Button>
          <Button
            variant="outline"
            className="min-w-[120px] h-10 bg-white hover:bg-gray-50 border border-gray-300 rounded-[10px] font-bold tracking-widest text-black text-sm"
          >
            EDIT
          </Button>
          <Button
            variant="outline"
            className="min-w-[120px] h-10 bg-white hover:bg-gray-50 border border-gray-300 rounded-[10px] font-bold tracking-widest text-black text-sm"
          >
            DELETE
          </Button>
          <Button
            variant="outline"
            className="h-10 w-12 flex items-center justify-center bg-white hover:bg-gray-50 border border-gray-300 rounded-[10px] text-black"
          >
            <Printer className="w-4 h-4" />
          </Button>
          <div className="ml-auto border border-gray-300 rounded-[10px] px-6 py-1.5 min-w-[160px] flex items-center justify-center">
            <span className="text-[28px] leading-none font-extrabold tracking-tight tabular-nums text-red-600">
              {netPay}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
