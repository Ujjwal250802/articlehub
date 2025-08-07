import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { format } from 'date-fns';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { API_BASE_URL } from '../config/api';

interface Message {
  id: number;
  userId: string;
  userName: string;
  message: string;
  timestamp: string;
  read: boolean;
  recipient: string;
}

interface ChatWidgetProps {
  isAdmin?: boolean;
}
export const ChatWidget: React.FC<ChatWidgetProps> = ({ isAdmin = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [userName, setUserName] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [users, setUsers] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, token } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchUsers = async () => {
    if (isAdmin && isAuthenticated) {
      try {
        const response = await axios.get(`${API_BASE_URL}/chat/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  const fetchUserMessages = async (username: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/userMessages/${username}`);
      setMessages(response.data.sort((a: Message, b: Message) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      ));
    } catch (error) {
      console.error('Error fetching user messages:', error);
    }
  };

  useEffect(() => {
    if (isAdmin && isAuthenticated) {
      fetchUsers();
      const interval = setInterval(fetchUsers, 5000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, isAuthenticated]);

  useEffect(() => {
    if (isAdmin && selectedUser) {
      fetchUserMessages(selectedUser);
      const interval = setInterval(() => fetchUserMessages(selectedUser), 5000);
      return () => clearInterval(interval);
    } else if (userName && isOpen) {
      fetchUserMessages(userName);
      const interval = setInterval(() => fetchUserMessages(userName), 5000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, userName, isOpen, selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || (!isAdmin && !userName.trim()) || (isAdmin && !selectedUser)) return;

    try {
      await axios.post(`${API_BASE_URL}/chat/send`, {
        userId: isAdmin ? 'admin' : 'guest',
        userName: isAdmin ? 'Admin' : userName,
        message: newMessage,
        recipient: isAdmin ? selectedUser : userName
      });

      if (isAdmin) {
        fetchUserMessages(selectedUser);
      } else {
        fetchUserMessages(userName);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleOpen = async () => {
    if (!isAdmin && !userName) {
      const name = prompt('Please enter your name to start chatting:');
      if (name) {
        setUserName(name);
        setIsOpen(true);
        await fetchUserMessages(name);
      }
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={handleOpen}
          className="relative bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="w-6 h-6" />
          {isAdmin && unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed bottom-20 right-4 w-96 max-h-[450px] bg-white rounded-lg shadow-xl flex flex-col">
            <Dialog.Title className="flex items-center justify-between p-4 border-b">
              <div className="flex-1">
                {isAdmin ? (
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full p-1 rounded border"
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user} value={user}>
                        {user}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="font-semibold">Chat Support ({userName})</span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Title>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.userId === 'admin' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={`text-sm font-medium mb-1 ${
                        msg.userId === 'admin'
                          ? 'text-right text-blue-600'
                          : 'text-left text-gray-700'
                      }`}
                    >
                      {msg.userName}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        msg.userId === 'admin'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.message}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {format(new Date(msg.timestamp), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isAdmin && !selectedUser}
                />
                <button
                  onClick={handleSendMessage}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    isAdmin && !selectedUser
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  disabled={isAdmin && !selectedUser}
                >
                  Send
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};