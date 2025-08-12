import { Component, OnInit } from '@angular/core';
import { LoadingService } from './shared/services/loading.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  displayLoading = 'none';

  constructor(private loadingService: LoadingService) {}

  ngOnInit() {
    this.loadingService.loading$.subscribe(
      (data) => (this.displayLoading = data ? 'block' : 'none')
    );
  }
}
