import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Letter } from './letter';

export interface LetterDTO {    //DTO inerfejs, ovo su podaci koji se šalju prilikom kreiranja pisma
  title: string;
  description: string;
  adminId: number;
  medicationIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LetterService {

  private baseURL = 'http://localhost:8080/api/v1/letters';   //link ka backend-u

  constructor(private http: HttpClient) {}                    //injektovanje HttpClient-a

  getAllLetters(): Observable<Letter[]> {                     //metoda za dobijanje svih pisama
    return this.http.get<Letter[]>(this.baseURL);             //HTTP GET zahtev
  }


  sendLetterWithFile(letterDTO: LetterDTO, file: File): Observable<any> {
  const formData = new FormData();                                                                          //Omogućava slanje podataka i fajlova zajedno u jednom POST zahtevu
  formData.append('letter', new Blob([JSON.stringify(letterDTO)], { type: 'application/json' }));           //DTO se pretvara u JSON, a zatim u Blob (binarni) objekat
  formData.append('file', file);                                                                            //Dodavanje fajla u formData
  return this.http.post(this.baseURL, formData);                                                            //Slanje POST zahteva sa formData
}

  downloadLetter(id: number): Observable<Blob> {
  return this.http.get(`http://localhost:8080/api/v1/letters/${id}/download`, { responseType: 'blob' });    //Preuzimanje pisma kao Blob (binarni fajl)
}
}
