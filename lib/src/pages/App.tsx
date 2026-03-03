import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MasterDataProvider } from './dashboard/MasterDataContext';
import { ThemeProvider } from './dashboard/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <MasterDataProvider>
        <RouterProvider router={router} />
      </MasterDataProvider>
    </ThemeProvider>
  );
}
