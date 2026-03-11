import { RouterProvider } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { router } from './routes';
import { AuthProvider } from '../lib/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </AuthProvider>
  );
}
