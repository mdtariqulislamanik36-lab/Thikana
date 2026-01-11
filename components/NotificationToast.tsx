
import React, { useEffect, useState } from 'react';
import { NotificationPayload } from '../types';

interface Props {
  payload: NotificationPayload;
  onClose: () => void;
  onClick: (payload: NotificationPayload) => void;
}

const NotificationToast: React.FC<Props> = ({ payload, onClose, onClick }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 4000);
  };

  return (
    <div 
      className={`fixed top-4 left-4 right-4 z-[200] max-w-sm mx-auto transition-all duration-500 transform ${
        isExiting ? '-translate-y-32 opacity-0' : 'translate-y-0 opacity-100'
      }`}
    >
      <div 
        onClick={() => onClick(payload)}
        className="bg-gray-900/95 backdrop-blur-xl text-white p-4 rounded-[28px] shadow-2xl border border-white/10 flex items-center gap-4 cursor-pointer active:scale-95 transition-all"
      >
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-xl shadow-lg flex-shrink-0">
          {payload.senderAvatar ? <img src={payload.senderAvatar} className="w-full h-full object-cover rounded-2xl" /> : '👤'}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-0.5">
            <h4 className="text-sm font-black truncate">{payload.title}</h4>
            <span className="text-[8px] font-bold opacity-40 uppercase tracking-widest">Now</span>
          </div>
          <p className="text-xs opacity-80 truncate leading-relaxed">
            {payload.isPrivate ? "New notification" : payload.body}
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); onClick(payload); }}
            className="px-4 py-1.5 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-wider"
          >
            {payload.type === 'call' ? 'Join' : 'Reply'}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleClose(); }}
            className="px-4 py-1.5 bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-wider"
          >
            Hide
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
