
/**
 * THIKANA NOTIFICATION SERVICE
 * Handles Firebase Cloud Messaging (FCM) Setup & Listening
 */

import { NotificationPayload } from '../types';

// Mocking Firebase SDK for the web environment
export const requestNotificationPermission = async (): Promise<string | null> => {
  if (!('Notification' in window)) {
    console.warn("This browser does not support notifications.");
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    // In a real app: return await messaging.getToken();
    const mockToken = "fcm_token_" + Math.random().toString(36).substr(2, 9);
    console.log("FCM Token Generated:", mockToken);
    return mockToken;
  }
  return null;
};

/**
 * BACKEND TRIGGER (NODE.JS / FIREBASE FUNCTIONS)
 * Use this logic in your server-side environment
 * 
 * const admin = require('firebase-admin');
 * 
 * async function sendPushNotification(token, payload) {
 *   const message = {
 *     notification: {
 *       title: payload.senderName,
 *       body: payload.isPrivate ? "New Message" : payload.text,
 *     },
 *     data: {
 *       click_action: "FLUTTER_NOTIFICATION_CLICK",
 *       roomId: payload.roomId,
 *       type: payload.type
 *     },
 *     android: {
 *       notification: {
 *         sound: 'premium_chime.mp3',
 *         channel_id: 'chat_messages'
 *       }
 *     },
 *     token: token
 *   };
 * 
 *   return admin.messaging().send(message);
 * }
 */

/**
 * MOBILE SDK LISTENER (FLUTTER SNIPPET)
 * 
 * FirebaseMessaging.onMessage.listen((RemoteMessage message) {
 *   print('Got a message whilst in the foreground!');
 *   if (message.notification != null) {
 *     // Show custom In-App UI
 *     showLocalNotification(message);
 *   }
 * });
 * 
 * FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
 *   print('A new onMessageOpenedApp event was published!');
 *   String? roomId = message.data['roomId'];
 *   if (roomId != null) {
 *     Navigator.pushNamed(context, '/chat', arguments: roomId);
 *   }
 * });
 */

export const triggerSimulatedNotification = (
  type: 'message' | 'call',
  onArrive: (payload: NotificationPayload) => void
) => {
  // Simulating a delay for a network-pushed notification
  setTimeout(() => {
    const payload: NotificationPayload = {
      id: Date.now().toString(),
      type,
      title: type === 'message' ? "Rahat Ahmed" : "Incoming Call",
      body: type === 'message' ? "Is the rent negotiable? Let's talk." : "Rahat Ahmed is calling...",
      senderName: "Rahat Ahmed",
      senderAvatar: null,
      isPrivate: false,
      data: {
        roomId: "room_mock_prop_1"
      }
    };
    onArrive(payload);
    
    // Play Custom Sound (Suggested: Soft luxury chime)
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(e => console.log("Audio play blocked"));

    // Trigger Browser Native Notification if backgrounded
    if (Notification.permission === 'granted') {
      new Notification(payload.title, {
        body: payload.body,
        icon: '/favicon.ico'
      });
    }
  }, 3000);
};
