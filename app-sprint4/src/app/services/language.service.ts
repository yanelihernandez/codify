import { Injectable } from '@angular/core';
import {map, Observable} from 'rxjs';
import { Language } from '../models/language';
import {collection, collectionData, doc, docData, Firestore, where, query} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  private languageRef;

  constructor(private firestore: Firestore) {
    this.languageRef = collection(this.firestore, 'languages');
  }

  getLanguages(): Observable<Language[]> {
    return collectionData(this.languageRef, { idField: 'id' }) as Observable<Language[]>;
  }

  getLanguageBySlug(slug: string): Observable<Language | null> {
    const languagesRef = collection(this.firestore, 'languages');

    const q = query(languagesRef, where('slug', '==', slug));

    return collectionData(q, { idField: 'id' }).pipe(
      map(languages => {
        const list = languages as Language[];
        return list.length > 0 ? list[0] : null;
      })
    );
  }

}
