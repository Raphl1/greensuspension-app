import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Bell } from 'lucide-react';

const AlertItem = ({ type, text, time }) => {
  const icons = {
    success: <CheckCircle className="text-emerald-400" size={20} />,
    warning: <AlertTriangle className="text-amber-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    info: <Bell className="text-neutral-400" size={20} />,
  };
  const colors = {
    success: 'bg-emerald-900/50 border-emerald-500/30',
    warning: 'bg-amber-900/50 border-amber-500/30',
    error: 'bg-red-900/50 border-red-500/30',
    info: 'bg-neutral-800/50 border-neutral-700/50',
  }

  return (
    <div className={`p-4 rounded-lg flex items-start space-x-4 border ${colors[type]}`}>
      <div className="flex-shrink-0 pt-1">{icons[type]}</div>
      <div>
        <p className="text-sm font-medium text-neutral-100">{text}</p>
        <p className="text-xs text-neutral-400">{time}</p>
      </div>
    </div>
  );
};

export default AlertItem;
