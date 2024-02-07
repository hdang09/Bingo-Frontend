import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawnComponent } from './drawn.component';

describe('DrawnComponent', () => {
  let component: DrawnComponent;
  let fixture: ComponentFixture<DrawnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrawnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrawnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
