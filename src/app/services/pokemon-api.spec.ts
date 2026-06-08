import { TestBed } from '@angular/core/testing';

import { PokemonApi } from './pokemon-api';

describe('PokemonApi', () => {
  let service: PokemonApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokemonApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
