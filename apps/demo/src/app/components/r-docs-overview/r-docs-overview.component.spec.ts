import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RDocsOverviewComponent } from './r-docs-overview.component';

describe('RDocsOverviewComponent', () => {
  let component: RDocsOverviewComponent;
  let fixture: ComponentFixture<RDocsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RDocsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RDocsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
