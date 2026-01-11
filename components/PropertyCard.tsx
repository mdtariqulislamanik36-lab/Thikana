import React from 'react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick: (prop: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  return (
    <div 
      onClick={() => onClick(property)}
      className="bg-card rounded-[40px] overflow-hidden border border-border premium-shadow mb-8 active:scale-[0.97] transition-all cursor-pointer group"
    >
      <div className="relative h-64 w-full">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-5 left-5 flex gap-2">
           <span className="bg-surface/90 backdrop-blur-md text-text-primary text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-xl">
             {property.type}
           </span>
        </div>

        {property.isBachelorFriendly && (
           <div className="absolute top-5 right-5 w-10 h-10 bg-brand-500 text-white rounded-full flex items-center justify-center shadow-lg accent-glow animate-float">
              <span className="text-xl">🤵</span>
           </div>
        )}

        <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
           <div className="flex-1 min-w-0 pr-4">
              <h3 className="text-xl font-black text-white leading-tight truncate mb-1">{property.title}</h3>
              <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest flex items-center">
                <span className="mr-1.5 text-brand-500">📍</span> {property.neighborhood}
              </p>
           </div>
           <div className="bg-brand-500 text-white px-5 py-2.5 rounded-[20px] shadow-2xl font-black text-lg accent-glow whitespace-nowrap">
             ৳{property.price.toLocaleString()}
           </div>
        </div>
      </div>
      
      <div className="p-6 flex items-center justify-between">
        <div className="flex gap-6">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-background rounded-xl flex items-center justify-center text-lg border border-border">🛏️</div>
              <span className="text-xs font-black text-text-primary">{property.bedrooms}</span>
           </div>
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-background rounded-xl flex items-center justify-center text-lg border border-border">🚿</div>
              <span className="text-xs font-black text-text-primary">{property.bathrooms}</span>
           </div>
        </div>
        <div className="flex -space-x-3">
           <div className="w-8 h-8 rounded-full border-2 border-surface bg-brand-100 overflow-hidden">
             <img src={`https://i.pravatar.cc/100?u=${property.landlord.id}`} className="w-full h-full object-cover" />
           </div>
           <div className="w-8 h-8 rounded-full border-2 border-surface bg-zinc-800 flex items-center justify-center text-[8px] font-black text-white uppercase tracking-tighter">
             +{Math.floor(Math.random() * 5)}
           </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;