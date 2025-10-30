import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { SidebarProvider } from './components/sidebar/SidebarContext';
import Sidebar from './components/sidebar/Sidebar';

import VoiceChat from './pages/voice-chat';
import MyPage from './pages/my-page';
import LogoutConfirmPage from './pages/logout-confirm-page';
import WithdrawalPage from './pages/withdrawal';
import StartPage from './pages/start-page';
import EmotionReportPage from './pages/emotion-report';

import MonthWeekReport from './pages/month-week-report';
import TimeCapsulePage from './pages/time-capsule';
import DiaryWriting from './pages/diary-write';
import DiaryPreview from './pages/diary-preview';
import DiaryLibrary from './pages/diary-library';

import MoodCalendar from './pages/calendar';
import NotFoundPage from './pages/not-found';
import ErrorPage from './pages/error';
import LoadingPage from './pages/loading';

function Router() {
  return (
    <Switch>
      <Route path='/' component={StartPage} />
      <Route path='/voice-chat' component={VoiceChat} />
      <Route path='/emotion-report' component={EmotionReportPage} />
      <Route path='/month-week-report' component={MonthWeekReport} />
      <Route path='/my-page' component={MyPage} />
      <Route path='/logout-confirm-page' component={LogoutConfirmPage} />
      <Route path='/withdrawal' component={WithdrawalPage} />
      <Route path='/start-page' component={StartPage} />

      <Route path='/time-capsule' component={TimeCapsulePage} />

      <Route path='/calendar' component={MoodCalendar} />
      <Route path='/diary-write' component={DiaryWriting} />
      <Route path='/diary-preview' component={DiaryPreview} />
      <Route path='/diary-library' component={DiaryLibrary} />

      <Route path='/loading' component={LoadingPage} />
      <Route path='/error' component={ErrorPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>

          <div className='min-h-dvh bg-gray-100 flex items-center justify-center p-4'>

            <Toaster />
            <div
              className='relative overflow-hidden'
              style={{ width: 480, height: 844, borderRadius: '20px' }}
            >
              <Router />
              {/* 글로벌 사이드바 */}
              <Sidebar />
            </div>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
