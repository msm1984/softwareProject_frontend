import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-status',
  template: `
    <app-card class="container">
      <h2>Validation Status</h2>
      <hr />
      @for (field of fields; track field) {
      <div>
        <mat-icon
          [class]="myForm.controls[field.control].valid ? 'success' : 'error'"
        >
          {{ myForm.controls[field.control].valid ? 'check_circle' : 'cancel' }}
        </mat-icon>
        {{ field.message }}
      </div>
      }
    </app-card>
  `,
  styles: [
    `
      .container {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        mat-icon {
          vertical-align: middle;
        }

        .error {
          color: var(--mat-form-field-error-text-color);
        }

        .success {
          color: var(--mdc-filled-button-container-color);
        }

        h2 {
          font-weight: 600;
        }
      }
    `,
  ],
})
export class ValidationStatusComponent {
  @Input() myForm!: FormGroup;
  @Input() fields!: { control: string; message: string }[];
}
