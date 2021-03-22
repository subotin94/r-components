import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { RIconModule } from './icon.module';
import { RIconLibraries } from './icon-libraries';
import { RIconComponent } from './icon.component';

@Component({
  template: `
    <r-icon #iconEl [icon]="icon"></r-icon>
  `,
})
class IconTestComponent {
  @ViewChild(RIconComponent, {static: true, read: ElementRef}) iconElRef: ElementRef<HTMLElement>;
  @Input() icon;
}

describe('Component: RIcon', () => {

  let iconTestComponent: IconTestComponent;
  let fixture: ComponentFixture<IconTestComponent>;
  let iconElement: ElementRef;
  let iconsLibrary: RIconLibraries;

  beforeEach(() => {

    const bed = TestBed.configureTestingModule({
      declarations: [IconTestComponent],
      imports: [RIconModule]
    });

    fixture = bed.createComponent(IconTestComponent);
    iconsLibrary = bed.inject(RIconLibraries);

    iconsLibrary
      .registerSvgPack('svg-pack', { home: '<svg><rect></rect></svg>' }, { packClass: 'custom-pack' });
    iconsLibrary.setDefaultPack('svg-pack');

    iconTestComponent = fixture.componentInstance;
    fixture.detectChanges();
    iconElement = iconTestComponent.iconElRef;
  });

  it('should render icon', () => {
    iconTestComponent.icon = 'home';
    fixture.detectChanges();

    const svg = iconElement.nativeElement.querySelector('svg');

    expect(iconElement.nativeElement.classList.contains('custom-pack')).toBeTruthy();
    expect(svg.innerHTML).toContain('<rect></rect>');
  });
});
