import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-info-dialog',
  template: ` <h2 class="title">Node Information</h2>
    <hr />
    <mat-dialog-content class="info">
      @for (key of objectKeys(data); track $index) {
      <div class="info-row">
        <p class="info-header">{{ key }}</p>
        <p class="info-content">{{ data[key] }}</p>
      </div>
      }
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>`,
  styles: [
    `
      .info-row {
        display: flex;
        padding: 0.5rem 1rem;
        border-radius: 0.6rem;

        &:hover {
          background-color: var(--hover-bg-color);
        }

        .info-header {
          width: 40%;
          font-weight: 600;
        }

        .info-content {
          width: 60%;
        }
      }

      .title {
        padding: 1.25rem 1.75rem;
        color: var(--mat-sidenav-content-text-color);
        font-weight: bold;
        font-size: 1.5rem;
      }

      hr {
        color: var(--mat-sidenav-content-text-color);
      }

      .info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        overflow: hidden;

        p {
          font-size: 0.9rem;
          font-family: Vazir, serif;
        }
      }
    `,
  ],
})
export class InfoDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Record<string, string>) {}

  objectKeys = Object.keys;
}
