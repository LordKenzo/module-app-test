# Moduli

**Premessa:** Il `provider` è una istruzione al sistema di Dependency Injection su come ottenere il valore associato alla dipendenza.La dipendenza il più delle volte è un servizio, quindi una classe, che fornisce metodi.
Di default il provider è inserito nel root injector. E' possibile specificare il modulo @NgModule a quale viene associata la dipendenza, per non fornire il servizio a tutta l'applicazione.

**Premessa:**: I moduli Eagerly Loaded sono moduli caricati all'avvio dell'applicazione.

**Premessa:** Angular usa un sistema detto Injector per rendere le classi disponibili tra i moduli. Ho un root injector e tanti child injector per ogni modulo caricato in maniera Lazy. Non tutto può essere Lazy, ad es. il Modulo Router lavora globalmente con la location object del browser.

**Premessa:** a partire da Angular 6, il modo migliore per creare un servizio singleton è specificare nel servizio, tramite il decoratore `@Injectable`, l'impostazione `providedIn` al valore 'root'.

**Premessa:** un modulo specifica servizi tramite la proprietà `providers` e dichiarazioni di componenti, direttive e pipes tramite la proprietà `declarations`.

Con i moduli creiamo una sorta di incapsulamento dei nostri componenti, direttive, pipe, ecc...
Per rendere pubblico un componente, ad esempio, devo esportarlo con la proprietà `exports` dentro il decoratore `@NgModule`.

Quando si importa un modulo 'A', 'B', ecc... nel modulo root 'AppModule', si pensa alla costruzione di una gerarchia di moduli e che il modulo 'AppModule' sia gerarchicamente il parent di 'A', 'B', ecc...
Quello che succede è che i moduli vengono uniti in fase di compilazione e questo porta a non definire una struttura gerarchica tra i moduli. Angular crea una funzione factory nel modulo root, quello specificato nel bootstrapModule in main.ts.
Questa funzione chiamata `createNgModuleFactory` hail riferimento alla classe AppModule, il riferimento al componente bootstrap AppComponent e la definizione dei moduli con l'unione dei providers e questo fa si che ho un unico grosso modulo con un unico root injector.
Prendiamo i file a-module e b-module che definiscono un provider con useValue. Se ho lo stesso token 'root' in AppModule e BModule, il valore usato sarà quello di AppModule:

providers: [{provide: 'root', useValue: 'bModule'}],
providers: [{provide: 'root', useValue: 'appModule'}],

e questo per la regola che il modulo che importa altri moduli, vince sempre in caso di "conflitto".
Questo lo verifico se dal modulo A, import il modulo C ed entrambi hanno lo stesso token per un provider, allora vincerà il valore contenuto nel modulo A.

Se invece importo da AppModule, i moduli A e B e questi hanno lo stesso token, vincerà il valore dell'ultimo modulo importato. E questa è la seconda regola che dice che in caso di importazione di provider da moduli, vince l'ultimo import:

```js
@NgModule({
  imports: [AModule, BModule],
  ...
})
```

per lo stesso token, vincerà lo useValue contenuto nel BModule.

Per questo motivo avremo un `root injector` i cui servizi forniti tramite il `provide` saranno condivisi tra i vari moduli. Questo quando abbiamo un unico `root injector` e un unico "grosso" modulo i cui moduli sono caricati in maniera Eager.

Abbiamo il nostro `root injector`, quando creiamo un modulo in Lazy Mode, abbiamo il nostro `child injector` e ciò che succede è che un modulo Lazy avrà la sua copia di un servizio condiviso.
Questo succede perchè Angular genere una funzione factory separata per ogni modulo caricato e il risultato è che avrò più moduli effettivamente separati con i loro servizi, e non servizi condivisi e/o sovrapposti come succede per i moduli Eager.

Per cui un modulo Lazy che definisce un provider con stesso Token del modulo AppModule, avrà la sua istanza del provider/servizio indipendente da quella contenuta in AppModule.

Avrò quindi più "grossi" moduli uniti?
Quello che succede è la **creazione di una gerarchia di injector e non moduli**, e in fase di compilazione avrò sempre un unico modulo!

Vedi il file lazy-module, in questo caso il modulo viene caricato in maniera lazy dal modulo A e il costruttore di lazy component avrà si un token provide medismo a quello di A Module, ma il valore sarà diverso.
Vedi che ho dovuto importare un pò di roba come Routes, RouterModule e occhio al path di come carico il LazyModule nella definizione della routes.
Naviga su: http://localhost:4200 e poi http://localhost:4200/lazy

E veniamo a `forRoot` e `forChild`. Nella app ufficiale leggiamo che _call forRoot only in the root application module_.

Sappiamo che tutti i provider definiti in un modulo X vengono aggiunti nel root injector e disponibili nell'intera applicazione.

La regola vuole che forRoot è utilizzato quando il modulo è di tipo "eager", mentre il forChild è utilizzato per fornire un provider solo ai moduli figli del modulo che carica il tutto in maniera Lazy.

**Il forRoot e il forChild sono due metodi statici che ci permettono di configurare qualcosa** tipicamente abbiamo un oggetto di configurazione del servizio. Prendiamo ad esempio il **RouterModule**, accetta un parametro di configurazione per il servizio Router. Il RouterModule va importato nella root application module in modo da avere almeno accesso ad un RouterOutlet (una direttiva) e l'applicazione ha accesso al servizio Router.
Il RouterModule deve:

- fornire il servizio Router
- fornire la direttiva RouterOutlet

Inoltre il RouterModule è importato dai moduli più interni per poter posizionare la loro direttiva RouterOutlet per il caricamento dei loro sotto componenti.

Il classico **errore**:
[RouterOutlet -> ChildrenOutletContexts]:
NullInjectorError: **No provider for ChildrenOutletContexts!**

avviene quando non definisco un forRoot e quindi non definisco il servizio Router in quanto il servizio Router deve essere unico per tutta l'applicazione ed è per questo che deve essere disponibile tramite l'invocazione di forRoot (ed è bene che ce ne sia una sola di forRoot e quindi ecco perchè va inserito in AppModule!!!)

forRoot accetta un oggetto di configurazione del servizio e ritorna un `ModuleWithProviders`, una interfaccia definita in `@angular/core`, che ha le seguenti proprietà:

- ngModule
- providers

Possiamo creare il metodo statico forRoot nel CoreModule che configura un servizio come UserService.

```js
static forRoot(config: UserServiceConfig): ModuleWithProviders {
  return {
    ngModule: CoreModule,
    providers: [
      {provide: UserServiceConfig, useValue: config }
    ]
  };
}
```

Questo metodo statico forRoot lo definisco nella classe del CoreModule, in modo da poterlo richiamare con CoreModule.forRoot() dall'import del modulo AppModule e ricevere un oggetto di configurazione del servizio UserServiceConfig.

Vedi un piccolo esempio qui: https://stackblitz.com/edit/angular-cms9w5

Quando importo un modulo A dentro un modulo B, tutti i servizi di A sono disponibili in B per via dell'unione dei due moduli, ma posso definire un metodo statico forRoot che semplicemente mi definisce i servizi che voglio rendere disponibili a quella medesima importazione:

```js
@NgModule({})
class A {
  static forRoot() {
    return { ngModule: A, providers: [AService] };
  }
}

@NgModule({
  imports: [A.forRoot()],
})
export class B {}
```

in questo modo posso separare i servizi che voglio rendere disponibili in base al caricamente lazy e non-lazy. E' questo il senso di avere `forRoot` e `forChild`.

Quando specifico il modulo con forRoot, il servizio verrà inizializzato per l'intera applicazione ma sovrascritto dal forChild per quei moduli caricati in maniera Lazy. I nomi forChild e forRoot sono arbitrari e si basano su una convenzione raccomandata dal team Angular.
E' del tutto inutile specificare per i moduli il forRoot e il forChild se non ho una necessità di "splittare" il comportamento!

Essendo forRoot e forChild dei metodi, posso passare ciò che voglio, ad esempio il RouterModule accetta anche un parametro opzionale di configurazione che ad esempio mi permette di definire una strategia nel caricamento del modulo


# Parte 1

Ho il modulo root AppModule

Creo il modulo core e il modulo shared. Il Core Module deve essere importato solo in AppModule. In questo modo i moduli lazy avranno la copia "globale" del servizio, così come i moduli early, altrimenti con i lazy avrei una copia "locale" in quanto usano un injector root diverso dall'injector root di AppModule. La differenza con lo Shared Module e che ciò che ho qui viene usato nei miei Features moduli, cioè un componente, direttiva, pipe che userò nei componenti presenti in Features. Inoltre esporterò i moduli Angular come Common e FormsModule in modo da non importarli nuovamente in ogni modulo Feature.

In Shared vado a creare i componenti statici per l'header ed il footer nella cartella layout. Il footer inizialmente non lo creo. Ovviamente esporto il componente Header dal modulo Shared, oltre che inserirlo nella declarations.
Shared importa CommonModule.

In Core vado a creare una cartella service, con il primo servizio: api.service.ts contenente le 4 generiche richieste: GET, POST, DELETE e PUT al backend. Utilizzo anche HttpClientModule, quindi lo dichiaro negli imports.
Infine prevengo l'import di Core in moduli diversi da AppModule inserendo un controllo nel costruttore:
constructor(@Optional() @SkipSelf() parentModule: CoreModule) {...}

Vado a configurare in environment la chiave per la api_url: api_url: '/api/v1', in questo modo ho un unico punto di riferimento per l'url delle API.

Vado a dichiarare il proxy.conf.json nella parte per la BUILD (NON LA PRODUCTION) di angular.json, in questo modo le chiamate al backend vengono gestite e risolvo il problema CORS.

Il JWT Token lo gestisco tramite un servizio, quindi una classe, con la seguente api: getToken(), saveToken(token: string) e deleteToken() e farò uso della localStorage. Inoltre posso prevedere di salvare un token decodificato e prevedere un altra api cohe ritorna un booleano sulla validità del token isExpired(). Ma prima devo pensare al servizio di autenticazione.

I moduli features li creo in una cartella modules o features o domain o views, a seconda del gusto, e per ogni entità del dominio avrò:

- modulo
- routes (che posso inserire direttamente nel file a seguire)
- modulo-routing.module
  Ogni view/domain avrà un componente principale e una serie di sotto componenti. Possiamo quindi dividere la cartella in questo modo ulteriore:
  -dashboard (Modulo)
  -components
  -list-items
  -item
  -item-detail
  -special-item
  -...
  -pages
  -dashboard
  -christmasDash
  -...
  dashboard.module.ts
  dashboard-routing.module.ts
  dashboard.service.ts

In pages inserisco il componente root che conterrà uno o più componenti per costruire l'intera pagina.
Posso avere più pagine root per il modulo dashboard.
Infine avrò il mio service relativo al modulo.

# Parte 2

Nella prima parte però ho messo l'header ed il footer in shared. Questi sono componenti a singolo uso cioè avrò un solo componente header (o footer), per tutta l'applicazione (questo non vuol dire che il componente è singleton). Pertanto il loro posto più congeniale è nel Core Module e non lo Shared Module, come da guida di stile di Angular (https://angular.io/guide/styleguide#core-feature-module)
Quindi concettualmente sposto header e footer in Core Module.

Andiamo a creare il nostro primo interceptor. Ricordati che oltre a creare la classe dovrai registrarlo nei providers di Core Module.
(https://offering.solutions/blog/articles/2017/07/19/angular-2-new-http-interface-with-interceptors/).

Posso vedere che grazie alle RegEx posso bypassare un interceptor, altrimenti posso realizzare soluzioni più eleganti:
(https://github.com/angular/angular/issues/20203)
