import React, { useState, useEffect } from 'react';
import { getNeighborhoodInsights } from '../services/geminiService';
import { NeighborhoodVibe } from '../types';

interface Props {
  location: string;
}

const NeighborhoodVibeSection: React.FC<Props> = ({ location }) => {
  const [data, setData] = useState<NeighborhoodVibe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVibe = async () => {
      setLoading(true);
      const result = await getNeighborhoodInsights(location);
      setData(result);
      setLoading(false);
    };
    fetchVibe();
  }, [location]);

  if (loading) return (
    <div className="animate-pulse flex flex-col space-y-3 p-4 bg-indigo-50 dark:bg-indigo-900/10 rounded-2xl">
      <div className="h-4 bg-indigo-200 dark:bg-indigo-800 rounded w-3/4"></div>
      <div className="h-3 bg-indigo-100 dark:bg-indigo-900/20 rounded"></div>
      <div className="h-3 bg-indigo-100 dark:bg-indigo-900/20 rounded w-5/6"></div>
    </div>
  );

  if (!data) return null;

  return (
    <div className="bg-background p-6 rounded-3xl border border-border mt-6 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-text-primary text-lg transition-colors">Neighborhood Vibe</h3>
        <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          {data.safetyScore}/10 Safety
        </div>
      </div>
      
      <p className="text-text-secondary text-sm leading-relaxed mb-6 transition-colors opacity-80">
        {data.description}
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-[10px] uppercase font-black text-indigo-500 tracking-wider mb-2">Nearby Markets</h4>
          <ul className="space-y-1.5">
            {data.markets.slice(0, 3).map((m, i) => (
              <li key={i} className="text-xs font-bold text-text-primary flex items-center transition-colors">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2" />
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-[10px] uppercase font-black text-indigo-500 tracking-wider mb-2">Transport</h4>
          <ul className="space-y-1.5">
            {data.transport.slice(0, 3).map((t, i) => (
              <li key={i} className="text-xs font-bold text-text-primary flex items-center transition-colors">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NeighborhoodVibeSection;