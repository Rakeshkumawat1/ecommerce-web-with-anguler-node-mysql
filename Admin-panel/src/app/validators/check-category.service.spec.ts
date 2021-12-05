import { TestBed } from '@angular/core/testing';

import { CheckCategoryService } from './check-category.service';

describe('CheckCategoryService', () => {
  let service: CheckCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
