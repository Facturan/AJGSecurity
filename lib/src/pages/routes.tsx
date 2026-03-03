import { createBrowserRouter, useRouteError } from "react-router";
import { Sidebar } from "./dashboard/Sidebar";
import { Dashboard } from "./dashboard/Dashboard";
import { EmployeeRegistration } from "./dashboard/EmployeeRegistration";
import { PayrollEntry } from "./dashboard/PayrollEntry";
import { MasterData } from "./dashboard/MasterData";
import { Settings } from "./dashboard/Settings";
import { Company } from "./dashboard/Company";

function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 p-8 text-center">
      <h1 className="text-4xl font-bold text-slate-900 italic tracking-tighter">Oops! Unexpected Error</h1>
      <p className="text-slate-600 max-w-md">
        Something went wrong. This might be due to a routing issue or an unexpected application state.
      </p>
      <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 font-mono text-sm">
        {error.statusText || error.message}
      </div>
      <a href="/" className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors">
        Back to Safety
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Sidebar,
    errorElement: <ErrorPage />,
    children: [
      { index: true, Component: Dashboard },
      { path: "company/*", Component: Company },
      { path: "employee-registration", Component: EmployeeRegistration },
      { path: "payroll-entry", Component: PayrollEntry },
      { path: "master-data/*", Component: MasterData },
      { path: "settings", Component: Settings },
    ],
  },
]);
