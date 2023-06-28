
| Nome | Matricola | E-mail | Profilo GitHub |
|:---|:---|:---|:---|
|Marco Caponi|508773|MAR.CAPONI4@stud.uniroma3.it|https://github.com/MarcoCap13|

## Avvio dell'applicativo
Lanciare il comando seguente all'interno della directory principale:

    python -m http.server

> **Note**
> Avviare l'applicativo in una pagina in incognito poichè il browser potrebbe non visualizzarlo correttamente

## Descrizione
Crea un file json con dei dati multivariati: ci sono 10 data-point e ogni data-point ha cinque variabili quantitative i cui valori sono tutti positivi. In base a questi dati disegna 10 piccole farfalle (è sufficiente la silhouette) posizionate sullo schermo in modo che la prima variabile sia usata per determinare la coordinata x, la seconda variabile sia usata per la coordinata y e la terza variabile sia usata per la grandezza delle ali. La quarta e la quinta variabile per il momento non vengono utilizzate. Quando con il mouse si clicca su una farfalla, le farfalle rimangono tutte nella stessa posizione x e y, ma la variabile 4 viene utilizzata (per tutte le farfalle) in luogo della variabile 3 per la grandezza delle ali. Cliccando ancora viene utilizzata la variabile 5, e poi di nuovo la variabile 3, in modo ciclico. Fai in modo che le transizioni avvengano con un'animazione fluida. Usa le scale d3.js per mappare il dominio dei valori delle variabili (che deve essere arbitrario) sul range dei valori delle coordinate o delle grandezze delle farfalle, che invece dipende dalla tua visualizzazione.

