import React, { createContext, useState, useEffect, ReactNode, useContext, useCallback, useRef } from 'react';
import { InAppNotification } from '../types';
import { getNotifications, markAllNotificationsAsRead } from '../services/mockApi';
import { NOTIFICATION_SOUND_BASE64 } from '../assets/notification';

interface NotificationContextType {
  notifications: InAppNotification[];
  unreadCount: number;
  markAllAsRead: () => void;
  fetchNotifications: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const notificationSoundBuffer = useRef<AudioBuffer | null>(null);
  const lastNotificationCount = useRef(0);

  const fetchNotifications = useCallback(async () => {
    const fetchedNotifications = await getNotifications();
    const newUnreadCount = fetchedNotifications.filter(n => !n.read).length;

    setNotifications(fetchedNotifications);
    setUnreadCount(newUnreadCount);
    
    // Play sound if there's a new notification
    if (fetchedNotifications.length > lastNotificationCount.current && newUnreadCount > 0) {
        playSound();
    }
    lastNotificationCount.current = fetchedNotifications.length;
  }, []);

  // Initialize Audio and load sound
  useEffect(() => {
    // AudioContext is created on user interaction, which we'll simulate here on load
    const initAudio = async () => {
        try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            const response = await fetch(`data:audio/wav;base64,${NOTIFICATION_SOUND_BASE64}`);
            const arrayBuffer = await response.arrayBuffer();
            notificationSoundBuffer.current = await audioContextRef.current.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error('Error initializing audio:', e);
        }
    };
    initAudio();
  }, []);
  
  const playSound = () => {
    if (!audioContextRef.current || !notificationSoundBuffer.current) return;
    
    // Resume context if it was suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = notificationSoundBuffer.current;
    source.connect(audioContextRef.current.destination);
    source.start(0);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // Poll for new notifications every 15 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    await markAllNotificationsAsRead();
    fetchNotifications();
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, fetchNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
