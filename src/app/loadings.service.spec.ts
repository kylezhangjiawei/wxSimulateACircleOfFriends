import { TestBed } from '@angular/core/testing';

import { LoadingsService } from './loadings.service';

describe('LoadingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoadingsService = TestBed.get(LoadingsService);
    expect(service).toBeTruthy();
  });
});
