import { NgModule, Component, Inject } from '@angular/core';

@Component({
  selector: 'app-b-component',
  template: `
    <h1>B Component </h1>
  `,
})
export class BComponent {
  constructor(@Inject('root') public bService: string) {
    console.log(this.bService);
  }
}

@NgModule({
  providers: [{ provide: 'root', useValue: 'bModule' }],
  declarations: [BComponent],
  entryComponents: [BComponent],
  exports: [BComponent],
})
export class BModule {}
