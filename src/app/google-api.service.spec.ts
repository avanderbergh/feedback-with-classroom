import { TestBed, inject } from '@angular/core/testing';

import { GoogleApiService } from './google-api.service';

describe('GoogleApiService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GoogleApiService]
    });
  });

  it('should ...', inject([GoogleApiService], (service: GoogleApiService) => {
    expect(service).toBeTruthy();
  }));
});
