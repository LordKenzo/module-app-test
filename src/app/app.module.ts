import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

import { AModule, AComponent } from './a-b-c-module/a.module';
import { LazyModule, LazyComponent } from './a-b-c-module/lazy-module';
import { BModule } from './a-b-c-module/b.module';

const routes: Routes = [
  {
    path: 'a',
    component: AComponent,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    SharedModule,
    RouterModule.forRoot(routes),
    AModule,
    BModule,
  ],
  providers: [{ provide: 'root', useValue: 'appModule' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
