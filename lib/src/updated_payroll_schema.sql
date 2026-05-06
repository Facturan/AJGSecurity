-- UPDATED PAYROLLDATA TABLE SCHEMA
-- Run this in your Supabase SQL Editor to ensure all fields can be saved and loaded.

CREATE TABLE IF NOT EXISTS "PAYROLLDATA" (
    "PID" BIGSERIAL PRIMARY KEY,
    "EmpID" BIGINT NOT NULL,
    "EmpName" VARCHAR(200) NOT NULL,
    "SalaryMethod" VARCHAR(50),
    "DateFrom" DATE,
    "DateTo" DATE,
    "DatePosting" DATE DEFAULT CURRENT_DATE,
    "DailyRate" DECIMAL(15, 2),
    "NoOfDays" DECIMAL(15, 2),
    "BasicRate" DECIMAL(15, 2),
    
    -- Overtime Hours
    "OTRegHrs" DECIMAL(15, 2),
    "OTSunHrs" DECIMAL(15, 2),
    "OTSpecialHrs" DECIMAL(15, 2),
    "OTLegalHrs" DECIMAL(15, 2),
    "OTNightDiffHrs" DECIMAL(15, 2),
    
    -- Overtime Amounts
    "TotalOTRegHrs" DECIMAL(15, 2),
    "TotalOTSunHrs" DECIMAL(15, 2),
    "TotalOTSpecialHrs" DECIMAL(15, 2),
    "TotalOTLegalHrs" DECIMAL(15, 2),
    "TotalOTNightDiffHrs" DECIMAL(15, 2),
    "TotalOTPay" DECIMAL(15, 2),
    
    -- Holiday
    "TotalSpecialDay" DECIMAL(15, 2),
    "TotalLegalDay" DECIMAL(15, 2),
    "TotalHoliday" DECIMAL(15, 2),
    "SpecHolHRS" DECIMAL(15, 2),
    "SpecHolMult" DECIMAL(15, 2),
    "LegHolHRS" DECIMAL(15, 2),
    "LegHolMult" DECIMAL(15, 2),
    
    -- Allowances and Income
    "AllowanceRate" DECIMAL(15, 2),
    "TotalAllowance" DECIMAL(15, 2),
    "FiveDaysIncentiveDays" DECIMAL(15, 2),
    "FiveDaysIncentiveAmount" DECIMAL(15, 2),
    "CashGasAllowance" DECIMAL(15, 2),
    "FoodAllowanceIncome" DECIMAL(15, 2),
    "LoadAllowance" DECIMAL(15, 2),
    "IncentivesIncome" DECIMAL(15, 2),
    "CommsIncome" DECIMAL(15, 2),
    "OTRefund" DECIMAL(15, 2),
    "OverUnderPay" DECIMAL(15, 2),
    "TotalIncome" DECIMAL(15, 2),
    
    -- Deductions
    "Absent" DECIMAL(15, 2),
    "TotalAbsent" DECIMAL(15, 2),
    "Late" DECIMAL(15, 2),
    "TotalLate" DECIMAL(15, 2),
    "GlobeExcess" DECIMAL(15, 2),
    "MPL" DECIMAL(15, 2),
    "HDMFLoan" DECIMAL(15, 2),
    "SSSLoan" DECIMAL(15, 2),
    "ElBonitaLoan" DECIMAL(15, 2),
    "CashAdvance" DECIMAL(15, 2),
    "StoreAccount" DECIMAL(15, 2),
    "Uniform" DECIMAL(15, 2),
    "Shoes" DECIMAL(15, 2),
    "TravelAllowance" DECIMAL(15, 2),
    "PagIbigPhilhealth" DECIMAL(15, 2),
    "PagIbigLoan" DECIMAL(15, 2),
    "RiceCA" DECIMAL(15, 2),
    "Rice" DECIMAL(15, 2),
    "CPLoan" DECIMAL(15, 2),
    "SSSPenaltyJohndorf" DECIMAL(15, 2),
    "ThailandCA" DECIMAL(15, 2),
    "MotorURC" DECIMAL(15, 2),
    "CHX" DECIMAL(15, 2),
    "FlagXUniform" DECIMAL(15, 2),
    "TotalDeduc" DECIMAL(15, 2),
    
    -- Employee Contributions
    "EmpSSS" DECIMAL(15, 2),
    "PHIC" DECIMAL(15, 2),
    "EmpHDMF" DECIMAL(15, 2),
    "WTAX" DECIMAL(15, 2),
    "TotalEmpCont" DECIMAL(15, 2),
    
    -- Employer Contributions
    "ComSSS" DECIMAL(15, 2),
    "ComPHIC" DECIMAL(15, 2),
    "ComHDMF" DECIMAL(15, 2),
    
    -- Rates (Stored for Audit)
    "OTRegDay" DECIMAL(15, 2),
    "OTSunday" DECIMAL(15, 2),
    "OTSpecial" DECIMAL(15, 2),
    "OTLegal" DECIMAL(15, 2),
    "OTND" DECIMAL(15, 2),
    
    -- Final Net
    "NetPay" DECIMAL(15, 2),
    
    -- System Audit
    "created_at" TIMESTAMPTZ DEFAULT NOW()
);
