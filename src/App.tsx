import { useEffect, lazy, Suspense } from 'react';
import PreferencesProvider from '@/context/PreferencesProvider';
import ToastProvider from '@/components/ui/ToastProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HomePage from '@/pages/HomePage';
import StudyTasksPage from '@/pages/StudyTasksPage';
import ExamCountdownPage from '@/pages/ExamCountdownPage';
import SmartNotesPage from '@/pages/SmartNotesPage';
import { usePreferences } from '@/hooks/usePreferences';
import { useRoute, type Route } from '@/hooks/useRoute';

const MergePdfPage = lazy(() => import('@/pages/MergePdfPage'));
const PdfCompressorPage = lazy(() => import('@/pages/PdfCompressorPage'));
const ImagesToPdfPage = lazy(() => import('@/pages/ImagesToPdfPage'));
const ImageToTextPage = lazy(() => import('@/pages/ImageToTextPage'));

const pageFallback = <p className="py-20 text-center text-muted">...</p>;

function renderPage(page: Route['page']) {
  switch (page) {
    case 'merge':
      return (
        <Suspense fallback={pageFallback}>
          <MergePdfPage />
        </Suspense>
      );
    case 'compress':
      return (
        <Suspense fallback={pageFallback}>
          <PdfCompressorPage />
        </Suspense>
      );
    case 'images':
      return (
        <Suspense fallback={pageFallback}>
          <ImagesToPdfPage />
        </Suspense>
      );
    case 'ocr':
      return (
        <Suspense fallback={pageFallback}>
          <ImageToTextPage />
        </Suspense>
      );
    case 'tasks':
      return <StudyTasksPage />;
    case 'exams':
      return <ExamCountdownPage />;
    case 'notes':
      return <SmartNotesPage />;
    case 'home':
      return <HomePage />;
  }
}

function AppShell() {
  const route = useRoute();
  const { t } = usePreferences();

  useEffect(() => {
    document.title = t('app.title');
  }, [t]);

  useEffect(() => {
    if (route.anchor) {
      document.getElementById(route.anchor)?.scrollIntoView();
      return;
    }
    window.scrollTo({ top: 0 });
  }, [route.hash, route.anchor]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar route={route} />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <div key={route.page} className="animate-page-in">
          {renderPage(route.page)}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <PreferencesProvider>
      <ToastProvider>
        <AppShell />
      </ToastProvider>
    </PreferencesProvider>
  );
}
