
import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

const ProfileTab: React.FC<Props> = ({ user, onUpdate }) => {
  const [activeSubTab, setActiveSubTab] = useState<'public' | 'secure'>('public');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile Completion Calculation
  const calculateCompletion = (u: UserProfile) => {
    let score = 0;
    if (u.basic.profilePhoto) score += 10;
    if (u.basic.fullName) score += 5;
    if (u.basic.bio) score += 5;
    if (u.basic.currentAddress) score += 5;
    if (u.basic.profession) score += 5;
    if (u.secure.mobileVerified) score += 20;
    if (u.secure.email) score += 10;
    if (u.trust.nidFrontImage && u.trust.nidBackImage) score += 30;
    if (u.trust.emergencyContact) score += 10;
    return score;
  };

  const completion = calculateCompletion(user);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({
          ...user,
          basic: { ...user.basic, profilePhoto: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="px-6 py-6 pb-24">
      {/* Profile Progress Header */}
      <div className="mb-8 p-6 bg-white rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-black text-gray-900">Profile Completion</h3>
          <span className="text-sm font-black text-indigo-600">{completion}%</span>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-1000 ease-out rounded-full"
            style={{ width: `${completion}%` }}
          />
        </div>
        <p className="mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
          {completion < 100 ? 'Complete your profile to unlock "Verified" badge' : 'You are fully verified!'}
        </p>
      </div>

      {/* User Identity Banner */}
      <div className="flex items-center mb-8">
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="relative w-20 h-20 group cursor-pointer"
        >
          <div className="w-full h-full bg-indigo-100 rounded-[24px] flex items-center justify-center overflow-hidden border-4 border-white shadow-md">
            {user.basic.profilePhoto ? (
              <img src={user.basic.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl">👤</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1 rounded-lg border-2 border-white">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
        </div>
        <div className="ml-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-gray-900 leading-none">{user.basic.fullName || 'New Resident'}</h2>
            {user.trust.badges.includes('Verified') && (
              <div className="bg-blue-500 text-white p-0.5 rounded-full">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1 uppercase tracking-tight">⭐ {user.trust.rating} Resident Rating</p>
        </div>
      </div>

      {/* Segmented Control */}
      <div className="flex bg-gray-100 p-1.5 rounded-2xl mb-8">
        <button 
          onClick={() => setActiveSubTab('public')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'public' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
        >
          Public Info
        </button>
        <button 
          onClick={() => setActiveSubTab('secure')}
          className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${activeSubTab === 'secure' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500'}`}
        >
          Secure & Trust
        </button>
      </div>

      {/* Sections */}
      {activeSubTab === 'public' ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="space-y-4">
            <ProfileField label="Profession" value={user.basic.profession} placeholder="e.g. Software Engineer" />
            <ProfileField label="Bio" value={user.basic.bio} isTextArea placeholder="Tell us about yourself..." />
            <ProfileField label="Current Neighborhood" value={user.basic.currentAddress} placeholder="e.g. Uttara Sector 4" />
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Verification Status */}
          <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-3xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-indigo-900">NID Verification</h4>
              {user.trust.nidFrontImage ? (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold">Pending Review</span>
              ) : (
                <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-lg text-[10px] font-bold">Action Required</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-indigo-100 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                Front Side
              </div>
              <div className="h-24 bg-indigo-100 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                Back Side
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ProfileField 
              label="Mobile Number" 
              value={user.secure.mobile} 
              isVerified={user.secure.mobileVerified} 
              placeholder="017XXXXXXXX"
            />
            <ProfileField label="Email Address" value={user.secure.email} placeholder="name@example.com" />
            <ProfileField label="Emergency Contact" value={user.trust.emergencyContact} placeholder="Relative's Number" />
            <div className="pt-4 border-t border-gray-100">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Social Connections</label>
               <div className="flex gap-4">
                  <div className="flex-1 bg-gray-50 p-3 rounded-2xl text-[10px] font-bold text-gray-400 text-center">LinkedIn 🔗</div>
                  <div className="flex-1 bg-gray-50 p-3 rounded-2xl text-[10px] font-bold text-gray-400 text-center">Facebook 🔗</div>
               </div>
            </div>
          </div>
        </div>
      )}

      <button className="w-full py-4 mt-8 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-gray-200 transition-transform active:scale-95">
        Save All Changes
      </button>
    </div>
  );
};

const ProfileField: React.FC<{ 
  label: string; 
  value: string; 
  placeholder: string;
  isTextArea?: boolean;
  isVerified?: boolean;
}> = ({ label, value, placeholder, isTextArea, isVerified }) => (
  <div>
    <div className="flex justify-between items-center mb-1.5 px-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</label>
      {isVerified && <span className="text-[10px] text-green-600 font-bold">Verified ✓</span>}
    </div>
    {isTextArea ? (
      <textarea 
        placeholder={placeholder}
        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-400 text-sm font-medium min-h-[100px] resize-none"
        defaultValue={value}
      />
    ) : (
      <input 
        type="text" 
        placeholder={placeholder}
        className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-400 text-sm font-medium transition-all"
        defaultValue={value}
      />
    )}
  </div>
);

export default ProfileTab;
