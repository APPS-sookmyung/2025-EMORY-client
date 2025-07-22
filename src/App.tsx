import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import VoiceChat from '@/pages/voice-chat';

function Router() {
  return (
    <Switch>
      <Route path='/' component={VoiceChat} />
      <Route path='/voice-chat' component={VoiceChat} />
      <Route component={NotFound} />
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
