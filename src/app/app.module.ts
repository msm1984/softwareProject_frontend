import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { UserModule } from './user/user.module';
import { SharedModule } from './shared/shared.module';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { GraphModule } from './graph/graph.module';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    SharedModule,
    GraphModule,
    MatProgressBarModule,
  ],
  providers: [provideAnimationsAsync(), provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
