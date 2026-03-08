import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from './ToastContainer';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-dark">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
