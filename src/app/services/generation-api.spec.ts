import { TestBed } from '@angular/core/testing';

import { GenerationApi } from './generation-api';

describe('GenerationApi', () => {
  let service: GenerationApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerationApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
