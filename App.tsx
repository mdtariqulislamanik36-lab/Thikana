
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import CommunityView from './components/CommunityView';
import PostListingView from './components/PostListingView';
import ProfileTab from './components/ProfileTab';
import ExploreView from './components/ExploreView';
import PropertyDetail from './components/PropertyDetail';
import ChatView from './components/ChatView';
import NotificationToast from './components/NotificationToast';
import { UserProfile, Property, NotificationPayload } from './types';
import { requestNotificationPermission, triggerSimulatedNotification } from './services/notificationService';

type ThemeType = 'light' | 'dark' | 'black';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('explore');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string | null>(null);
  const [notification, setNotification] = useState<NotificationPayload | null>(null);
  const [theme, setTheme] = useState<ThemeType>(() => {
    return (localStorage.getItem('thikana_theme') as ThemeType) || 'light';
  });
  
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user_001',
    basic: {
      fullName: 'Tamim Iqbal',
      profilePhoto: null,
      bio: 'Professional Software Engineer looking for a quiet workspace.',
      currentAddress: 'Bashundhara R/A, Block C',
      profession: 'Software Engineer',
    },
    secure: {
      mobile: '01712345678',
      mobileVerified: true,
      email: 'tamim.iqbal@example.com',
      socialLinks: {},
    },
    trust: {
      nidNumber: '1995XXXXXXXXXX',
      nidVerified: true,
      nidFrontImage: null,
      nidBackImage: null,
      emergencyContact: '018XXXXXXXX',
      rating: 4.9,
      badges: ['Verified', 'Early Adopter'],
    }
  });

  // Handle Notifications Setup
  useEffect(() => {
    requestNotificationPermission();

    // Simulation: A message arrives after 8 seconds of app usage
    triggerSimulatedNotification('message', (payload) => {
      // Logic: If user is already in THAT chat room, don't show toast
      if (activeChatRoomId !== payload.data.roomId) {
        setNotification(payload);
      }
    });
  }, [activeChatRoomId]);

  // Handle Theme Side Effects
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'black-mode');
    
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'black') {
      root.classList.add('dark', 'black-mode');
    }
    
    localStorage.setItem('thikana_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'black';
      return 'light';
    });
  };

  const handleStartChat = (propId: string, landlordId: string) => {
    const mockRoomId = `room_mock_${propId}`; 
    setSelectedProperty(null);
    setActiveChatRoomId(mockRoomId);
    setActiveTab('chat');
  };

  const handleNotificationClick = (payload: NotificationPayload) => {
    if (payload.data.roomId) {
      setActiveChatRoomId(payload.data.roomId);
      setActiveTab('chat');
      setSelectedProperty(null);
    }
    setNotification(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'explore':
        return <ExploreView onPropertyClick={setSelectedProperty} />;
      case 'community':
        return <CommunityView user={currentUser} />;
      case 'post':
        return <PostListingView />;
      case 'chat':
        return (
          <ChatView 
            user={currentUser} 
            activeRoomId={activeChatRoomId} 
            onCloseRoom={() => setActiveChatRoomId(null)} 
          />
        );
      case 'profile':
        return <ProfileTab user={currentUser} onUpdate={setCurrentUser} />;
      default:
        return <ExploreView onPropertyClick={setSelectedProperty} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      theme={theme} 
      onToggleTheme={toggleTheme}
    >
      {notification && (
        <NotificationToast 
          payload={notification} 
          onClose={() => setNotification(null)}
          onClick={handleNotificationClick}
        />
      )}

      {renderContent()}
      
      {selectedProperty && (
        <PropertyDetail 
          property={selectedProperty} 
          user={currentUser}
          onBack={() => setSelectedProperty(null)} 
          onStartChat={handleStartChat}
        />
      )}
    </Layout>
  );
};

export default App;
