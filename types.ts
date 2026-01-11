
export type GasType = 'Pipeline' | 'LPG' | 'Cylinder';
export type PropertyType = 'Full Flat' | 'Room' | 'Sublet' | 'Mess';

export interface Amenities {
  lineGas: boolean;
  lift: boolean;
  generator: boolean;
  wifi: boolean;
  cctv: boolean;
  parking: boolean;
}

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  advance: number;
  type: PropertyType;
  bedrooms: number;
  bathrooms: number;
  floor: number;
  isBachelorFriendly: boolean;
  isPetFriendly: boolean;
  gasType: GasType;
  amenities: Amenities;
  coordinates: { lat: number; lng: number };
  image: string;
  videoUrl?: string;
  description: string;
  specialInstructions?: string;
  landlord: {
    id: string;
    name: string;
    verified: boolean;
    rating: number;
  };
  neighborhood: string;
  availability: boolean;
  createdAt: string;
  neighborhoodScore?: {
    markets: number;
    mosques: number;
    transport: number;
    total: number;
  };
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  type: 'text' | 'quote' | 'image';
}

export interface ChatRoom {
  id: string;
  participants: string[];
  landlordId: string;
  landlordName: string;
  landlordVerified: boolean;
  propertyId: string;
  propertyTitle: string;
  propertyPrice: number;
  lastMessage: string;
  updatedAt: string;
  messages: Message[];
}

export interface NotificationPayload {
  id: string;
  type: 'message' | 'call';
  title: string;
  body: string;
  senderName: string;
  senderAvatar: string | null;
  data: {
    roomId?: string;
    propertyId?: string;
    callId?: string;
  };
  isPrivate: boolean;
}

export interface UserProfile {
  id: string;
  basic: {
    fullName: string;
    profilePhoto: string | null;
    bio: string;
    currentAddress: string;
    profession: string;
  };
  secure: {
    mobile: string;
    mobileVerified: boolean;
    email: string;
    socialLinks: {
      facebook?: string;
      linkedin?: string;
    };
  };
  trust: {
    nidNumber: string;
    nidVerified: boolean;
    nidFrontImage: string | null;
    nidBackImage: string | null;
    emergencyContact: string;
    rating: number;
    badges: string[];
  };
}

export interface NeighborhoodVibe {
  description: string;
  markets: string[];
  mosques: string[];
  transport: string[];
  safetyScore: number;
}

export interface PaymentRecord {
  month: string;
  amount: number;
  status: 'Paid' | 'Overdue' | 'Pending';
}

// Added missing AreaBenefits interface to fix export error
export interface AreaBenefits {
  nearbyMosque: boolean;
  closeToMarket: boolean;
  cctvSecured: boolean;
  parksOpenSpace: boolean;
  goodInternet: boolean;
}

// Added missing AreaReview interface to fix export error
export interface AreaReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string | null;
  areaName: string;
  comment: string;
  ratings: {
    safety: number;
    waterGas: number;
    transport: number;
    cleanliness: number;
  };
  benefits: AreaBenefits;
  photos?: string[];
  helpfulCount: number;
  tags: string[];
  timestamp: string;
  status: 'approved' | 'pending' | 'rejected';
  isGpsVerified: boolean;
  posterVerificationLevel: 'none' | 'phone' | 'nid';
}
