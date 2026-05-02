import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {
  collection,
  collectionData,
  doc,
  Firestore,
  where,
  query,
  addDoc,
  updateDoc, orderBy, getDocs
} from '@angular/fire/firestore';
import {ChatDB, ChatWrite, Message} from '../models/chat';
import { serverTimestamp  } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatsRef;

  constructor(private firestore: Firestore) {
    this.chatsRef = collection(this.firestore, 'chats');
  }

  getChats(userId: string): Observable<ChatDB[]> {
    const q = query(this.chatsRef, where('userId', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<ChatDB[]>;
  }

  async getOrCreateChat(userId: string, teacherId: string): Promise<string> {
    const existing = await this.getChatOnce(userId, teacherId);

    if (existing) {
      return existing.id!;
    }

    return await this.createChat(userId, teacherId);
  }

  async getChatOnce(userId: string, teacherId: string): Promise<ChatDB | null> {
    const q = query(
      this.chatsRef,
      where('userId', '==', userId),
      where('teacherId', '==', teacherId)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } as ChatDB;
  }

  async createChat(userId: string, teacherId: string): Promise<string> {
    const chat: ChatWrite = {
      userId,
      teacherId,
      createdAt: serverTimestamp(),
      lastMessage: '',
      lastMessageDate: serverTimestamp()
    };

    const docRef = await addDoc(this.chatsRef, chat);
    return docRef.id;
  }

  sendMessage(chatId: string, message: Message) {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);

    addDoc(messagesRef, {
      ...message,
      createdAt: serverTimestamp()
    });

    const chatRef = doc(this.firestore, `chats/${chatId}`);

    updateDoc(chatRef, {
      lastMessage: message.text,
      lastMessageDate: serverTimestamp()
    });
  }

  getMessages(chatId: string): Observable<Message[]> {
    const messagesRef = collection(this.firestore, `chats/${chatId}/messages`);

    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    return collectionData(q, { idField: 'id' }) as Observable<Message[]>;
  }


}
