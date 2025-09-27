import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import type { ChatMessage } from '../types';
// REMOVE the direct auth import, we will get it from the context now
import { db } from '../services/firebase';
import { doc, onSnapshot, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext'; // IMPORT the useAuth hook

interface EventChatProps {
    eventId: string;
    onClose: () => void;
}

export const EventChat: React.FC<EventChatProps> = ({ eventId, onClose }) => {
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const { user } = useAuth(); // GET the user from our reliable context

    // Scroll to bottom whenever messages change
    useEffect(() => {
        const chatBody = document.getElementById('chat-body');
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }, [messages]);

    // EventChat.tsx

    // Fetch messages in real-time
    useEffect(() => {
        const chatDocRef = doc(db, 'chats', eventId);

        // This function first ensures the document exists, then listens to it.
        const setupListener = async () => {
            // 1. Check if the document exists
            const docSnap = await getDoc(chatDocRef);

            // 2. If it doesn't exist, create it with an empty messages array
            if (!docSnap.exists()) {
                await setDoc(chatDocRef, { messages: [] });
            }

            // 3. Now that we know the doc exists, attach the real-time listener
            const unsubscribe = onSnapshot(chatDocRef, (doc) => {
                if (doc.exists() && doc.data().messages) {
                    const messagesWithDates = doc.data().messages.map((msg: any) => ({
                        ...msg,
                        timestamp: msg.timestamp.toDate(),
                    }));
                    setMessages(messagesWithDates);
                }
            });

            return unsubscribe;
        };

        let unsubscribe: (() => void) | undefined;
        setupListener().then(unsub => {
            if (unsub) {
                unsubscribe = unsub;
            }
        });

        // Cleanup the listener when the component unmounts
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [eventId]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        // The user object is now guaranteed to be valid here
        if (!newMessage.trim() || !user) return;

        const chatDocRef = doc(db, 'chats', eventId);

        const messageData: ChatMessage = {
            id: uuidv4(),
            text: newMessage,
            senderId: user.uid,
            senderName: user.displayName || 'Anonymous',
            senderAvatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/100`,
            timestamp: new Date(),
        };

        try {
            await updateDoc(chatDocRef, {
                messages: arrayUnion(messageData)
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message:", error);
            alert("Failed to send message.");
        }
    };

    return (
        <div className="absolute inset-0 z-40 bg-white dark:bg-dark-bg flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-bold">Event Chat</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface">
                    <Icon name="xCircle" className="w-6 h-6" />
                </button>
            </div>

            {/* Message List */}
            <div id="chat-body" className="flex-grow p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.length > 0 ? messages.map((msg) => (
                        <div key={msg.id} className={`flex items-start space-x-3 ${msg.senderId === user?.uid ? 'justify-end' : ''}`}>
                            {msg.senderId !== user?.uid && <img src={msg.senderAvatar} alt={msg.senderName} className="w-10 h-10 rounded-full object-cover" />}
                            <div className={`flex flex-col ${msg.senderId === user?.uid ? 'items-end' : 'items-start'}`}>
                                <p className="text-sm font-semibold">{msg.senderId === user?.uid ? 'You' : msg.senderName}</p>
                                <div className={`p-3 rounded-lg mt-1 max-w-xs ${msg.senderId === user?.uid ? 'bg-brand-purple text-white' : 'bg-gray-100 dark:bg-dark-surface'}`}>
                                    <p>{msg.text}</p>
                                </div>
                            </div>
                            {msg.senderId === user?.uid && <img src={msg.senderAvatar} alt={msg.senderName} className="w-10 h-10 rounded-full object-cover" />}
                        </div>
                    )) : (
                        <p className="text-center text-gray-500">No messages yet. Be the first to say something!</p>
                    )}
                </div>
            </div>

            {/* Message Input Form */}
            <div className="flex-shrink-0 p-4 border-t dark:border-gray-700 bg-white dark:bg-dark-bg">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full input-style"
                    />
                    <button type="submit" className="p-3 bg-brand-purple dark:bg-brand-teal text-white rounded-full flex-shrink-0">
                        <Icon name="arrowLeft" className="w-6 h-6 transform rotate-180" />
                    </button>
                </form>
            </div>
        </div>
    );
};