import { createBrowserRouter, useRouteError, Navigate } from "react-router";
import { Sidebar } from "./dashboard/Sidebar";
import { Dashboard } from "./dashboard/Dashboard";
import { EmployeeRegistration } from "./dashboard/EmployeeRegistration";
import { PayrollEntry } from "./dashboard/PayrollEntry";
import { MasterData } from "./dashboard/masterdata";
import { FirearmMasterData } from "./dashboard/FirearmMasterData";
import { Settings } from "./dashboard/Settings";
import { Company } from "./dashboard/Company";
import { SetupTypeLoan } from "./dashboard/SetupTypeLoan";
import { LoanProcessing } from "./dashboard/LoanProcessing";
import { BorrowDataList } from "./dashboard/BorrowDataList";
import { Login } from "./Login";
import { TimeLogs } from "./dashboard/TimeLogs";
import { AttendanceView } from "./dashboard/AttendanceView";
import { ScheduleView } from "./dashboard/ScheduleView";
import { LeaveCreditView } from "./dashboard/LeaveCreditView";


function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 p-8 text-center">
      <h1 className="text-4xl font-bold text-slate-900 italic tracking-tighter">Oops! Unexpected Error</h1>
      <p className="text-slate-600 max-w-md">
        Something went wrong. This might be due to a routing issue or an unexpected application state.
      </p>
      <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 font-mono text-sm max-w-full overflow-auto text-left break-words">
        <p><strong>Status:</strong> {error?.status}</p>
        <p><strong>Status Text:</strong> {error?.statusText}</p>
        <p><strong>Message:</strong> {error?.message}</p>
        <pre className="mt-2 text-xs">{error?.stack}</pre>
        <pre className="mt-2 text-xs">{JSON.stringify(error, null, 2)}</pre>
      </div>
      <a href="/" className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
        Back to Safety
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: Sidebar,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Dashboard },
      { path: "company/*", Component: Company },
      { path: "employee-registration", element: <Navigate to="/master-data/employee-registration" replace /> },

      { path: "payroll-entry", Component: PayrollEntry },
      { path: "setup-type-loan", Component: SetupTypeLoan },
      { path: "loan-processing", Component: LoanProcessing },
      { path: "borrow-data-list", Component: BorrowDataList },
      { path: "master-data/firearm-setup/*", Component: FirearmMasterData },
      { path: "master-data/*", Component: MasterData },
      { path: "time-attendance/time-logs", Component: TimeLogs },
      { path: "time-attendance/attendance-view", Component: AttendanceView },
      { path: "time-attendance/schedule-view", Component: ScheduleView },
      { path: "time-attendance/leave-credit", Component: LeaveCreditView },
      { path: "time-attendance/training-details", element: <Navigate to="/master-data/training-details" replace /> },

      { path: "settings", Component: Settings },
    ],
  },
]);
