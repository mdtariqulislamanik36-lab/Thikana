import React, { useState, useEffect } from 'react';
import { Property, UserProfile } from '../types';
import NeighborhoodVibeSection from './NeighborhoodVibeSection';
import { generateRentalAgreement, getNeighborhoodInsights } from '../services/geminiService';

interface Props {
  property: Property;
  user: UserProfile;
  onBack: () => void;
  onStartChat: (propertyId: string, landlordId: string) => void;
}

const PropertyDetail: React.FC<Props> = ({ property, user, onBack, onStartChat }) => {
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementText, setAgreementText] = useState('');
  const [generating, setGenerating] = useState(false);
  const [score, setScore] = useState({ markets: 0, mosques: 0, transport: 0, total: 0 });
  const [showVerifAlert, setShowVerifAlert] = useState(false);

  const isUserVerified = user.secure.mobileVerified && user.trust.nidVerified;

  useEffect(() => {
    const fetchScore = async () => {
       const vibe = await getNeighborhoodInsights(property.neighborhood);
       if (vibe) {
          const markets = Math.min(vibe.markets.length * 2, 10);
          const transport = Math.min(vibe.transport.length * 3, 10);
          const safety = vibe.safetyScore;
          setScore({
             markets,
             mosques: 9, 
             transport,
             total: Math.round((markets + transport + safety + 9) / 4)
          });
       }
    };
    fetchScore();
  }, [property.neighborhood]);

  const handleChatClick = () => {
    if (isUserVerified) {
      onStartChat(property.id, property.landlord.id);
    } else {
      setShowVerifAlert(true);
      setTimeout(() => setShowVerifAlert(false), 4000);
    }
  };

  const handleCallClick = () => {
    if (isUserVerified) {
      window.location.href = `tel:${user.secure.mobile}`;
    } else {
      setShowVerifAlert(true);
      setTimeout(() => setShowVerifAlert(false), 4000);
    }
  };

  const handleGenerateAgreement = async () => {
    setGenerating(true);
    const text = await generateRentalAgreement({
      tenantName: user.basic.fullName,
      landlordName: property.landlord.name,
      address: property.address,
      rent: property.price,
      duration: '1 Year'
    });
    setAgreementText(text);
    setGenerating(false);
    setShowAgreement(true);
  };

  return (
    <div className="fixed inset-0 bg-background z-[60] overflow-y-auto hide-scrollbar flex flex-col max-w-md mx-auto transition-colors duration-300">
      {/* Header Image */}
      <div className="relative h-80 w-full flex-shrink-0">
        <img src={property.image} className="w-full h-full object-cover" alt={property.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 p-2 bg-black/20 backdrop-blur-xl border border-white/30 text-white rounded-full shadow-lg z-10 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 bg-surface -mt-10 rounded-t-[40px] px-8 pt-10 pb-32 relative shadow-2xl transition-colors">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">{property.type}</span>
              {property.isBachelorFriendly && <span className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">Bachelor Friendly</span>}
            </div>
            <h1 className="text-2xl font-black text-text-primary leading-tight tracking-tight transition-colors">{property.title}</h1>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-indigo-600">৳{property.price.toLocaleString()}</p>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest transition-colors">per month</p>
          </div>
        </div>

        <p className="text-text-secondary flex items-center text-sm font-medium mb-8 transition-colors">
          <svg className="w-4 h-4 mr-1 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {property.address}
        </p>

        {/* Specs Grid */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <DetailCard icon="🛏️" label="Bedrooms" value={property.bedrooms} />
          <DetailCard icon="🛁" label="Bathrooms" value={property.bathrooms} />
          <DetailCard icon="🪜" label="Floor" value={`${property.floor}th`} />
        </div>

        <div className="mb-10">
          <h2 className="text-lg font-black text-text-primary mb-3 tracking-tight transition-colors">About this property</h2>
          <p className="text-text-secondary text-sm leading-relaxed transition-colors">{property.description}</p>
        </div>

        {/* Landlord Info with Chat and Call buttons */}
        <div className="flex flex-col p-6 bg-background rounded-[32px] mb-10 border border-border shadow-sm gap-4 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-14 h-14 bg-surface rounded-2xl flex items-center justify-center mr-4 shadow-sm text-2xl border border-border">
                👤
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="font-black text-text-primary transition-colors">{property.landlord.name}</p>
                  {property.landlord.verified && (
                    <div className="bg-green-500 text-white p-0.5 rounded-full">
                      <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                      </svg>
                    </div>
                  )}
                </div>
                <p className="text-xs text-text-secondary font-medium transition-colors">⭐ {property.landlord.rating} Rating</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={handleChatClick}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl shadow-lg hover:shadow-indigo-100 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Message</span>
            </button>
            <button 
              onClick={handleCallClick}
              className="flex-1 bg-text-primary text-background py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
            </button>
          </div>
        </div>

        <NeighborhoodVibeSection location={property.neighborhood} />
      </div>

      {/* Verification Alert Snackbar */}
      {showVerifAlert && (
        <div className="fixed bottom-32 left-8 right-8 z-[100] bg-text-primary text-background p-5 rounded-[24px] shadow-2xl animate-in slide-in-from-bottom-8 duration-500 flex items-center justify-between border-t-4 border-orange-500">
           <div className="flex items-center gap-4">
              <span className="text-2xl">🛡️</span>
              <div>
                <p className="text-xs font-black uppercase tracking-widest leading-none mb-1 text-orange-400">Security Access</p>
                <p className="text-[10px] font-bold opacity-80">Please verify your profile/NID to start a conversation.</p>
              </div>
           </div>
           <button onClick={() => setShowVerifAlert(false)} className="bg-background/20 p-2 rounded-xl">✕</button>
        </div>
      )}

      {/* Bottom Sticky Actions */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-surface/90 backdrop-blur-xl border-t border-border flex gap-4 z-[70] shadow-[0_-10px_30px_-10px_rgba(0,0,0,0.1)] transition-colors">
        <button 
          onClick={handleGenerateAgreement}
          disabled={generating}
          className="flex-1 py-4 bg-background text-text-primary border border-border rounded-2xl font-black text-xs flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all uppercase tracking-widest"
        >
          {generating ? 'Drafting...' : 'Quick Agreement'}
        </button>
        <button className="flex-[1.5] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs shadow-2xl active:scale-95 transition-all uppercase tracking-widest">
          Book a Visit
        </button>
      </div>
    </div>
  );
};

const DetailCard: React.FC<{ icon: string; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-surface p-4 rounded-[28px] border border-border shadow-sm flex flex-col items-center justify-center transition-all hover:border-indigo-100 dark:hover:bg-indigo-900/10">
    <span className="text-2xl mb-1">{icon}</span>
    <p className="text-[10px] font-black text-text-primary transition-colors">{value}</p>
    <p className="text-[8px] font-bold text-text-secondary uppercase tracking-widest mt-0.5 transition-colors">{label}</p>
  </div>
);

export default PropertyDetail;