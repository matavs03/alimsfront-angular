import { TestBed } from '@angular/core/testing';  //Angular alat za testiranje

import { AdminService } from './admin-service';

describe('AdminService', () => {    //Grupise testove u logicku celinu
  let service: AdminService;        //Deklaracija promenljive za servis koji se testira

  beforeEach(() => {                          //Funkcija koja se izvrsava pre svakog testa
    TestBed.configureTestingModule({});       //Konfigurisanje testnog modula
    service = TestBed.inject(AdminService);   //Injektovanje instance AdminService-a za testiranje  
  });

  it('should be created', () => {             //Definisanje pojedinacnog testa
    expect(service).toBeTruthy();             //Provera da li je servis uspesno kreiran 
  });
});

// Ovaj kod postavlja osnovni test za AdminService koristeci Angular-ov TestBed
