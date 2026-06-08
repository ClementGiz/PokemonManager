import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Generations } from './generations';

describe('Generations', () => {
  let component: Generations;
  let fixture: ComponentFixture<Generations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Generations],
    }).compileComponents();

    fixture = TestBed.createComponent(Generations);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
