
import { AreaReview, Property } from './types';

export const MOCK_REVIEWS: AreaReview[] = [
  {
    id: 'rev_1',
    userId: 'u1',
    userName: 'Tanvir Hossain',
    userAvatar: 'https://i.pravatar.cc/150?u=u1',
    areaName: 'Mirpur 10',
    comment: 'The connectivity is amazing with the Metro. However, noise levels are quite high during the day. Water supply is 24/7.',
    ratings: {
      safety: 4,
      waterGas: 5,
      transport: 5,
      cleanliness: 3
    },
    benefits: {
      nearbyMosque: true,
      closeToMarket: true,
      cctvSecured: false,
      parksOpenSpace: false,
      goodInternet: true
    },
    photos: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=400'],
    helpfulCount: 24,
    tags: ['Convenient', 'Metro Access', 'Noisy'],
    timestamp: '2024-05-15T10:30:00Z',
    status: 'approved',
    isGpsVerified: true,
    posterVerificationLevel: 'nid'
  },
  {
    id: 'rev_2',
    userId: 'u2',
    userName: 'Nusrat Jahan',
    userAvatar: 'https://i.pravatar.cc/150?u=u2',
    areaName: 'Dhanmondi 32',
    comment: 'Very safe for evening walks. The lake is nearby. We do face occasional gas issues in winter, but electricity is stable.',
    ratings: {
      safety: 5,
      waterGas: 3,
      transport: 4,
      cleanliness: 5
    },
    benefits: {
      nearbyMosque: true,
      closeToMarket: true,
      cctvSecured: true,
      parksOpenSpace: true,
      goodInternet: true
    },
    photos: ['https://images.unsplash.com/photo-1544984243-ea5424422cfe?auto=format&fit=crop&q=80&w=400'],
    helpfulCount: 42,
    tags: ['Safe at Night', 'Clean', 'Parks'],
    timestamp: '2024-05-10T08:15:00Z',
    status: 'approved',
    isGpsVerified: false,
    posterVerificationLevel: 'phone'
  }
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'prop_1',
    title: 'Modern 3-Bedroom Flat in Mirpur',
    address: 'House 12, Road 4, Mirpur 10, Dhaka',
    price: 22000,
    advance: 44000,
    type: 'Full Flat',
    bedrooms: 3,
    bathrooms: 2,
    floor: 4,
    isBachelorFriendly: true,
    isPetFriendly: false,
    gasType: 'Pipeline',
    amenities: {
      lineGas: true,
      lift: true,
      generator: true,
      wifi: true,
      cctv: true,
      parking: true
    },
    coordinates: { lat: 23.8103, lng: 90.4125 },
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800',
    description: 'Beautifully designed flat with ample natural light. Located in a quiet residential area with easy access to the Metro Rail.',
    landlord: {
      id: 'landlord_1',
      name: 'Rahat Ahmed',
      verified: true,
      rating: 4.8
    },
    neighborhood: 'Mirpur 10',
    availability: true,
    createdAt: new Date().toISOString()
  }
];
