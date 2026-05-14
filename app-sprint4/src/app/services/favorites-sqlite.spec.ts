import { TestBed } from '@angular/core/testing';

import { FavoritesSQLite } from './favorites-sqlite';

describe('FavoritesSQLite', () => {
  let service: FavoritesSQLite;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FavoritesSQLite);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
