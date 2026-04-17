import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MasterDataProvider } from './dashboard/MasterDataContext';
import { ThemeProvider } from './dashboard/ThemeContext';
import { HeaderProvider } from './dashboard/components/Header';
import { Toaster } from './dashboard/ui/sonner';

export default function App() {
  return (
    <ThemeProvider>
      <HeaderProvider>
        <MasterDataProvider>
          <RouterProvider router={router} />
          <Toaster />
        </MasterDataProvider>
      </HeaderProvider>
    </ThemeProvider>
  );
}
