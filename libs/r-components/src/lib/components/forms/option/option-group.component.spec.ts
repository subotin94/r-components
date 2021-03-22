import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { RSelectComponent } from '../select/select.component';
import { ROptionComponent } from './option.component';
import { ROptionGroupComponent } from './option-group.component';
import { RLayoutModule } from '../../layout';
import { RSelectModule } from '../select/select.module';

@Component({
  template: `
    <r-layout>
      <r-layout-column>
        <r-select [disabled]="selectDisabled">
          <r-option-group [disabled]="optionGroupDisabled" [title]="optionGroupTitle">
            <r-option *ngIf="showOption" [value]="1" [disabled]="optionDisabled">1</r-option>
          </r-option-group>
        </r-select>

      </r-layout-column>
    </r-layout>
  `,
})
export class ROptionGroupTestComponent {
  selectDisabled = false;
  optionGroupDisabled = false;
  optionDisabled = false;
  showOption = true;
  optionGroupTitle = '';

  @ViewChild(RSelectComponent) selectComponent: RSelectComponent;
  @ViewChild(ROptionGroupComponent) optionGroupComponent: ROptionGroupComponent;
  @ViewChild(ROptionComponent) optionComponent: ROptionComponent<number>;
}

describe('ROptionGroupComponent', () => {
  let fixture: ComponentFixture<ROptionGroupTestComponent>;
  let testComponent: ROptionGroupTestComponent;
  let selectComponent: RSelectComponent;
  let optionGroupComponent: ROptionGroupComponent;
  let optionComponent: ROptionComponent<number>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        RLayoutModule,
        RSelectModule,
      ],
      declarations: [ ROptionGroupTestComponent ],
    });

    fixture = TestBed.createComponent(ROptionGroupTestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
    flush();

    selectComponent = testComponent.selectComponent;
    optionGroupComponent = testComponent.optionGroupComponent;
    optionComponent = testComponent.optionComponent;
  }));

  it('should contain passed title', () => {
    const title = 'random option group title';
    selectComponent.show();
    testComponent.optionGroupTitle = title;
    fixture.detectChanges();

    const groupTitle = fixture.debugElement.query(By.directive(ROptionGroupComponent))
      .query(By.css('.option-group-title'));

    expect(groupTitle.nativeElement.textContent).toEqual(title);
  });

  it('should have disabled attribute if disabled', () => {
    selectComponent.show();
    testComponent.optionGroupDisabled = true;
    fixture.detectChanges();

    const optionGroup = fixture.debugElement.query(By.directive(ROptionGroupComponent));
    expect(optionGroup.attributes.disabled).toEqual('');
  });

  it('should remove disabled attribute if disabled set to false', () => {
    selectComponent.show();
    testComponent.optionGroupDisabled = true;
    fixture.detectChanges();

    testComponent.optionGroupDisabled = false;
    fixture.detectChanges();

    const optionGroup = fixture.debugElement.query(By.directive(ROptionGroupComponent));
    expect(optionGroup.attributes.disabled).not.toBeDefined();
  });

  it('should disable group options if group disabled', () => {
    const setDisabledSpy = spyOn(optionComponent, 'setDisabledByGroupState');

    optionGroupComponent.disabled = true;
    fixture.detectChanges();

    expect(setDisabledSpy).toHaveBeenCalledTimes(1);
    expect(setDisabledSpy).toHaveBeenCalledWith(true);
  });

  it('should enable group options if group enabled', () => {
    testComponent.optionDisabled = true;
    fixture.detectChanges();

    expect(optionComponent.disabled).toEqual(true);

    const setDisabledSpy = spyOn(optionComponent, 'setDisabledByGroupState');
    optionGroupComponent.disabled = false;

    expect(setDisabledSpy).toHaveBeenCalledTimes(1);
    expect(setDisabledSpy).toHaveBeenCalledWith(false);
  });

  it('should update options state when options change', fakeAsync(() => {
    testComponent.optionGroupDisabled = true;
    testComponent.showOption = false;
    fixture.detectChanges();
    flush();

    testComponent.showOption = true;
    fixture.detectChanges();
    flush();
    fixture.detectChanges();

    expect(optionComponent.disabledAttribute).toEqual('');
  }));

  it('should update options state after content initialisation', fakeAsync(() => {
    fixture = TestBed.createComponent(ROptionGroupTestComponent);
    testComponent = fixture.componentInstance;
    testComponent.optionDisabled = true;
    fixture.detectChanges();
    flush();

    expect(testComponent.optionComponent.disabledAttribute).toEqual('');
  }));
});
