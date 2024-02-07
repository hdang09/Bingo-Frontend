import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BingoComponent } from './bingo.component';

describe('BingoComponent', () => {
  let component: BingoComponent;
  let fixture: ComponentFixture<BingoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BingoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BingoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
