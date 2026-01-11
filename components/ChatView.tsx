
import React, { useState, useEffect, useRef } from 'react';
import { ChatRoom, Message, UserProfile } from '../types';

interface Props {
  user: UserProfile;
  activeRoomId: string | null;
  onCloseRoom: () => void;
}

const ChatView: React.FC<Props> = ({ user, activeRoomId, onCloseRoom }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([
    {
      id: 'room_mock_prop_1',
      participants: [user.id, 'landlord_1'],
      landlordId: 'landlord_1',
      landlordName: 'Rahat Ahmed',
      landlordVerified: true,
      propertyId: 'prop_1',
      propertyTitle: 'Modern 3-Bedroom Flat',
      propertyPrice: 22000,
      lastMessage: 'Hello! Is the rent negotiable?',
      updatedAt: new Date().toISOString(),
      messages: [
        { id: 'm1', senderId: user.id, text: 'Hi, I saw your post in Mirpur.', timestamp: new Date().toISOString(), type: 'text' },
        { id: 'm2', senderId: 'landlord_1', text: 'Hello! Yes, it is still available.', timestamp: new Date().toISOString(), type: 'text' }
      ]
    }
  ]);

  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(activeRoomId);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeRoomId) {
      setSelectedRoomId(activeRoomId);
    }
  }, [activeRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedRoomId, rooms]);

  const activeRoom = rooms.find(r => r.id === selectedRoomId);

  const handleSendMessage = (text: string, type: 'text' | 'quote' = 'text') => {
    if (!text.trim() || !selectedRoomId) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      text: text,
      timestamp: new Date().toISOString(),
      type: type
    };

    setRooms(prev => prev.map(r => 
      r.id === selectedRoomId 
        ? { ...r, messages: [...r.messages, newMessage], lastMessage: text, updatedAt: new Date().toISOString() } 
        : r
    ));
    setInputText('');
  };

  // 3. Quick Quote Logic
  // বাংলা: ইউজারের সুবিধার জন্য কিছু কমন প্রশ্ন চিপস আকারে রাখা হয়েছে।
  const QuickQuotes = [
    "Is the rent negotiable?",
    "When can I visit the property?",
    "Is gas bill included in rent?",
    "What is the advance amount?"
  ];

  if (selectedRoomId && activeRoom) {
    return (
      <div className="flex flex-col h-full bg-white animate-in slide-in-from-right duration-300">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button onClick={() => { setSelectedRoomId(null); onCloseRoom(); }} className="p-2 -ml-2 text-gray-400 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-xl shadow-inner">👤</div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-gray-900">{activeRoom.landlordName}</h4>
                {/* 3. Verified Badge (Green Tick) */}
                {activeRoom.landlordVerified && (
                  <span className="text-green-500" title="Verified Landlord">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{activeRoom.propertyTitle}</p>
            </div>
          </div>
          <button className="p-2 text-indigo-600 bg-indigo-50 rounded-xl">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
             </svg>
          </button>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/30">
          <div className="bg-white rounded-3xl p-4 mb-6 border border-gray-100 flex items-center gap-3 shadow-sm">
             <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shadow-sm">🏠</div>
             <div>
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Discussion Subject</p>
               <h5 className="text-xs font-black text-gray-900">{activeRoom.propertyTitle}</h5>
               <p className="text-[10px] font-bold text-indigo-600">৳{activeRoom.propertyPrice.toLocaleString()} / Month</p>
             </div>
          </div>

          {activeRoom.messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm ${
                msg.senderId === user.id 
                  ? 'bg-gray-900 text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}>
                {msg.text}
                <p className={`text-[8px] mt-1 opacity-50 font-bold uppercase ${msg.senderId === user.id ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* 3. Quick Quote Area */}
        <div className="p-4 bg-white border-t border-gray-50 pb-8">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4 pb-1">
             {QuickQuotes.map((q, i) => (
               <button 
                key={i} 
                onClick={() => handleSendMessage(q, 'quote')}
                className="px-4 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-wider rounded-xl border border-indigo-100 whitespace-nowrap active:scale-95 transition-all shadow-sm"
               >
                 {q}
               </button>
             ))}
          </div>
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 shadow-inner">
             <button className="p-2 text-gray-400 hover:text-indigo-600">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
               </svg>
             </button>
             <input 
              type="text" 
              placeholder="Type your message..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendMessage(inputText)}
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium py-2"
             />
             <button 
              onClick={() => handleSendMessage(inputText)}
              className="p-3 bg-gray-900 text-white rounded-xl shadow-lg active:scale-90 transition-all"
             >
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
               </svg>
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-6 h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Messages</h2>
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Inbox</p>
      </div>

      {rooms.length > 0 ? (
        <div className="space-y-4">
          {rooms.map(room => (
            <div 
              key={room.id}
              onClick={() => setSelectedRoomId(room.id)}
              className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 active:scale-95 transition-all cursor-pointer hover:shadow-md"
            >
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">👤</div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                   <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-black text-gray-900 truncate">{room.landlordName}</h4>
                      {room.landlordVerified && (
                        <span className="text-green-500 w-3.5 h-3.5">
                          <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        </span>
                      )}
                   </div>
                   <span className="text-[8px] font-bold text-gray-400 uppercase">{new Date(room.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-tight mb-1">{room.propertyTitle}</p>
                <p className="text-xs text-gray-500 truncate font-medium">{room.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center px-12">
          <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
             <span className="text-3xl">💬</span>
          </div>
          <p className="font-bold text-gray-600">No active conversations</p>
          <p className="text-xs text-gray-400 mt-2 leading-relaxed">Your chats with landlords will appear here. Start a conversation from any property listing.</p>
        </div>
      )}
    </div>
  );
};

export default ChatView;
