import { RouterProvider } from 'react-router';
import { router } from './routes';
import { MasterDataProvider } from './dashboard/MasterDataContext';
import { ThemeProvider } from './dashboard/ThemeContext';
import { HeaderProvider } from './dashboard/components/Header';

export default function App() {
  return (
    <ThemeProvider>
      <HeaderProvider>
        <MasterDataProvider>
          <RouterProvider router={router} />
        </MasterDataProvider>
      </HeaderProvider>
    </ThemeProvider>
  );
}
