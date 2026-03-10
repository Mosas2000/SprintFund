import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from './ToastContainer';
import { SkipToContent } from './SkipToContent';
import { RouteAnnouncer } from './RouteAnnouncer';

export function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-dark overflow-x-hidden">
      <SkipToContent />
      <RouteAnnouncer />
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}
