// selezione delle variabili
let selectedVar = 3;
// dataset dati multivariati 10 data-point 
d3.json("data/dataset.json").then(function (data) {

  // Definisci le dimensioni del contenitore svg
  var width = 1800;
  var height = 1000;

  //definisco la grandezza delle farfalle che ho creato
  var butterflyWidth = 100;
  var butterflyHeight = 100;
  
  // Crea un contenitore svg e imposta le dimensioni
  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  // Definisci le scale d3.js per la posizione e grandezze delle farfalle
  var xScale = d3.scaleLinear().domain([0, d3.max(data, d => d.x)]).range([0, 1000]);
  var yScale = d3.scaleLinear().domain([0, d3.max(data, d => d.y)]).range([0, 600]);
  var sizeScale = d3.scaleLinear().domain([0, d3.max(data, d => selectedVar === 3 ? d.wing : selectedVar === 4 ? d.var4 : d.var5)]).range([10, 20]);

  // Aggiungi le farfalle al grafico
  var butterfly = svg.selectAll(".butterfly")
    .data(data)
    .enter().append("g")
    .attr("class", "butterfly")
    .attr("width", butterflyWidth)
    .attr("height", butterflyHeight)
    .attr("transform", d => `translate(${xScale(d.x)}, ${yScale(d.y)})`);

  // Aggiungi un contenitore per il corpo della farfalla
  var bodyContainer = butterfly.append("g")
    .attr("class", "body-container");

  // Aggiungi un contenitore per le ali della farfalla
  var wingContainer = butterfly.append("g")
    .attr("class", "wing-container");

  /**
   * Una farfalla è composta da una linea e due triangoli per farla il più stilizzata possibile
   * 
   *                                  |\|/|
   *                                  |/|\|
   */

  
  // Aggiungi una Linea per il corpo della farfalla nel contenitore delle ali
  wingContainer.append("line")
    .attr("class", "body")
    .attr("x1", 50)
    .attr("y1", 10)
    .attr("x2", 50)
    .attr("y2", 90)
    .style("stroke", "brown")
    .style("stroke-width", 4);

  // Aggiungiamo il triangolo sinistro ruotato
  wingContainer.append("polygon")
    .attr("class", "left-wing")
    .attr("points", "50,10 20,40 50,70")
    .attr("transform", "rotate(-180, 35, 40)")
    .style("fill", function (d) { return d.color; })
    .style("stroke", "orange")
    .style("stroke-width", 2);

  // Aggiungiamo il triangolo destro ruotato
  wingContainer.append("polygon")
    .attr("class", "right-wing")
    .attr("points", "50,10 80,40 50,70")
    .attr("transform", "rotate(180, 65, 40)")
    .style("fill", function (d) { return d.color; })
    .style("stroke", "orange")
    .style("stroke-width", 2);

  //seleziona la prima farfalla per default
  var currentButterfly = null;
  var butterflies = d3.selectAll(".butterfly");


  butterfly.on("click", function () {
    //assegnamo un nuovo valore alla variabile selectedVar (impostata di default a 3) in base al valore corrente
    //se il valore è uguale a 3, il valore di selectedVar diventerà 4 sennò diventerà 5.
    selectedVar = selectedVar === 3 ? 4 : selectedVar === 4 ? 5 : 3;
    console.log("click")
    butterflies.transition().duration(1000)
    //qui applico la trasformazione, xScale e yScale rimangono inalterate con le due variabili che identificano l'asse x e y corrispettivamente
    // per la sizeScale delle Ali, si effetua la traslazione in base al valore assunto da selectedVar ( 3, 4 o 5)
    .attr("transform", d => `translate(${xScale(d.x)}, ${yScale(d.y)}) scale(${sizeScale(selectedVar === 3 ? d.wing : selectedVar === 4 ? d.var4 : d.var5) / 20})`);
  });
});
