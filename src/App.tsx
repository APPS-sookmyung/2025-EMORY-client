import { Switch, Route } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
//import NotFound from './pages/';
import VoiceChat from './pages/voice-chat';
import MyPage from './pages/my-page';
import LogoutConfirmPage from './pages/logout-confirm-page';
import WithdrawalPage from './pages/withdrawal';
import StartPage from './pages/start-page';
import EmotionReportPage from './pages/emotion-report';

function Router() {
  return (
    <Switch>
      <Route path='/' component={VoiceChat} />
      <Route path='/voice-chat' component={VoiceChat} />
      <Route path='/my-page' component={MyPage} />
      <Route path='/logout-confirm-page' component={LogoutConfirmPage} />
      <Route path='/withdrawal' component={WithdrawalPage} />
      <Route path='/start-page' component={StartPage} />
      <Route path='/emotion-report' component={EmotionReportPage} />
      {/*<Route component={NotFound} />*/}
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
