import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { SidebarProvider } from './components/sidebar/SidebarContext';
import Sidebar from './components/sidebar/Sidebar';
//import NotFound from './pages/';
import VoiceChat from './pages/voice-chat';
import MyPage from './pages/my-page';
import LogoutConfirmPage from './pages/logout-confirm-page';
import WithdrawalPage from './pages/withdrawal';
import StartPage from './pages/start-page';
import EmotionReportPage from './pages/emotion-report';
import CalendarPage from './pages/calendar';
import TimeCapsulePage from './pages/time-capsule';
import DiaryWriting from './pages/diary-write';

function Router() {
  return (
    <Switch>
      <Route path='/' component={StartPage} />
      <Route path='/voice-chat' component={VoiceChat} />
      <Route path='/emotion-report' component={EmotionReportPage} />
      <Route path='/my-page' component={MyPage} />
      <Route path='/logout-confirm-page' component={LogoutConfirmPage} />
      <Route path='/withdrawal' component={WithdrawalPage} />
      <Route path='/start-page' component={StartPage} />
      <Route path='/time-capsule' component={TimeCapsulePage} />
      {/*<Route component={NotFound} />*/}
      <Route path='/diary/write' component={DiaryWriting} />
      <Route path='/calendar' component={CalendarPage} />
  {/*<Route component={NotFound} />*/ }
    </Switch >
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <div className="min-h-dvh bg-gray-100 flex items-center justify-center p-4">
            <Toaster />
            <div className='relative overflow-hidden' style={{ width: 480, height: 844 }}>
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
