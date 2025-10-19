import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Letter } from './letter';

export interface LetterDTO {
  title: string;
  description: string;
  content: string;
  adminId: number;
  medicationIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LetterService {

  private baseURL = 'http://localhost:8080/api/v1/letters';

  constructor(private http: HttpClient) {}

  getAllLetters(): Observable<Letter[]> {
    return this.http.get<Letter[]>(this.baseURL);
  }


  sendLetter(letterDTO: LetterDTO): Observable<any> {
  return this.http.post(this.baseURL, letterDTO);
}
}
