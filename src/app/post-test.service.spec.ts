import { TestBed } from '@angular/core/testing';
import { PostTestService } from './post-test.service';

describe('PostTestService', () => {
  let service: PostTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
