
import React, { useState, useEffect } from 'react';
import { MOCK_REVIEWS } from '../constants';
import { AreaReview, AreaBenefits, UserProfile } from '../types';

interface Props {
  user: UserProfile;
}

const CommunityView: React.FC<Props> = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddReview, setShowAddReview] = useState(false);
  const [showVerificationAlert, setShowVerificationAlert] = useState(false);
  const [reviews, setReviews] = useState<AreaReview[]>(MOCK_REVIEWS);

  // Logic: Only Verified Users can post
  const isUserVerified = user.secure.mobileVerified || user.trust.nidVerified;

  const filteredReviews = reviews.filter(rev => {
    // Only show approved posts OR the user's own pending posts
    const isVisible = rev.status === 'approved' || rev.userId === user.id;
    const matchesSearch = rev.areaName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rev.comment.toLowerCase().includes(searchQuery.toLowerCase());
    return isVisible && matchesSearch;
  });

  const handleAddReviewClick = () => {
    if (isUserVerified) {
      setShowAddReview(true);
    } else {
      setShowVerificationAlert(true);
    }
  };

  const handleHelpful = (id: string) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, helpfulCount: r.helpfulCount + 1 } : r));
  };

  return (
    <div className="px-6 py-6 pb-24 relative min-h-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Community</h2>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Neighborhood Vibe</p>
        </div>
        <div className="text-right">
           <div className="bg-indigo-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg">
             {filteredReviews.length} Active Insights
           </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search by area..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-indigo-400 text-sm font-medium transition-all"
          />
          <svg className="w-5 h-5 text-gray-300 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="space-y-6">
        {filteredReviews.map(review => (
          <ReviewCard 
            key={review.id} 
            review={review} 
            isOwnPost={review.userId === user.id}
            onHelpful={() => handleHelpful(review.id)}
          />
        ))}
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={handleAddReviewClick}
        className="fixed bottom-28 right-8 w-14 h-14 bg-gray-900 text-white rounded-2xl shadow-2xl flex items-center justify-center text-2xl transition-transform active:scale-95 z-50 hover:bg-indigo-600"
      >
        +
      </button>

      {/* Verification Alert Modal */}
      {showVerificationAlert && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-[32px] p-8 w-full max-w-xs text-center shadow-2xl">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl">🛡️</div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Verification Required</h3>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">Only verified neighbors can post reviews to maintain community trust.</p>
              <button 
                onClick={() => setShowVerificationAlert(false)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl"
              >
                Get Verified Now
              </button>
              <button 
                onClick={() => setShowVerificationAlert(false)}
                className="mt-3 text-[10px] text-gray-400 font-bold uppercase"
              >
                Maybe Later
              </button>
           </div>
        </div>
      )}

      {showAddReview && (
        <WriteReviewModal 
          user={user}
          onClose={() => setShowAddReview(false)} 
          onSubmit={(newReview) => {
            setReviews([newReview, ...reviews]);
            setShowAddReview(false);
          }}
        />
      )}
    </div>
  );
};

const WriteReviewModal: React.FC<{ user: UserProfile; onClose: () => void; onSubmit: (r: AreaReview) => void }> = ({ user, onClose, onSubmit }) => {
  const [area, setArea] = useState('');
  const [comment, setComment] = useState('');
  const [ratings, setRatings] = useState({ safety: 0, waterGas: 0, transport: 0, cleanliness: 0 });
  const [isLocating, setIsLocating] = useState(false);
  const [benefits, setBenefits] = useState<AreaBenefits>({
    nearbyMosque: false,
    closeToMarket: false,
    cctvSecured: false,
    parksOpenSpace: false,
    goodInternet: false
  });
  const [photos, setPhotos] = useState<string[]>([]);

  const handleToggleBenefit = (key: keyof AreaBenefits) => {
    setBenefits({ ...benefits, [key]: !benefits[key] });
  };

  const handleSubmit = async () => {
    if (!area || !comment) return;

    setIsLocating(true);
    
    // Logic 2: Location Check (GPS Verification)
    let isGpsVerified = false;
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      // Prototype logic: if we got a position, we assume they are in the area for this mock
      if (position.coords.latitude) isGpsVerified = true;
    } catch (e) {
      console.warn("GPS Access Denied");
    }

    // Logic 3: Admin Approval for photos
    const status = photos.length > 0 ? 'pending' : 'approved';

    const newReview: AreaReview = {
      id: `rev_${Date.now()}`,
      userId: user.id,
      userName: user.basic.fullName,
      userAvatar: user.basic.profilePhoto,
      areaName: area,
      comment,
      ratings,
      benefits,
      photos: photos.length > 0 ? photos : undefined,
      helpfulCount: 0,
      tags: [],
      timestamp: new Date().toISOString(),
      status: status,
      isGpsVerified: isGpsVerified,
      posterVerificationLevel: user.trust.nidVerified ? 'nid' : 'phone'
    };

    setIsLocating(false);
    onSubmit(newReview);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-y-auto max-h-[90vh] hide-scrollbar relative">
        <div className="sticky top-0 bg-white p-8 pb-4 z-10 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-black text-gray-900 leading-tight">Write Insight</h3>
            <div className="flex items-center gap-1.5 mt-1">
               <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
               <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Verified Poster Account</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-50 rounded-full text-gray-400">✕</button>
        </div>

        <div className="p-8 space-y-8">
          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Area Name</label>
            <input 
              type="text" 
              placeholder="e.g. Uttara Sector 10" 
              value={area}
              onChange={e => setArea(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-400 text-sm font-bold" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <StarSelector label="Safety" value={ratings.safety} onChange={v => setRatings({...ratings, safety: v})} />
            <StarSelector label="Water & Gas" value={ratings.waterGas} onChange={v => setRatings({...ratings, waterGas: v})} />
            <StarSelector label="Transport" value={ratings.transport} onChange={v => setRatings({...ratings, transport: v})} />
            <StarSelector label="Cleanliness" value={ratings.cleanliness} onChange={v => setRatings({...ratings, cleanliness: v})} />
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block px-1">Benefits</label>
            <div className="flex flex-wrap gap-2">
              <BenefitCheckbox label="Nearby Mosque" icon="🕌" active={benefits.nearbyMosque} onClick={() => handleToggleBenefit('nearbyMosque')} />
              <BenefitCheckbox label="Close to Market" icon="🛒" active={benefits.closeToMarket} onClick={() => handleToggleBenefit('closeToMarket')} />
              <BenefitCheckbox label="CCTV Secured" icon="📹" active={benefits.cctvSecured} onClick={() => handleToggleBenefit('cctvSecured')} />
              <BenefitCheckbox label="Parks / Green" icon="🌳" active={benefits.parksOpenSpace} onClick={() => handleToggleBenefit('parksOpenSpace')} />
              <BenefitCheckbox label="Good Internet" icon="📶" active={benefits.goodInternet} onClick={() => handleToggleBenefit('goodInternet')} />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Detailed Description</label>
            <textarea 
              placeholder="What do you love about this area?" 
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-indigo-400 text-sm h-32 resize-none font-medium" 
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-3 px-1">
               <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add Photos (Max 3)</label>
               <span className="text-[8px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md font-black uppercase">Requires Approval</span>
            </div>
            <div className="flex gap-3">
               {[0,1,2].map(i => (
                 <button 
                  key={i} 
                  onClick={() => setPhotos([...photos, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400'])}
                  className={`w-16 h-16 bg-gray-50 border-2 border-dashed rounded-2xl flex items-center justify-center transition-all ${photos[i] ? 'border-indigo-400 bg-indigo-50 text-indigo-400' : 'border-gray-200 text-gray-300'}`}
                 >
                    <span className="text-xl">{photos[i] ? '✅' : '📸'}</span>
                 </button>
               ))}
            </div>
          </div>

          <button 
            onClick={handleSubmit}
            disabled={isLocating}
            className="w-full py-5 bg-gray-900 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            {isLocating && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {isLocating ? 'Verifying GPS...' : 'Post Community Insight'}
          </button>
        </div>
      </div>
    </div>
  );
};

const ReviewCard: React.FC<{ review: AreaReview; isOwnPost: boolean; onHelpful: () => void }> = ({ review, isOwnPost, onHelpful }) => {
  const averageRating = (
    review.ratings.safety + 
    review.ratings.waterGas + 
    review.ratings.transport + 
    review.ratings.cleanliness
  ) / 4;

  const [hasUpvoted, setHasUpvoted] = useState(false);

  const handleUpvote = () => {
    if (!hasUpvoted) {
      setHasUpvoted(true);
      onHelpful();
    }
  };

  return (
    <div className={`bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 transition-all relative group overflow-hidden ${review.status === 'pending' ? 'opacity-70 grayscale' : ''}`}>
      
      {/* Pending Approval Overlay */}
      {review.status === 'pending' && isOwnPost && (
        <div className="absolute top-0 right-0 bg-orange-500 text-white px-4 py-1.5 rounded-bl-2xl text-[9px] font-black uppercase tracking-widest z-10">
          Pending Admin Approval
        </div>
      )}

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl overflow-hidden shadow-inner flex-shrink-0">
             {review.userAvatar ? (
               <img src={review.userAvatar} alt={review.userName} className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full flex items-center justify-center text-indigo-400 font-bold text-lg">👤</div>
             )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
               <h4 className="text-sm font-black text-gray-900">{review.userName}</h4>
               {review.posterVerificationLevel === 'nid' && (
                 <span className="text-blue-500" title="NID Verified Resident">
                   <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" /></svg>
                 </span>
               )}
            </div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{new Date(review.timestamp).toLocaleDateString('en-GB')}</p>
          </div>
        </div>
        <div className="bg-indigo-600 text-white w-14 h-14 rounded-2xl flex flex-col items-center justify-center shadow-lg flex-shrink-0 transition-transform group-hover:scale-105">
           <span className="text-lg font-black leading-none">{averageRating.toFixed(1)}</span>
           <span className="text-[8px] font-bold uppercase opacity-80 mt-1">Rating</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-[10px] text-indigo-500 font-black uppercase tracking-[0.15em]">{review.areaName}</p>
          {review.isGpsVerified && (
            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider flex items-center gap-1 border border-green-100">
               <span className="text-[10px]">📍</span> Verified Local Resident
            </span>
          )}
        </div>
        <p className="text-base text-gray-700 leading-relaxed font-medium">"{review.comment}"</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {review.ratings.safety >= 4 && <Badge label="Safe Neighborhood" color="bg-green-100 text-green-700" icon="🛡️" />}
        {review.benefits.nearbyMosque && <Badge label="Mosque Nearby" color="bg-blue-100 text-blue-700" icon="🕌" />}
        {review.benefits.goodInternet && <Badge label="High Speed Net" color="bg-indigo-100 text-indigo-700" icon="📶" />}
      </div>

      <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-8 p-6 bg-gray-50 rounded-[32px] border border-gray-100">
         <RatingRow label="Safety" score={review.ratings.safety} />
         <RatingRow label="Water & Gas" score={review.ratings.waterGas} />
      </div>

      {review.photos && review.photos.length > 0 && (
        <div className="flex gap-2 mb-8 overflow-x-auto hide-scrollbar">
          {review.photos.map((url, i) => (
            <img key={i} src={url} alt="Area" className="w-24 h-24 object-cover rounded-2xl border border-white shadow-sm flex-shrink-0" />
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <button 
          onClick={handleUpvote}
          disabled={review.status === 'pending'}
          className={`flex items-center gap-3 px-6 py-3 rounded-full transition-all ${hasUpvoted ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'}`}
        >
          <span className="text-lg">👍</span>
          <span className="text-xs font-black uppercase tracking-widest">{hasUpvoted ? 'Vouched!' : 'Helpful'}</span>
          <span className="text-[10px] opacity-60 font-black">{review.helpfulCount}</span>
        </button>
      </div>
    </div>
  );
};

const Badge: React.FC<{ label: string; color: string; icon: string }> = ({ label, color, icon }) => (
  <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${color} border border-white shadow-sm`}>
    <span>{icon}</span> {label}
  </span>
);

const RatingRow: React.FC<{ label: string; score: number }> = ({ label, score }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center px-1">
       <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
       <span className="text-[9px] font-black text-indigo-600">{score}/5</span>
    </div>
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= score ? 'bg-indigo-500' : 'bg-gray-200'}`} />
      ))}
    </div>
  </div>
);

const BenefitCheckbox: React.FC<{ label: string; icon: string; active: boolean; onClick: () => void }> = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-3 rounded-2xl flex items-center gap-2 border-2 transition-all ${active ? 'bg-indigo-50 border-indigo-600 text-indigo-900' : 'bg-white border-gray-100 text-gray-400'}`}>
    <span className="text-sm">{icon}</span>
    <span className="text-[9px] font-black uppercase tracking-wider">{label}</span>
  </button>
);

const StarSelector: React.FC<{ label: string; value: number; onChange: (v: number) => void }> = ({ label, value, onChange }) => (
  <div className="bg-gray-50 p-4 rounded-3xl border border-gray-100">
    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5 block px-1">{label}</label>
    <div className="flex justify-between">
      {[1,2,3,4,5].map(i => (
        <button key={i} onClick={() => onChange(i)} className={`w-8 h-8 rounded-xl text-xs flex items-center justify-center transition-all ${i <= value ? 'bg-indigo-600 text-white scale-110 shadow-lg' : 'bg-white text-gray-400'}`}>
          {i}
        </button>
      ))}
    </div>
  </div>
);

export default CommunityView;
