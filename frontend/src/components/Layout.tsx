import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from './ToastContainer';
import { SkipToContent } from './SkipToContent';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-dark">
      <SkipToContent />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
