import { Component, NgModule, Inject } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

@Component({
  template: '<h1>Lazy Component</h1>',
})
export class LazyComponent {
  constructor(@Inject('a') public a: string) {
    console.log('from Lazy Constructor:', this.a);
  }
}

const lazyRoutes: Routes = [
  {
    path: '',
    component: LazyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(lazyRoutes)],
  declarations: [LazyComponent],
  providers: [{ provide: 'a', useValue: 'lazyModule' }],
  exports: [LazyComponent],
})
export class LazyModule {
  static forRoot() {
    return {
      ngModule: LazyModule,
      providers: [
        {
          provide: 'lazy-root',
          useValue: 'root-lazy',
        },
      ],
    };
  }
  static forChild() {
    return {
      ngModule: LazyModule,
      providers: [
        {
          provide: 'lazy-root',
          useValue: 'child-lazy',
        },
      ],
    };
  }
}
