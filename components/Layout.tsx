import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  theme?: 'light' | 'dark' | 'black';
  onToggleTheme?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, theme, onToggleTheme }) => {
  const tabs = [
    { id: 'explore', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z', label: 'Home' },
    { id: 'community', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z', label: 'Vibe' },
    { id: 'post', icon: 'M12 4v16m8-8H4', label: 'Post' },
    { id: 'chat', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', label: 'Inbox' },
    { id: 'profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', label: 'Self' },
  ];

  const getThemeIcon = () => {
    if (theme === 'light') return '🔆';
    if (theme === 'dark') return '🌗';
    return '🌑';
  };

  return (
    <div className="h-screen w-full flex flex-col bg-background max-w-md mx-auto relative shadow-2xl overflow-hidden border-x border-border transition-colors duration-500">
      {/* Dynamic Stylized Header */}
      <header className="px-8 pt-10 pb-6 bg-background/80 backdrop-blur-xl sticky top-0 z-50 flex justify-between items-center border-b border-border/40">
        <div>
          <h1 className="text-4xl font-black text-text-primary tracking-tighter transition-colors leading-none mb-1">ঠিকানা।</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
            <p className="text-[9px] text-text-secondary font-black uppercase tracking-[0.2em] transition-colors">Local Living</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onToggleTheme}
            className="w-12 h-12 flex items-center justify-center bg-surface border border-border rounded-full premium-shadow active:scale-90 transition-all text-xl"
          >
            {getThemeIcon()}
          </button>
          <div className="relative">
            <button className="w-12 h-12 flex items-center justify-center bg-surface border border-border rounded-full premium-shadow active:scale-90 transition-all">
              <svg className="w-6 h-6 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            <span className="absolute top-0 right-0 w-3 h-3 bg-brand-500 border-2 border-surface rounded-full"></span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto hide-scrollbar pb-32">
        {children}
      </main>

      {/* Boutique Floating Nav */}
      <nav className="absolute bottom-6 left-6 right-6 glass-nav z-50 px-6 py-4 rounded-[32px] border border-border premium-shadow">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`group flex flex-col items-center justify-center transition-all ${
                activeTab === tab.id ? 'text-brand-500' : 'text-text-secondary opacity-40 hover:opacity-100'
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all ${activeTab === tab.id ? 'bg-brand-500/10' : ''}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === tab.id ? 2.5 : 2} d={tab.icon} />
                </svg>
              </div>
              <span className={`text-[8px] mt-1 font-black uppercase tracking-tighter transition-all ${activeTab === tab.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}`}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Layout;