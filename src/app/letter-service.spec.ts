import { TestBed } from '@angular/core/testing';

import { LetterService } from './letter-service';

describe('LetterService', () => {
  let service: LetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

//klasa za testiranje servisa koji rukuje slovima, koristi Angular-ov TestBed za postavljanje okruženja za testiranje i proverava da li je servis uspešno kreiran
