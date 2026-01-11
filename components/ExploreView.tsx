import React, { useState } from 'react';
import { MOCK_PROPERTIES } from '../constants';
import PropertyCard from './PropertyCard';
import { Property } from '../types';
import { searchLocationOnMap } from '../services/geminiService';

interface Props {
  onPropertyClick: (p: Property) => void;
  onSaveAddress?: (address: string) => void;
}

const ExploreView: React.FC<Props> = ({ onPropertyClick, onSaveAddress }) => {
  const [search, setSearch] = useState('');
  const [mapSearch, setMapSearch] = useState('');
  const [isSearchingMap, setIsSearchingMap] = useState(false);
  const [mapResult, setMapResult] = useState<{ text: string; links: any[] } | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'bachelor' | 'family'>('all');

  const handleMapSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearch.trim()) return;
    
    setIsSearchingMap(true);
    const result = await searchLocationOnMap(mapSearch);
    setMapResult(result);
    setIsSearchingMap(false);
    setSearch(mapSearch);
  };

  const filteredProperties = MOCK_PROPERTIES.filter(p => {
    const matchesSearch = p.neighborhood.toLowerCase().includes(search.toLowerCase()) || 
                         p.title.toLowerCase().includes(search.toLowerCase());
    const matchesType = activeFilter === 'all' ? true : 
                        activeFilter === 'bachelor' ? p.isBachelorFriendly : !p.isBachelorFriendly;
    return matchesSearch && matchesType;
  });

  return (
    <div className="px-8 py-8">
      {/* Search with High Contrast Style */}
      <div className="mb-10">
        <form onSubmit={handleMapSearch} className="relative group">
          <input 
            type="text" 
            placeholder="Search neighborhood..."
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-5 bg-surface rounded-[24px] border border-border premium-shadow focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 text-sm font-black transition-all outline-none text-text-primary"
          />
          <button type="submit" className="absolute left-5 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-brand-500 transition-colors">
            {isSearchingMap ? (
              <div className="w-5 h-5 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </button>
        </form>
      </div>

      {/* Map Grounding Results - Styled like a Magazine Insert */}
      {mapResult && (
        <div className="mb-10 p-8 bg-brand-500 rounded-[40px] shadow-2xl accent-glow animate-in zoom-in-95 duration-500 overflow-hidden relative">
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
           <div className="relative z-10">
              <div className="flex justify-between items-center mb-4">
                <span className="bg-white/20 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest">Neighborhood Intel</span>
                <button onClick={() => setMapResult(null)} className="text-white/60 hover:text-white">✕</button>
              </div>
              <h4 className="text-2xl font-black text-white mb-4 leading-tight tracking-tighter">Insights for {mapSearch}</h4>
              <p className="text-white/90 text-sm font-medium leading-relaxed mb-6">{mapResult.text}</p>
              <div className="space-y-3">
                  {mapResult.links.map((link, idx) => (
                    <a 
                      key={idx} 
                      href={link.uri} 
                      target="_blank" 
                      className="flex items-center text-xs font-black text-brand-900 bg-white/95 px-5 py-4 rounded-[20px] shadow-lg hover:scale-105 active:scale-95 transition-all"
                    >
                      <span className="mr-3 text-lg">🔗</span>
                      {link.title}
                    </a>
                  ))}
              </div>
           </div>
        </div>
      )}

      {/* Filter Segmented Control - Boutique Style */}
      <div className="flex bg-surface p-2 rounded-[28px] border border-border mb-10 premium-shadow">
        {['all', 'bachelor', 'family'].map((filter) => (
          <button 
            key={filter}
            onClick={() => setActiveFilter(filter as any)}
            className={`flex-1 py-3.5 rounded-[20px] text-[10px] font-black uppercase tracking-[0.15em] transition-all ${
              activeFilter === filter 
                ? 'bg-brand-500 text-white shadow-lg accent-glow' 
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {filter === 'all' ? 'Everywhere' : filter === 'bachelor' ? 'Singles' : 'Families'}
          </button>
        ))}
      </div>

      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-black text-text-primary tracking-tighter leading-none mb-2 transition-colors">Hot Picks</h2>
          <p className="text-[10px] text-text-secondary font-black uppercase tracking-[0.2em] transition-colors">Recently Added in {search || 'Dhaka'}</p>
        </div>
        <div className="w-10 h-10 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500">
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
        </div>
      </div>

      <div className="space-y-4">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(prop => (
            <PropertyCard key={prop.id} property={prop} onClick={onPropertyClick} />
          ))
        ) : (
          <div className="py-24 text-center">
             <div className="text-6xl mb-6 opacity-30 animate-bounce">📦</div>
             <p className="text-lg font-black text-text-primary mb-1">Zero Results</p>
             <p className="text-xs font-bold text-text-secondary uppercase tracking-widest">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreView;