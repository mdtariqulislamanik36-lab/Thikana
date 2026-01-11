
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PaymentRecord } from '../types';

const MOCK_PAYMENTS: PaymentRecord[] = [
  { month: 'Jan', amount: 15000, status: 'Paid' },
  { month: 'Feb', amount: 15000, status: 'Paid' },
  { month: 'Mar', amount: 15000, status: 'Paid' },
  { month: 'Apr', amount: 15000, status: 'Overdue' },
  { month: 'May', amount: 0, status: 'Pending' },
];

const RentTracker: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-gray-900">Rent Payment History</h3>
        <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Add Payment</button>
      </div>

      <div className="h-48 w-full mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={MOCK_PAYMENTS}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
            <YAxis hide />
            <Tooltip 
              cursor={{fill: '#f3f4f6'}}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
              {MOCK_PAYMENTS.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.status === 'Paid' ? '#818cf8' : entry.status === 'Overdue' ? '#f87171' : '#e5e7eb'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {MOCK_PAYMENTS.slice().reverse().map((pay, i) => (
          <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                pay.status === 'Paid' ? 'bg-green-100 text-green-600' : pay.status === 'Overdue' ? 'bg-red-100 text-red-600' : 'bg-gray-200 text-gray-500'
              }`}>
                {pay.status === 'Paid' ? '✓' : pay.status === 'Overdue' ? '!' : '…'}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{pay.month} Rental</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{pay.status}</p>
              </div>
            </div>
            <p className="font-bold text-gray-900">৳{pay.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RentTracker;
