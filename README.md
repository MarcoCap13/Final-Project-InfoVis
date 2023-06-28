Secondo progetto del corso di Visualizzazione delle Informazioni A.A 2022/2023
========================================================================================================================

| Nome | Matricola | E-mail | Profilo GitHub |
|:---|:---|:---|:---|
|Marco Caponi|508773|MAR.CAPONI4@stud.uniroma3.it|https://github.com/MarcoCap13|
|Gianluca Ceneda|488257|gia.ceneda@stud.uniroma3.it|https://github.com/GigiCene95|

## Avvio dell'applicativo
Lanciare il comando seguente all'interno della directory principale:

    python -m http.server

## Descrizione
Lo scopo del progetto consiste nel visualizzare in modo opportuno i dati metereologici estratti dalla serie storica nel sito della Regione Lazio aggiornati fno al 2022.
I dati rappresentati corrispondono nello specifico alle temperature (massima, minima e media), alla percentuale d'umidità e alle precipitazioni, ed in particolare abbiamo optato per due possibili forme di visualizzazione:
la prima, in funzione della data, permette di confrontare i vari comuni del Lazio, la seconda invece in funzione della località, che consente di controllare l'andamento delle condizioni metereologiche nel corso del tempo.
Abbiamo implementato una schermata home che ci faccia visualizzare le due scelte da poter effettuare per la ricerca del meteo.
Nella rappresentazione per data si filtra per anno, accedendo dunque ai vari database annui uno per volta. La data si sceglie con un tool di calendario, ed i dati possono essere ordinati in ordine crescente o decrescente grazie all'apposita checkbox.
Invece nella rappresentazione per località, quest'ultima si può selezionare dal menù a tendina, e vengono visualizzati i dati in ordine cronologico nell'anno scelto.
