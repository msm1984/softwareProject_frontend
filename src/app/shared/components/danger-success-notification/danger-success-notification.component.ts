import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-danger-success-notification',
  template: ` <span matSnackBarLabel>{{ this.userData }}</span> `,

  styles: `
    :host {
      display: flex;
      color: white;
    }
  `,
})
export class DangerSuccessNotificationComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    protected userData: string
  ) {}
}
