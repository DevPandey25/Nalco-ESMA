import { useAppStore } from '../store/useAppStore';

export default function Toast() {
  const toasts = useAppStore(state => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-region" aria-live="polite">
      {toasts.map(toast => (
        <div key={toast.id} className="toast">
          {toast.message}
        </div>
      ))}
    </div>
  );
}
