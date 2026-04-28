import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Professor } from '../models/professor';
import {collection, collectionData, Firestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProfessorService {

  private professorsRef;

  constructor(private firestore: Firestore) {
    this.professorsRef = collection(this.firestore, 'teachers');
  }

  getProfessors(): Observable<Professor[]> {
    return collectionData(this.professorsRef, { idField: 'id' }) as Observable<Professor[]>;
  }
}
