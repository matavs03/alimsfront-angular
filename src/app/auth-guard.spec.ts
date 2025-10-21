import { TestBed } from '@angular/core/testing';

import { AuthGuard } from './auth-guard';

describe('AuthGuard', () => {
  let service: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

//klasa za testiranje AuthGuard-a, proverava da li se servis uspešno kreira
