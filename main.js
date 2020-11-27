const baseURLAPI = 'https://api.themoviedb.org/3';
const api_key = 'a6029345db17cec20afdcb6beac01172';

const app = new Vue({
    el: '#root',
    data: {
        contentVisibility: 'visible',
        movies: [],
        otherMoviesProperties: [],
        tvShows: [],
        otherTVShowsProperties: [],
        searchStatus: false,
        searching: false,
        searchedText: '',
        lastSearchedText: '',
        availableFlags: ['en', 'it', 'es', 'fr', 'zh'],
    },
    methods: {
        toggleSearchBar() {
            this.searchStatus = !this.searchStatus;
            Vue.nextTick(() => {
                this.$refs.search.focus();
            });
        },
        search() {
            this.searchedText = this.searchedText.trim();

            if(this.searchedText) {
                this.searching = true;
                this.lastSearchedText = this.searchedText
                this.otherMoviesProperties = [];

                const params = {
                    api_key,
                    query: this.lastSearchedText,
                    language: "it"
                }

                this.movies = [];
                axios.get(baseURLAPI + '/search/movie', {params})
                //copio l'array di film nella variabile di istanza movies
                    .then(result => {
                        this.movies = result.data.results;
                    }).then(() => {
                        let contatore = 0;
                        //Dopo aver copiato i film ciclo l'array ottenuto
                        this.movies.forEach((movie, index) => {
                            let movieProperties = {};

                            const newParams = {
                                params: {
                                    api_key,
                                    language: 'it'
                                }
                            }
                            // Richiesta per ricavare gli attori
                            const actorsRequest = axios.get(baseURLAPI + '/movie/' + movie.id + '/credits', newParams);
                            // Richiesta per ricavare i generi
                            const genresRequest = axios.get(baseURLAPI + '/movie/' + movie.id, newParams);

                            // Quando entrambe le richieste sono tornate:
                            axios.all([actorsRequest, genresRequest])
                                .then(axios.spread((...results) => {
                                    // salvo i primi 5 attori di tutti i film trovati in un array
                                    let actors = [];
                                    const cast = results[0].data.cast;
                                    for (let i = 0; i < 5; i++) {
                                        if(cast[i]) {
                                            actors.push(cast[i].name);
                                        }
                                    }

                                    movieProperties = {
                                        title: movie.title,
                                        actors,
                                        genres: results[1].data.genres
                                    }

                                    Vue.set(this.otherMoviesProperties, index, movieProperties)
                                    contatore++;

                                    console.log(movieProperties);
                                    console.log(contatore);
                                    // this.otherMoviesProperties.push(movieProperties); Non li mette in ordine a causa della casualità dell'arrivo delle api
                                    if(contatore == this.movies.length) {
                                        this.searching = false;
                                    }
                                    console.log(this.searching);
                                }))
                        });
                    });

                this.tvShows = [];
                axios.get(baseURLAPI + '/search/tv', {params})
                    .then(result => {
                        this.tvShows = result.data.results;
                        this.cardsTVShowsFaces = this.tvShows.map(element => true);
                        // this.searching = false;
                    })

            }
        },
        stars(rating) {
            return Math.round(rating / 2);
        },
    },
});
