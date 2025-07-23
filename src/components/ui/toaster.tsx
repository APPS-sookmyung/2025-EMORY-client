import { useToast } from '../../hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../../components/ui/toast';

// Toast 컴포넌트: 전역 상태 관리 및 사용자 정의 훅
// - useToast 훅을 사용하여 토스트 메시지 관리
// 토스트들을 실제로 화면에 그려주는 render 함수
// - ToastProvider로 감싸서 전역 상태 관리

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className='grid gap-1'>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
