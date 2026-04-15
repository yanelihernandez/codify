import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Language } from '../models/language';

@Injectable({
  providedIn: 'root'
})
export class LanguagesService {

  private apiUrl = 'data/languages.json';

  constructor(private http: HttpClient) { }

  getLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(this.apiUrl);
  }
}
