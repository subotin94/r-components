import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DpSelectComponent } from './dp-select.component';

describe('DpSelectComponent', () => {
  let component: DpSelectComponent;
  let fixture: ComponentFixture<DpSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DpSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DpSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
