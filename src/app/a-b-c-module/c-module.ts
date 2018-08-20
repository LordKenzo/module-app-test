import { Component, NgModule, Inject } from '@angular/core';

@Component({
  selector: 'app-c-component',
  template: '<h1>C Component</h1>',
})
export class CComponent {
  constructor(@Inject('a') public service: string) {
    console.log('from C Constructor:', this.service);
  }
}

@NgModule({
  declarations: [CComponent],
  providers: [{ provide: 'a', useValue: 'cModule' }],
  exports: [CComponent],
})
export class CModule {}
