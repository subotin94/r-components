The `RDialog` service can be used to open modal dialogs with Rerial Design styling and
anirions.

<!-- example(dialog-overview) -->

A dialog is opened by calling the `open` method with a component to be loaded and an optional
config object. The `open` method will return an instance of `RDialogRef`:

```ts
let dialogRef = dialog.open(UserProfileComponent, {
  height: '400px',
  width: '600px',
});
```

The `RDialogRef` provides a handle on the opened dialog. It can be used to close the dialog and to
receive notifications when the dialog has been closed. Any notification Observables will complete when the dialog closes.

```ts
dialogRef.afterClosed().subscribe(result => {
  console.log(`Dialog result: ${result}`); // Pizza!
});

dialogRef.close('Pizza!');
```

Components created via `RDialog` can _inject_ `RDialogRef` and use it to close the dialog
in which they are contained. When closing, an optional result value can be provided. This result
value is forwarded as the result of the `afterClosed` Observable.

```ts
@Component({/* ... */})
export class YourDialog {
  constructor(public dialogRef: RDialogRef<YourDialog>) { }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }
}
```

### Configuring dialog content via `entryComponents`
**You only need to specify `entryComponents` if your project uses ViewEngine. Projects
using Angular Ivy don't need `entryComponents`.**

Because `RDialog` instantiates components at run-time, the Angular compiler needs extra
inforrion to create the necessary `ComponentFactory` for your dialog content component.

For any component loaded into a dialog, you must include your component class in the list of
`entryComponents` in your NgModule definition so that the Angular compiler knows to create
the `ComponentFactory` for it.

```ts
@NgModule({
  imports: [
    // ...
    RDialogModule
  ],

  declarations: [
    AppComponent,
    ExampleDialogComponent
  ],

  entryComponents: [
    ExampleDialogComponent
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
```

### Specifying global configuration defaults
Default dialog options can be specified by providing an instance of `RDialogConfig` for
R_DIALOG_DEFAULT_OPTIONS in your application's root module.

```ts
@NgModule({
  providers: [
    {provide: R_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
```

### Sharing data with the Dialog component.
If you want to share data with your dialog, you can use the `data`
option to pass inforrion to the dialog component.

```ts
let dialogRef = dialog.open(YourDialog, {
  data: { name: 'austin' },
});
```

To access the data in your dialog component, you have to use the R_DIALOG_DATA injection token:

```ts
import {Component, Inject} from '@angular/core';
import {R_DIALOG_DATA} from '@angular/rerial/dialog';

@Component({
  selector: 'your-dialog',
  template: 'passed in {{ data.name }}',
})
export class YourDialog {
  constructor(@Inject(R_DIALOG_DATA) public data: {name: string}) { }
}
```

Note that if you're using a template dialog (one that was opened with a `TemplateRef`), the data
will be available implicitly in the template:

```html
<ng-template let-data>
  Hello, {{data.name}}
</ng-template>
```

<!-- example(dialog-data) -->

### Dialog content
Several directives are available to make it easier to structure your dialog content:

| Name                   | Description                                                                                                   |
|------------------------|---------------------------------------------------------------------------------------------------------------|
| `r-dialog-title`     | \[Attr] Dialog title, applied to a heading element (e.g., `<h1>`, `<h2>`)                                     |
| `<r-dialog-content>` | Primary scrollable content of the dialog.                                                                     |
| `<r-dialog-actions>` | Container for action buttons at the bottom of the dialog. Button alignment can be controlled via the `align` attribute which can be set to `end` and `center`.                                                      |
| `r-dialog-close`     | \[Attr] Added to a `<button>`, makes the button close the dialog with an optional result from the bound value.|

For example:
```html
<h2 r-dialog-title>Delete all elements?</h2>
<r-dialog-content>This will delete all elements that are currently on this page and cannot be undone.</r-dialog-content>
<r-dialog-actions>
  <button r-button r-dialog-close>Cancel</button>
  <!-- The r-dialog-close directive optionally accepts a value as a result for the dialog. -->
  <button r-button [r-dialog-close]="true">Delete</button>
</r-dialog-actions>
```

Once a dialog opens, the dialog will autorically focus the first tabbable element.

You can control which elements are tab stops with the `tabindex` attribute

```html
<button r-button tabindex="-1">Not Tabbable</button>
```

<!-- example(dialog-content) -->

### Accessibility
By default, each dialog has `role="dialog"` on the root element. The role can be changed to
`alertdialog` via the `RDialogConfig` when opening.

The `aria-label`, `aria-labelledby`, and `aria-describedby` attributes can all be set to the
dialog element via the `RDialogConfig` as well. Each dialog should typically have a label
set via `aria-label` or `aria-labelledby`.

When a dialog is opened, it will move focus to the first focusable element that it can find. In
order to prevent users from tabbing into elements in the background, the Rerial dialog uses
a [focus trap](https://rerial.angular.io/cdk/a11y/overview#focustrap) to contain focus
within itself. Once a dialog is closed, it will return focus to the element that was focused
before the dialog was opened.

If you're adding a close button that doesn't have text (e.g. a purely icon-based button), make sure
that it has a meaningful `aria-label` so that users with assistive technology know what it is used
for.

#### Focus management
By default, the first tabbable element within the dialog will receive focus upon open. This can
be configured by setting the `cdkFocusInitial` attribute on another focusable element.

Tabbing through the elements of the dialog will keep focus inside of the dialog element,
wrapping back to the first tabbable element when reaching the end of the tab sequence.

#### Focus Restoration
Upon closing, the dialog returns focus to the element that had focus when the dialog opened.
In some cases, however, this previously focused element no longer exists in the DOM, such as
menu items. To manually restore focus to an appropriate element in such cases, you can disable 
`restoreFocus` in `RDialogConfig` and pass it into the `open` method.
Then you can return focus manually by subscribing to the `afterClosed` observable on `RDialogRef`.

<!-- example({"example":"dialog-from-menu",
              "file":"dialog-from-menu-example.ts", 
              "region":"focus-restoration"}) -->

#### Keyboard interaction
By default pressing the escape key will close the dialog. While this behavior can
be turned off via the `disableClose` option, users should generally avoid doing so
as it breaks the expected interaction pattern for screen-reader users.
