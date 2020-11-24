// fare una chiamata ajax per recuperare una decina di dischi musicali e utilizzando
// vue, stampare a schermo una card per ogni album.

// BONUS 1: Creare una select con tutti i generi dei dischi. In base al genere che viene selezionato nella select, vengono visualizzati i cd corrispondenti.
// N.B.: per fare questo punto non è necessario modificare l'array dei dati

// BONUS 2: Ordinare i dischi per anno di uscita.

// link api: 'https://flynn.boolean.careers/exercises/api/array/music'

const app = new Vue({
    el: '#root',
    data: {
        songs: [],
        genres: [],
        currentGenre: '',
        sortingMethod: 'year',
        sortingOrder: -1,
    },
    methods: {
        changeSorting() {
            this.songs.sort(compare);
        }
    },
    mounted() {
        axios.get('https://flynn.boolean.careers/exercises/api/array/music')
            .then(result => {
                this.songs = result.data.response;
                this.changeSorting();

                this.songs.forEach(song => {
                    if (!this.genres.includes(song.genre)) {
                        this.genres.push(song.genre);
                    }
                });
                this.genres.sort()

        });

    }
});

function compare(a, b) {
    const selectedKey = app.sortingMethod;
    const selectedOrdering = parseInt(app.sortingOrder);

    if(isNaN(a[selectedKey])) {
        if (a[selectedKey] < b[selectedKey]) {
            return selectedOrdering;
        } else {
            return -selectedOrdering;
        }
    } else {
        if (parseInt(a[selectedKey]) < parseInt(b[selectedKey])) {
            return selectedOrdering;
        } else {
            return -selectedOrdering;
        }
    }
}
