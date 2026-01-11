
import React, { useState, useEffect } from 'react';
import { PropertyType, GasType, Amenities } from '../types';
import { searchLocationOnMap } from '../services/geminiService';

const DRAFT_KEY = 'thikana_post_draft';

const PostListingView: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    advance: '',
    address: '',
    neighborhood: '',
    type: 'Full Flat' as PropertyType,
    gas: 'Pipeline' as GasType,
    bedrooms: 1,
    bathrooms: 1,
    floor: 1,
    isBachelorFriendly: false,
    specialInstructions: '',
    amenities: {
      lineGas: true,
      lift: false,
      generator: false,
      wifi: false,
      cctv: false,
      parking: false
    } as Amenities,
    image: null as string | null,
    video: null as string | null
  });

  // Draft Saving Logic
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load draft");
      }
    }
  }, []);

  useEffect(() => {
    if (step < 5) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData, step]);

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleToggleAmenity = (key: keyof Amenities) => {
    setFormData({
      ...formData,
      amenities: { ...formData.amenities, [key]: !formData.amenities[key] }
    });
  };

  const handleMapPin = async () => {
    setLoading(true);
    // Simulate auto-fetching address using Gemini Grounding
    const result = await searchLocationOnMap("Residential area in Dhaka");
    if (result) {
      setFormData({ 
        ...formData, 
        address: result.links[0]?.title || "Bashundhara R/A, Block C", 
        neighborhood: "Bashundhara" 
      });
    }
    setLoading(false);
  };

  const handleRepost = () => {
    setStep(1); // One-click repost: keeps data but resets status
  };

  const renderStep1 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <div className="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100 mb-2">
         <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Step 1: Essentials</p>
         <h3 className="text-xl font-black text-gray-900 mt-1">Property Basics</h3>
      </div>
      
      <div>
        <label className="text-[10px] uppercase font-black text-gray-400 mb-3 block px-1">Select Property Type</label>
        <div className="grid grid-cols-4 gap-2">
          {['Full Flat', 'Room', 'Sublet', 'Mess'].map(t => (
            <button 
              key={t}
              onClick={() => setFormData({...formData, type: t as PropertyType})}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all ${formData.type === t ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' : 'bg-white border-gray-100 text-gray-500'}`}
            >
              <span className="text-lg mb-1">{t === 'Full Flat' ? '🏢' : t === 'Room' ? '🛏️' : t === 'Sublet' ? '🤝' : '🏠'}</span>
              <span className="text-[8px] font-black uppercase text-center">{t}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Counter label="Bedrooms" icon="🛏️" value={formData.bedrooms} onChange={v => setFormData({...formData, bedrooms: v})} />
        <Counter label="Bathrooms" icon="🚿" value={formData.bathrooms} onChange={v => setFormData({...formData, bathrooms: v})} />
      </div>

      <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
        <label className="text-[10px] uppercase font-black text-gray-400 mb-3 block">Floor Level</label>
        <div className="flex items-center gap-4">
           <button onClick={() => setFormData({...formData, floor: Math.max(0, formData.floor - 1)})} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-xl font-bold">-</button>
           <div className="flex-1 text-center">
              <span className="text-2xl font-black text-indigo-600">{formData.floor}</span>
              <p className="text-[10px] font-bold text-gray-400 uppercase">Floor</p>
           </div>
           <button onClick={() => setFormData({...formData, floor: formData.floor + 1})} className="w-12 h-12 flex items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 text-xl font-bold">+</button>
        </div>
      </div>

      <button onClick={nextStep} className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm mt-4 shadow-xl shadow-gray-200 active:scale-95 transition-transform">
        Continue to Media
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <div className="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100 mb-2">
         <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Step 2: Media & Location</p>
         <h3 className="text-xl font-black text-gray-900 mt-1">Showcase your Space</h3>
      </div>
      
      <div className="space-y-4">
        <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block px-1">Upload Photos & 15s Video</label>
        <div className="grid grid-cols-3 gap-3">
          <div className="aspect-square bg-white border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center text-indigo-400 cursor-pointer hover:bg-indigo-50 transition-colors group">
            <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
            <span className="text-[8px] font-black uppercase mt-1 tracking-wider">Add Photo</span>
          </div>
          <div className="aspect-square bg-white border-2 border-dashed border-indigo-200 rounded-2xl flex flex-col items-center justify-center text-indigo-400 cursor-pointer hover:bg-indigo-50 transition-colors group">
             <span className="text-2xl group-hover:scale-110 transition-transform">🎥</span>
             <span className="text-[8px] font-black uppercase mt-1 tracking-wider">Add Video</span>
          </div>
          <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center text-gray-200">
             <span className="text-4xl">🖼️</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-[10px] uppercase font-black text-gray-400 mb-1 block px-1">Pin Location</label>
        <div className="relative h-48 bg-gray-100 rounded-3xl overflow-hidden border border-gray-200 shadow-inner group">
           <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/90.4125,23.8103,13,0/600x400?access_token=pk.eyJ1IjoibW9ja2VydSIsImEiOiJja2lsbXFyeGswMDRrMnRtcW1idm1rNHBzIn0.L-iL8I6G1D7P6Pz7_v5T_g')] bg-cover opacity-80" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-2xl animate-pulse" />
           </div>
           <button 
             onClick={handleMapPin}
             disabled={loading}
             className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-2.5 rounded-full text-[11px] font-black shadow-xl flex items-center gap-2 border border-gray-100 hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
           >
             {loading ? (
               <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
             ) : '📍 Use Current Location'}
           </button>
        </div>
        <div className="relative">
           <input 
            type="text" 
            placeholder="Detailed Address (e.g., House 24, Road 5)..."
            value={formData.address}
            onChange={e => setFormData({...formData, address: e.target.value})}
            className="w-full p-4 bg-white rounded-2xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-indigo-400 text-sm font-medium transition-all"
           />
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={prevStep} className="flex-1 py-4 bg-white border border-gray-100 text-gray-600 rounded-2xl font-bold text-sm">Back</button>
        <button onClick={nextStep} className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-transform">Continue</button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <div className="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100 mb-2">
         <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Step 3: Amenities & Rules</p>
         <h3 className="text-xl font-black text-gray-900 mt-1">Facility Highlights</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <AmenityToggle label="Line Gas" active={formData.amenities.lineGas} onClick={() => handleToggleAmenity('lineGas')} />
        <AmenityToggle label="Lift" active={formData.amenities.lift} onClick={() => handleToggleAmenity('lift')} />
        <AmenityToggle label="Generator" active={formData.amenities.generator} onClick={() => handleToggleAmenity('generator')} />
        <AmenityToggle label="WiFi" active={formData.amenities.wifi} onClick={() => handleToggleAmenity('wifi')} />
        <AmenityToggle label="CCTV" active={formData.amenities.cctv} onClick={() => handleToggleAmenity('cctv')} />
        <AmenityToggle label="Parking" active={formData.amenities.parking} onClick={() => handleToggleAmenity('parking')} />
      </div>

      <div className="p-6 bg-white rounded-[32px] border border-gray-100 shadow-sm">
         <div className="flex justify-between items-center mb-2">
            <div>
               <h4 className="text-sm font-black text-gray-900">Bachelor Friendly</h4>
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Students / Professionals</p>
            </div>
            <button 
               onClick={() => setFormData({...formData, isBachelorFriendly: !formData.isBachelorFriendly})}
               className={`w-14 h-7 rounded-full transition-all relative p-1 ${formData.isBachelorFriendly ? 'bg-indigo-600' : 'bg-gray-200'}`}
            >
               <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all transform ${formData.isBachelorFriendly ? 'translate-x-7' : 'translate-x-0'}`} />
            </button>
         </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={prevStep} className="flex-1 py-4 bg-white border border-gray-100 text-gray-600 rounded-2xl font-bold text-sm">Back</button>
        <button onClick={nextStep} className="flex-[2] py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95 transition-transform">Continue</button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-right duration-300">
      <div className="bg-indigo-50/50 p-4 rounded-3xl border border-indigo-100 mb-2">
         <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Step 4: Pricing & Terms</p>
         <h3 className="text-xl font-black text-gray-900 mt-1">Final Details</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black text-gray-400 px-1">Monthly Rent</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-black">৳</span>
             <input 
               type="number" 
               placeholder="15,000"
               value={formData.price}
               onChange={e => setFormData({...formData, price: e.target.value})}
               className="w-full pl-8 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-400 font-black text-gray-900"
             />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-black text-gray-400 px-1">Advance Amount</label>
          <div className="relative">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-black">৳</span>
             <input 
               type="number" 
               placeholder="30,000"
               value={formData.advance}
               onChange={e => setFormData({...formData, advance: e.target.value})}
               className="w-full pl-8 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-400 font-black text-gray-900"
             />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] uppercase font-black text-gray-400 px-1">Special Instructions</label>
        <textarea 
          placeholder="e.g. South facing, Close to Metro, Gas bills included..."
          value={formData.specialInstructions}
          onChange={e => setFormData({...formData, specialInstructions: e.target.value})}
          className="w-full p-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-indigo-400 text-sm font-medium min-h-[140px] resize-none shadow-sm"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <button onClick={prevStep} className="flex-1 py-4 bg-white border border-gray-100 text-gray-600 rounded-2xl font-bold text-sm">Back</button>
        <button 
          onClick={() => {
            localStorage.removeItem(DRAFT_KEY);
            nextStep();
          }} 
          className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-transform"
        >
          Publish Listing 🚀
        </button>
      </div>
    </div>
  );

  return (
    <div className="px-6 py-6 pb-24 h-full overflow-y-auto hide-scrollbar">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">New Listing</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Dashboard</p>
        </div>
        <div className="text-right flex flex-col items-end">
           <div className="flex gap-1 mb-2">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-6 h-1 rounded-full transition-all ${step >= i ? 'bg-indigo-600' : 'bg-gray-200'}`} />
              ))}
           </div>
           <p className="text-[10px] font-black text-indigo-500 uppercase">Progress {Math.round((step/4)*100)}%</p>
        </div>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      
      {step === 5 && (
        <div className="text-center py-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="relative inline-block mb-8">
             <div className="w-28 h-28 bg-green-100 text-green-600 rounded-[40px] flex items-center justify-center mx-auto shadow-inner">
               <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
               </svg>
             </div>
             <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce">
                NEW!
             </div>
          </div>
          <h3 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Success!</h3>
          <p className="text-sm text-gray-500 px-6 leading-relaxed">Your property is now live and visible to thousands of matching tenants in our community.</p>
          
          <div className="mt-12 space-y-3">
             <button className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
               <span>👁️</span> View Public Listing
             </button>
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleRepost}
                  className="py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
                >
                  <span>🔄</span> Repost similar
                </button>
                <button className="py-4 bg-white border border-gray-100 text-gray-900 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                  <span>📤</span> Share link
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Counter: React.FC<{ label: string; icon: string; value: number; onChange: (v: number) => void }> = ({ label, icon, value, onChange }) => (
  <div className="p-4 bg-white rounded-3xl border border-gray-100 shadow-sm transition-all hover:border-indigo-100">
     <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">{icon}</span>
        <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{label}</span>
     </div>
     <div className="flex justify-between items-center">
        <button onClick={() => onChange(Math.max(1, value - 1))} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-black hover:bg-indigo-50 hover:text-indigo-600 transition-colors">-</button>
        <span className="text-xl font-black text-gray-900">{value}</span>
        <button onClick={() => onChange(value + 1)} className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 font-black hover:bg-indigo-50 hover:text-indigo-600 transition-colors">+</button>
     </div>
  </div>
);

const AmenityToggle: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-[28px] border-2 transition-all flex items-center gap-3 ${active ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm scale-[1.02]' : 'bg-white border-gray-100 text-gray-400'}`}
  >
     <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${active ? 'border-indigo-600 bg-indigo-600' : 'border-gray-200'}`}>
        {active && (
           <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
           </svg>
        )}
     </div>
     <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default PostListingView;
