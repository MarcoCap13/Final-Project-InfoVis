//=====================================================================+
// File name 	: function.js
// Begin	: 9/06/2023
// Last Update	: 
// Description  : InfoVis - Secondo Progetto, libreria con tutte le funzioni
// Author	: Marco Caponi & Gianluca Ceneda
// Versione     : 1.0
//
//=====================================================================+-->

//Variabili globali
var globalFiltro;
var annoSerieStorica = "2018";



function settaNomeFile() {
	annoSerieStorica = document.getElementById('anno').value;
	// Ridisegno il grafico a fronte del cambiamento sulla data.
	updateData(globalFiltro);
}

function compare(a, b) {
	return a.Valore - b.Valore;
}

function compareInverted(a, b) {
	return b.Valore - a.Valore;
}

//****************************************************************************************
//Funzione che esegue il filtraggio dei dati sulla base della scelta utente.
//****************************************************************************************
function filter(data, filtro, DataCalendar, citta) {
	return data.filter(function (item) {
		if (citta === "") {
			return item.Grandezza === filtro && item.DataRilevazione === DataCalendar;
		} else {
			return item.Grandezza === filtro && item.Stazione === citta;
		}
	});
}


//****************************************************************************************
//Funzione che inserisce i titoli negli assi cartesiani.
//****************************************************************************************
function inseriscriTitoloAssi(g, citta, etichettaAsseY) {
	// label asse x
	const xAxisLabelY = citta !== "" ? 400 : 460;
	g.append("text")
		.attr("x", 600)
		.attr("y", xAxisLabelY)
		.style("text-anchor", "middle")
		.text(citta !== "" ? "Anno " + annoSerieStorica : "Citta'");

	// label asse y
	g.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", -55)
		.attr("x", 0 - 200)
		.attr("dy", "1em")
		.style("text-anchor", "middle")
		.text(etichettaAsseY);
}


//****************************************************************************************
//Funzione che inizializza il menu a tendina.
//****************************************************************************************
function init() {
	const nomeFile = `dati/dataset${annoSerieStorica}.csv`;

	d3.dsv(";", nomeFile, function (d) {
		return {
			Stazione: d.Stazione,
			Grandezza: d.Grandezza,
			DataRilevazione: d.DataRilevazione.substring(0, 10),
			Valore: +d.Valore,
			IndiceValidita: d.IndiceValidita

		};
	}).then(function (data) {
		const filtered = filter(data, "TEMPARIA2M_MAXG", "08/01/2018", "");
		const select = d3.select('#citta');

		const options = select
			.selectAll('option')
			.data(filtered)
			.enter()
			.append('option')
			.text(function (d) {
				return d.Stazione;
			})
			.attr("value", function (d) {
				return d.Stazione;
			});
	});
}


//****************************************************************************************
// Funzione utilizzata per spostare in avandi o indietro la data.
//****************************************************************************************
function changeDate(change) {
	const calendarInput = document.getElementById("calendar");
	const dataCalendar = calendarInput.value;

	if (dataCalendar === "") {
		alert("Please enter a date.");
		return;
	}

	const datasplit = dataCalendar.split("/");
	const nextDay = new Date(datasplit[2], datasplit[1] - 1, datasplit[0]);

	if (change === "next") {
		nextDay.setDate(nextDay.getDate() + 1);
	} else if (change === "prev") {
		nextDay.setDate(nextDay.getDate() - 1);
	}

	const day = nextDay.getDate();
	const month = nextDay.getMonth() + 1;
	const year = nextDay.getFullYear();

	const formattedDay = day <= 9 ? "0" + day : day.toString();
	const formattedMonth = month <= 9 ? "0" + month : month.toString();

	calendarInput.value = formattedDay + "/" + formattedMonth + "/" + year;

	updateData(globalFiltro);
}



//****************************************************************************************
//Funzione che aggiorna i dati e disegna il grafico.
//****************************************************************************************
function updateData(filtro) {
	globalFiltro = filtro;

	const annoSerieStorica = document.getElementById("anno").value;
	const nomeFile = `dati/dataset${annoSerieStorica}.csv`;

	d3.dsv(";", nomeFile, function (d) {
		return {
			Stazione: d.Stazione,
			Grandezza: d.Grandezza,
			DataRilevazione: d.DataRilevazione.substring(0, 10),
			Valore: +d.Valore,
			IndiceValidita: d.IndiceValidita,
		};
	}).then(function (data) {
		const DataCalendar = document.getElementById("calendar")?.value;
		const citta = document.getElementById("citta").value;
		// Codice per vedere l'ultimo elemento del csv
		const filteredData = data.filter((row) => row.Stazione === citta);
		const lastRow = filteredData[filteredData.length - 1];


		if (lastRow) {
			const stazione = lastRow.Stazione;
			const dataRilevazione = lastRow.DataRilevazione;
			const indiceValidita = lastRow.IndiceValidita;
		} 

		// Codice per vedere il primo elemento del csv per ogni Stazione
		const firstRow = filteredData[0];

		if (firstRow) {
			const stazione = firstRow.Stazione;
			const dataRilevazione = firstRow.DataRilevazione;
			const indiceValidita = firstRow.IndiceValidita;
		} 

		const filtered = filter(data, filtro, DataCalendar, citta);

		const t = d3.transition().duration(200);

		const svg = d3.select("svg");
		const margin = { top: 30, right: 20, bottom: 170, left: 100 };
		const width = +svg.attr("width") - margin.left - margin.right;
		const height = +svg.attr("height") - margin.top - margin.bottom;

		d3.select("g").remove();
		d3.select("g").remove();

		const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

		if (citta === "") {
			if (d3.select("#myCheckbox").property("checked")) {
				filtered.sort(compare);
			} else {
				filtered.sort(compareInverted);
			}
		}

		const body = d3.select("body");
		const serieTMax = filtered
			.filter((d) => d.Grandezza === filtro && d.DataRilevazione === DataCalendar)
			.map((d) => d.Valore);

		let testoTitolo = "";
		let etichettaAsseY = "";
		switch (filtro) {
			case "TEMPARIA2M_MAXG":
				testoTitolo = "Temperatura Massima";
				etichettaAsseY = "Temperatura (C)";
				break;
			case "TEMPARIA2M_MING":
				testoTitolo = "Temperatura Minima";
				etichettaAsseY = "Temperatura (C)";
				break;
			case "TEMPARIA2M_MEDG":
				testoTitolo = "Temperatura Media";
				etichettaAsseY = "Temperatura (C)";
				break;
			case "UMARIA2M_MEDG":
				testoTitolo = "Umidita' media";
				etichettaAsseY = "Umidita' relativa";
				break;
			case "PREC_TOTG":
				testoTitolo = "Precipitazioni";
				etichettaAsseY = "mm";
				break;
		}

		if (DataCalendar !== "") {
			g.append("text")
				.attr("x", width / 2)
				.attr("y", 0 - margin.top / 2)
				.attr("text-anchor", "middle")
				.style("font-size", "20px")
				.text(`${DataCalendar} - ${testoTitolo}`);
		} else {
			g.append("text")
				.attr("x", width / 2)
				.attr("y", 0 - margin.top / 2)
				.attr("text-anchor", "middle")
				.style("font-size", "20px")
				.text(`${citta} - ${testoTitolo}`);
		}

		const x = d3.scaleBand().rangeRound([0, width]).padding(0.1);
		const y = d3.scaleLinear().rangeRound([height, 0]);

		x.domain(filtered.map((d) => (citta === "" ? d.Stazione : d.DataRilevazione)));
		const maxValore = d3.max(filtered, (d) => d.Valore);
		const minValore = d3.min(filtered, (d) => d.Valore);
		const media = d3.mean(filtered, (d) => d.Valore);
		const urlParams = new URLSearchParams(window.location.search);
		const infoParam = urlParams.get('info');
		if (media !== null && infoParam || infoParam === null) {
			const mediaContainer = document.getElementById("media-container");
			const testButton = document.getElementById("testButton");
			let mediaText = `Media: ${media.toFixed(2)}`;
			let maxText = `Massimo: ${maxValore}`;
			let minText = `Minimo: ${minValore}`;
			if (filtro.includes('TEMP')) {
				mediaText += " °C";
				maxText += " °C";
				minText += " °C";
			} else if (filtro.includes('UMA') || (filtro.includes('PREC'))) {
				mediaText += " %";
				maxText += " %";
				minText += " %";
			}
			mediaContainer.textContent = `${mediaText}\n${maxText}\n${minText}`;
			mediaContainer.style.display = 'block';
			testButton.style.display = 'block';
		}
		if (minValore > 0) {
			y.domain([0, maxValore]);
		} else {
			y.domain(d3.extent(filtered, (d) => d.Valore)).nice();
		}

		if (citta === "" && filtro !== "TEMPARIA2M_MING") {
			g.append("g")
				.attr("class", "axis axis--x")
				.attr("transform", `translate(0,${height})`)
				.call(d3.axisBottom(x))
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)");
		} else if (citta === "" && filtro === "TEMPARIA2M_MING") {
			g.append("g")
				.attr("class", "axis axis--x")
				.attr("transform", `translate(0,${height})`)
				.call(d3.axisBottom(x))
				.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", "-.8em")
				.attr("dy", ".15em")
				.attr("transform", "rotate(-65)");
		}

		g.append("g")
			.attr("class", "axis axis--y")
			.call(d3.axisLeft(y).ticks(10, ""))
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", "0.71em")
			.attr("text-anchor", "end")
			.text("Titolo");

		inseriscriTitoloAssi(g, citta, etichettaAsseY);

		const displayParam = urlParams.get('display');

		if (!displayParam) {
			if (citta !== "") {
				// Aggiungi la linea orizzontale
				g.append("line")
					.attr("class", "linea-orizzontale")
					.attr("x1", x(filtered[0].DataRilevazione)) // Posizione di inizio della linea (estremo sinistro)
					.attr("y1", height + margin.top) // Altezza della linea (estremo inferiore)
					.attr("x2", x(filtered[filtered.length - 1].DataRilevazione) + x.bandwidth()) // Posizione di fine della linea (estremo destro)
					.attr("y2", height + margin.top) // Altezza della linea (estremo inferiore)
					.attr("stroke", "black") // Colore della linea
					.attr("stroke-width", 1); // Spessore della linea

				// Aggiungi le lineette verticali agli estremi sinistro e destro della linea orizzontale
				g.append("line")
					.attr("class", "linea-verticale")
					.attr("x1", x(filtered[0].DataRilevazione)) // Posizione di inizio della linea (estremo superiore)
					.attr("y1", height + margin.top - 5) // Altezza della linea (estremo superiore)
					.attr("x2", x(filtered[0].DataRilevazione)) // Posizione di fine della linea (estremo inferiore)
					.attr("y2", height + margin.top + 5) // Altezza della linea (estremo inferiore)
					.attr("stroke", "black") // Colore della linea
					.attr("stroke-width", 1); // Spessore della linea

				g.append("line")
					.attr("class", "linea-verticale")
					.attr("x1", x(filtered[filtered.length - 1].DataRilevazione) + x.bandwidth()) // Posizione di inizio della linea (estremo superiore)
					.attr("y1", height + margin.top - 5) // Altezza della linea (estremo superiore)
					.attr("x2", x(filtered[filtered.length - 1].DataRilevazione) + x.bandwidth()) // Posizione di fine della linea (estremo inferiore)
					.attr("y2", height + margin.top + 5) // Altezza della linea (estremo inferiore)
					.attr("stroke", "black") // Colore della linea
					.attr("stroke-width", 1); // Spessore della linea

				// Aggiungi il valore di Data di rilevazione all'estremo sinistro della linea
				g.append("text")
					.attr("class", "testo-data")
					.attr("x", x(filtered[0].DataRilevazione))
					.attr("y", height + margin.top + 20)
					.text(`Data di rilevazione iniziale: ${filtered[0].DataRilevazione}`)
					.attr("text-anchor", "start")
					.attr("font-size", "12px");

				// Aggiungi il valore di Data di rilevazione all'estremo destro della linea
				g.append("text")
					.attr("class", "testo-data")
					.attr("x", x(filtered[filtered.length - 1].DataRilevazione) + x.bandwidth())
					.attr("y", height + margin.top + 20)
					.text(`Data di rilevazione finale: ${filtered[filtered.length - 1].DataRilevazione}`)
					.attr("text-anchor", "end")
					.attr("font-size", "12px");

			}
			g.selectAll(".bar")
				.data(filtered)
				.enter()
				.append("rect")
				.on("mouseover", function () {
					tooltip.style("display", null);
					d3.select(this).style("fill", "yellow");
				})
				.on("mouseout", function (filtered) {
					tooltip.style("display", "none");
					d3.select(this).style("fill", function (SerieFiltrata) {
						if (filtro === "TEMPARIA2M_MAXG") {
							return `rgb(${Math.pow(SerieFiltrata.Valore, 2)}, 68, 5)`;
						} else {
							return `rgb(0, 0, ${Math.pow(SerieFiltrata.Valore, 2)})`;
						}
					});
				})
				.on("mousemove", function (filtered) {
					const xPosition = d3.mouse(this)[0] - 15;
					const yPosition = d3.mouse(this)[1] - 25;
					tooltip.attr("transform", `translate(${xPosition},${yPosition})`);
					let txt = "";
					if (citta === "") {
						txt = `${filtered.Stazione}: ${filtered.Valore}`;
					} else {
						txt = `${filtered.DataRilevazione}: ${filtered.Valore}`;
					}

					if (filtro === "UMARIA2M_MEDG" || filtro === "PREC_TOTG") {
						txt = txt + "%";
					} else {
						txt = txt + "°C";
					}
					tooltip.select("text").text(txt);
				})
				.transition(t)
				.attr("class", "bar")
				.attr("x", function (filtered) {
					return citta === "" ? x(filtered.Stazione) : x(filtered.DataRilevazione);
				})
				.attr("y", function (filtered) {
					if (minValore < 0) {
						if (filtered.Valore > 0) {
							return y(filtered.Valore);
						} else {
							return y(0);
						}
					} else {
						return y(filtered.Valore);
					}
				})
				.attr("width", x.bandwidth())
				.attr("height", function (filtered) {
					if (minValore < 0) {
						return Math.abs(y(filtered.Valore) - y(0));
					} else {
						return height - y(filtered.Valore);
					}
				})
				.attr("fill", function (filtered) {
					if (filtro === "TEMPARIA2M_MAXG") {
						return `rgb(${Math.pow(filtered.Valore, 2)}, 68, 5)`;
					} else {
						return `rgb(0, 0, ${Math.pow(filtered.Valore, 2)})`;
					}
				});
		} else {
			if (citta !== "") {
				// Aggiungi la linea orizzontale
				g.append("line")
					.attr("class", "linea-orizzontale")
					.attr("x1", x(filtered[0].DataRilevazione)) // Posizione di inizio della linea (estremo sinistro)
					.attr("y1", height + margin.top) // Altezza della linea (estremo inferiore)
					.attr("x2", x(filtered[filtered.length - 1].DataRilevazione) + x.bandwidth()) // Posizione di fine della linea (estremo destro)
					.attr("y2", height + margin.top) // Altezza della linea (estremo inferiore)
					.attr("stroke", "black") // Colore della linea
					.attr("stroke-width", 1); // Spessore della linea

				// Aggiungi le lineette verticali agli estremi sinistro e destro della linea orizzontale
				g.append("line")
					.attr("class", "linea-verticale")
					.attr("x1", x(filtered[0].DataRilevazione)) // Posizione di inizio della linea (estremo superiore)
					.attr("y1", height + margin.top - 5) // Altezza della linea (estremo superiore)
					.attr("x2", x(filtered[0].DataRilevazione)) // Posizione di fine della linea (estremo inferiore)
					.attr("y2", height + margin.top + 5) // Altezza della linea (estremo inferiore)
					.attr("stroke", "black") // Colore della linea
					.attr("stroke-width", 1); // Spessore della linea

				g.append("line")
					.attr("class", "linea-verticale")
					.attr("x1", x(filtered[filtered.length - 1].DataRilevazione) + x.bandwidth()) // Posizione di inizio della linea (estremo superiore)
					.attr("y1", height + margin.top - 5) // Altezza della linea (estremo superiore)
					.attr("x2", x(filtered[filtered.length - 1].DataRilevazione) + x.bandwidth()) // Posizione di fine della linea (estremo inferiore)
					.attr("y2", height + margin.top + 5) // Altezza della linea (estremo inferiore)
					.attr("stroke", "black") // Colore della linea
					.attr("stroke-width", 1); // Spessore della linea

				// Aggiungi il valore di Data di rilevazione all'estremo sinistro della linea
				g.append("text")
					.attr("class", "testo-data")
					.attr("x", x(filtered[0].DataRilevazione))
					.attr("y", height + margin.top + 20)
					.text(`Data di rilevazione iniziale: ${filtered[0].DataRilevazione}`)
					.attr("text-anchor", "start")
					.attr("font-size", "12px");

				// Aggiungi il valore di Data di rilevazione all'estremo destro della linea
				g.append("text")
					.attr("class", "testo-data")
					.attr("x", x(filtered[filtered.length - 1].DataRilevazione) + x.bandwidth())
					.attr("y", height + margin.top + 20)
					.text(`Data di rilevazione finale: ${filtered[filtered.length - 1].DataRilevazione}`)
					.attr("text-anchor", "end")
					.attr("font-size", "12px");

			}
			g.selectAll(".line")
				.data([filtered])
				.enter()
				.append("path")
				.attr("class", "line")
				.attr("d", function (d) {
					const xValue = citta === "" ? x(d[0].Stazione) : x(d[0].DataRilevazione);
					const yValue = minValore < 0 ? Math.max(y(d[0].Valore), y(0)) : y(d[0].Valore);
					const heightValue = minValore < 0 ? Math.abs(y(d[0].Valore) - y(0)) : height - y(d[0].Valore);

					const lineGenerator = d3.line()
						.x(function (filtered) {
							return citta === "" ? x(filtered.Stazione) : x(filtered.DataRilevazione);
						})
						.y(function (filtered) {
							return minValore < 0 ? Math.max(y(filtered.Valore), y(0)) : y(filtered.Valore);
						})
						.curve(d3.curveCardinal); // Puoi modificare la curva utilizzata

					return lineGenerator(d);
				})
				.style("stroke", function (filtered) {
					if (filtro === "TEMPARIA2M_MAXG") {
						return `rgb(${Math.pow(filtered[0].Valore, 2)}, 68, 5)`;
					} else {
						return `rgb(0, 0, ${Math.pow(filtered[0].Valore, 2)})`;
					}
				})
				.style("fill", "none")
				.on("mouseover", function () {
				})
				.on("mouseout", function (filtered) {
					d3.select(this).style("stroke", function (SerieFiltrata) {
						if (filtro === "TEMPARIA2M_MAXG") {
							return `rgb(${Math.pow(SerieFiltrata[0].Valore, 2)}, 68, 5)`;
						} else {
							return `rgb(0, 0, ${Math.pow(SerieFiltrata[0].Valore, 2)})`;
						}
					});
				})
				.on("mousemove", function (filtered) {
					let txt = "";
					if (citta === "") {
						txt = `${filtered[0].Stazione}: ${filtered[0].Valore}`;
					} else {
						txt = `${filtered[0].DataRilevazione}: ${filtered[0].Valore}`;
					}

					if (filtro === "UMARIA2M_MEDG" || filtro === "PREC_TOTG") {
						txt = txt + "%";
					} else {
						txt = txt + "°C";
					}

				})
				.transition(t)
				.duration(500)
				.attr("d", function (d) {
					const xValue = citta === "" ? x(d[0].Stazione) : x(d[0].DataRilevazione);
					const yValue = minValore < 0 ? Math.max(y(d[0].Valore), y(0)) : y(d[0].Valore);
					const heightValue = minValore < 0 ? Math.abs(y(d[0].Valore) - y(0)) : height - y(d[0].Valore);

					const lineGenerator = d3.line()
						.x(function (filtered) {
							return citta === "" ? x(filtered.Stazione) : x(filtered.DataRilevazione);
						})
						.y(function (filtered) {
							return minValore < 0 ? Math.max(y(filtered.Valore), y(0)) : y(filtered.Valore);
						})
						.curve(d3.curveCardinal); // Puoi modificare la curva utilizzata

					return lineGenerator(d);
				});
		}
		const tooltip = svg.append("g").attr("class", "tooltip").style("display", "none");
		// Definisci il dominio della scala y
		const yScale = d3.scaleLinear();

		if (minValore > 0) {
			yScale.domain([0, maxValore]);
		} else {
			yScale.domain(d3.extent(filtered, (d) => d.Valore)).nice();
		}

		yScale.range([height, 0]);
		function drawHorizontalLine(media) {
			// Rimuovi la linea esistente, se presente
			g.selectAll(".horizontal-line").remove();
			if (!displayParam) {
				// Aggiungi la nuova linea orizzontale al grafico
				g.append("line")
					.attr("class", "horizontal-line")
					.attr("x1", 0)
					.attr("y1", yScale(media))
					.attr("x2", width)
					.attr("y2", yScale(media))
					.attr("stroke", "red")
					.attr("stroke-width", 2);
			}
		}
		drawHorizontalLine(media);
		tooltip
			.append("rect")
			.attr("x", -90)
			.attr("width", 280)
			.attr("height", 20)
			.attr("fill", "white")
			.style("opacity", 0.5);

		tooltip
			.append("text")
			.attr("x", 50)
			.attr("dy", "1.0em")
			.style("text-anchor", "middle")
			.attr("font-size", "16px")
			.attr("font-weight", "bold");
	});
}
