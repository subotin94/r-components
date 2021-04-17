import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpLayoutComponent } from './dp-layout.component';

describe('DpLayoutComponent', () => {
  let component: DpLayoutComponent;
  let fixture: ComponentFixture<DpLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DpLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
