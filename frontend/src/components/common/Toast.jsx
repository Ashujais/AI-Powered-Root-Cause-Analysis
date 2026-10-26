import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from '../../store/rcaSlice';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const Toast = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.rca.notification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, dispatch]);

  if (!notification) return null;

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info
  };

  const bgStyles = {
    success: 'bg-emerald-900/90 text-emerald-100 border-emerald-700',
    error: 'bg-rose-900/90 text-rose-100 border-rose-700',
    info: 'bg-slate-900/90 text-slate-100 border-slate-700'
  };

  const Icon = icons[notification.type] || Info;
  const style = bgStyles[notification.type] || bgStyles.info;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className={`flex items-center space-x-2.5 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md max-w-md ${style}`}>
        <Icon className="w-4 h-4 shrink-0 text-white" />
        <span className="text-xs font-semibold leading-snug">
          {notification.message}
        </span>
        <button
          onClick={() => dispatch(clearNotification())}
          className="p-1 rounded text-white/70 hover:text-white transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
