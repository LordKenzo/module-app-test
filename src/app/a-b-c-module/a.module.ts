import { NgModule, Component, Inject } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CModule } from './c-module';
import { LazyModule } from './lazy-module';

const routes: Routes = [
  {
    path: 'a/lazy',
    loadChildren: '../../app/a-b-c-module/lazy-module#LazyModule',
  },
];

@Component({
  selector: 'app-a-component',
  template: `
    <h1>A Component</h1>
    <app-c-component></app-c-component>

    <router-outlet></router-outlet>
  `,
})
export class AComponent {
  constructor(@Inject('a') public service: string) {
    console.log('from A Constructor:', this.service);
  }
}
@NgModule({
  providers: [{ provide: 'a', useValue: 'aModule' }],
  imports: [CModule, RouterModule.forChild(routes)],
  declarations: [AComponent],
  entryComponents: [AComponent],
  exports: [AComponent],
})
export class AModule {}
