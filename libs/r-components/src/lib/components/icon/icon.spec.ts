import { TestBed } from '@angular/core/testing';
import { RFontIcon, RSvgIcon } from './icon';
import { RIconComponent, RIconConfig } from './icon.component';
import { RIconModule } from './icon.module';

describe('icon', () => {
  let fontIcon: RFontIcon;
  let svgIcon: RSvgIcon;


  it(`font icon renders`, () => {

    fontIcon = new RFontIcon('home', 'custom', {
      packClass: 'custom-pack',
      iconClassPrefix: 'cp',
    });

    expect(fontIcon.getContent()).toEqual('custom');
  });

  it(`font icon getClasses return classes`, () => {

    fontIcon = new RFontIcon('home', '', {
      packClass: 'custom-pack',
    });

    expect(fontIcon.getClasses()).toEqual(['custom-pack', 'home']);
  });

  it(`font icon getClasses return class with prefix`, () => {

    fontIcon = new RFontIcon('home', '', {
      packClass: 'custom-pack',
      iconClassPrefix: 'cp',
    });

    expect(fontIcon.getClasses()).toEqual(['custom-pack', 'cp-home']);
  });

  it(`font icon getClasses return class with name only`, () => {

    fontIcon = new RFontIcon('home', '');

    expect(fontIcon.getClasses()).toEqual(['home']);
  });

  it(`svg icon renders`, () => {

    svgIcon = new RSvgIcon('home', 'content', {
      packClass: 'custom-pack',
    });

    expect(svgIcon.getContent()).toEqual('content');
  });

  it(`svg icon getClasses return class`, () => {

    svgIcon = new RSvgIcon('home', '', {
      packClass: 'custom-pack',
    });

    expect(svgIcon.getClasses()).toEqual(['custom-pack']);
  });

  it(`svg icon getClasses return class without name`, () => {

    svgIcon = new RSvgIcon('home', '');

    expect(svgIcon.getClasses()).toEqual([]);
  });
});

describe('RIconComponent', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ RIconModule ],
    });
  });

  it('should set icon name when string passed as a config', () => {
    const iconComponent: RIconComponent = TestBed.createComponent(RIconComponent).componentInstance;
    const iconName = 'some-icon';

    iconComponent.config = iconName;

    expect(iconComponent.icon).toEqual(iconName);
  });

  it('should set icon when object with icon passed as a config', () => {
    const iconComponent: RIconComponent = TestBed.createComponent(RIconComponent).componentInstance;
    const iconConfig: RIconConfig = { icon: 'some-icon' };

    iconComponent.config = iconConfig;

    expect(iconComponent.icon).toEqual(iconConfig.icon);
  });

  it('should set pack when object with pack passed as a config', () => {
    const iconComponent: RIconComponent = TestBed.createComponent(RIconComponent).componentInstance;
    const iconConfig: RIconConfig = { icon: 'some-icon', pack: 'some-pack' };

    iconComponent.config = iconConfig;

    expect(iconComponent.pack).toEqual(iconConfig.pack);
  });

  it('should set status when object with status passed as a config', () => {
    const iconComponent: RIconComponent = TestBed.createComponent(RIconComponent).componentInstance;
    const iconConfig: RIconConfig = { icon: 'some-icon', status: 'danger' };

    iconComponent.config = iconConfig;

    expect(iconComponent.status).toEqual(iconConfig.status);
  });

  it('should set options when object with options passed as a config', () => {
    const iconComponent: RIconComponent = TestBed.createComponent(RIconComponent).componentInstance;
    const options = { someProp: 'someVal' };
    const iconConfig: RIconConfig = { icon: 'some-icon', options };

    iconComponent.config = iconConfig;

    expect(iconComponent.options).toEqual(iconConfig.options);
  });

  it('should do nothing when falsy value passed as a config', () => {
    const iconComponent: RIconComponent = TestBed.createComponent(RIconComponent).componentInstance;
    const config: RIconConfig = { icon: 'icon', pack: 'pack', status: 'danger', options: { opt: 'opt' } };
    iconComponent.config = config;

    iconComponent.config = null;
    expect(iconComponent.config).toEqual(config);
  });

  it('icon inner html not to be null or undefined', () => {
    const iconComponent: RIconComponent = TestBed.createComponent(RIconComponent).componentInstance;
    iconComponent.config = { icon: 'test-not-existing-icon' };

    expect(iconComponent.html).not.toBeNull();
    expect(iconComponent.html).not.toBeUndefined();
  });
});
