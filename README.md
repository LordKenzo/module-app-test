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
* modulo
* routes (che posso inserire direttamente nel file a seguire)
* modulo-routing.module
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