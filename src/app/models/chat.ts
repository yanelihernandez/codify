import { Timestamp, FieldValue } from 'firebase/firestore';

export interface ChatWrite {
  userId: string;
  teacherId: string;
  createdAt: FieldValue;
  lastMessage: string;
  lastMessageDate: FieldValue;
}

export interface ChatDB {
  id?: string;
  userId: string;
  teacherId: string;
  createdAt: Timestamp;
  lastMessage: string;
  lastMessageDate: Timestamp;
}

export interface ChatUI {
  id: string;
  name: string;
  image: string;
  lastMessage: string;
  lastMessageTime: Date | null;
}

export interface Message {
  id?: string;
  senderId: string;
  text: string;
  createdAt: Timestamp | FieldValue;
}
