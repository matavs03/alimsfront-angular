import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Letter } from './letter';

export interface LetterDTO {
  title: string;
  description: string;
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


  sendLetterWithFile(letterDTO: LetterDTO, file: File): Observable<any> {
  const formData = new FormData();
  formData.append('letter', new Blob([JSON.stringify(letterDTO)], { type: 'application/json' }));
  formData.append('file', file);
  return this.http.post(this.baseURL, formData);
}

  downloadLetter(id: number): Observable<Blob> {
  return this.http.get(`http://localhost:8080/api/v1/letters/${id}/download`, { responseType: 'blob' });
}
}
