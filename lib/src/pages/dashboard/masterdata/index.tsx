import { Settings } from 'lucide-react';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useHeader } from '../components/Header';

// Employee record modules
import { EmployeeData }         from '../EmployeeData';
import { EmployeeRegistration } from '../EmployeeRegistration';
import { TrainingDetails }      from '../TrainingDetails';

// Master data setup modules — one file per section
import { PositionSetup }       from './PositionSetup';
import { DepartmentSetup }     from './DepartmentSetup';
import { ReligionSetup }       from './ReligionSetup';
import { OvertimeSetup }       from './OvertimeSetup';
import { ContributionRates }   from './ContributionRates';
import { LocationSetup }       from './LocationSetup';
import { EmployeeStatusSetup } from './EmployeeStatusSetup';

const SECTION_HEADERS: Record<string, { title: string; subtitle: string }> = {
  'employee-data-list':    { title: 'EMPLOYEE DATA LIST',            subtitle: 'Employee Records' },
  'employee-registration': { title: 'EMPLOYEE REGISTRATION',         subtitle: 'Register a new employee' },
  'training-details':      { title: 'TRAINING DETAILS',              subtitle: 'Manage employee training records' },
  position:                { title: 'Add New Position',              subtitle: 'Create a new position in the system' },
  department:              { title: 'Add New Department',            subtitle: 'Create a new department' },
  religion:                { title: 'Add New Religion',              subtitle: 'Add a new religion option' },
  overtime:                { title: 'Setup Overtime Rate',           subtitle: 'Configure overtime multipliers' },
  rates:                   { title: 'Government Contribution Rates', subtitle: 'Configure SSS, PHIC, and HDMF contribution rates' },
  status:                  { title: 'Add Employee Status',           subtitle: 'Create a new employee status type' },
  location:                { title: 'LOCATION',                      subtitle: 'Manage work locations' },
  'firearm-setup':         { title: 'FIREARM SETUP',                 subtitle: 'Global configuration for firearm records' },
};

// These sections manage their own header — skip the global setHeaderInfo call
const SELF_HEADED_SECTIONS = new Set([
  'employee-registration',
  'employee-data-list',
  'training-details',
]);

export function MasterData() {
  const { setHeaderInfo } = useHeader();
  const location = useLocation();

  const path    = location.pathname.split('/').filter(Boolean).pop() || 'position';
  const section = path === 'master-data' ? 'position' : path;

  useEffect(() => {
    if (SELF_HEADED_SECTIONS.has(section)) return;

    const header = SECTION_HEADERS[section] ?? SECTION_HEADERS.position;
    setHeaderInfo({
      title: header.title,
      subtitle: header.subtitle,
      icon: Settings,
      searchPlaceholder: 'Search...',
      showSearch: false,
    });
  }, [section, setHeaderInfo]);

  const renderContent = () => {
    switch (section) {
      case 'employee-data-list':    return <EmployeeData />;
      case 'employee-registration': return <EmployeeRegistration />;
      case 'training-details':      return <TrainingDetails />;
      case 'position':              return <PositionSetup />;
      case 'department':            return <DepartmentSetup />;
      case 'religion':              return <ReligionSetup />;
      case 'overtime':              return <OvertimeSetup />;
      case 'rates':                 return <ContributionRates />;
      case 'location':              return <LocationSetup />;
      case 'status':                return <EmployeeStatusSetup />;
      default:                      return null;
    }
  };

  return (
    <div className="animate-in fade-in duration-500">
      {renderContent()}
    </div>
  );
}
