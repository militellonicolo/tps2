const urlJSON = 'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-andamento-nazionale.json';

async function caricaDati(numeroGiorni) {
    const tabella = document.getElementById('tabella-covid');
    const sottotitolo = document.getElementById('testo-sottotitolo');

    sottotitolo.innerText = "Visualizzazione degli ultimi " + numeroGiorni + " giorni";
    tabella.innerHTML = '<tr><td>Caricamento dati... ⏳</td></tr>';

    try {
        const risposta = await fetch(urlJSON);
        const dati = await risposta.json();
        
        const datiSelezionati = dati.slice(-numeroGiorni);
        const chiavi = Object.keys(datiSelezionati[0]);

        let contenutoHtml = '<thead><tr>';
        
        chiavi.forEach(function(chiave) {
            let chiavePulita = chiave.replace(/_/g, ' ');
            contenutoHtml += '<th>' + chiavePulita + '</th>';
        });
        
        contenutoHtml += '</tr></thead><tbody>';

        datiSelezionati.forEach(function(giorno) {
            contenutoHtml += '<tr>';
            
            chiavi.forEach(function(chiave) {
                let valore = giorno[chiave];

                if (chiave === 'data') {
                    valore = new Date(valore).toLocaleDateString('it-IT');
                } else if (typeof valore === 'number') {
                    valore = valore.toLocaleString('it-IT');
                }

                contenutoHtml += '<td>' + valore + '</td>';
            });
            
            contenutoHtml += '</tr>';
        });

        contenutoHtml += '</tbody>';
        tabella.innerHTML = contenutoHtml;

    } catch (errore) {
        console.error("Errore nel caricamento:", errore);
        tabella.innerHTML = '<tr><td style="color: red;">Impossibile caricare i dati.</td></tr>';
    }
}

// Avvio iniziale
caricaDati(10);

// Evento sul pulsante con sintassi tradizionale
document.getElementById('btn-aggiorna').addEventListener('click', function() {
    const giorniScelti = document.getElementById('input-giorni').value;
    if (giorniScelti > 0) {
        caricaDati(giorniScelti);
    }
});
