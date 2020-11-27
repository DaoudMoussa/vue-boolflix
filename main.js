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
        searchingTVShows: false,
        searchingMovies: false,
        searchedText: '',
        lastSearchedText: '',
        availableFlags: ['en', 'it', 'es', 'fr', 'zh'],
        searching: false
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
                this.searchingMovies = true;
                this.searchingTVShows = true;
                this.lastSearchedText = this.searchedText;

                const params = {
                    api_key,
                    query: this.lastSearchedText,
                    language: "it"
                }

                this.otherMoviesProperties = [];
                this.movies = [];
                axios.get(baseURLAPI + '/search/movie', {params})
                //copio l'array di film nella variabile di istanza movies
                    .then(result => {
                        this.movies = result.data.results;
                    }).then(() => {
                        if(this.movies.length) {
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
                                    // this.otherMoviesProperties.push(movieProperties); Non li mette in ordine a causa della casualità dell'arrivo delle api

                                    contatore++;
                                    if(contatore == this.movies.length) {
                                        this.searchingMovies = false;
                                        this.searching = this.searchingMovies || this.searchingTVShows;
                                    }
                                }));
                        });
                        } else {
                            this.searchingMovies = false;
                            this.searching = !this.searchingMovies && !this.otherTVShowsProperties
                        }
                    });

                this.otherTVShowsProperties = [];
                this.tvShows = [];
                axios.get(baseURLAPI + '/search/tv', {params})
                    .then(result => {
                        this.tvShows = result.data.results;
                    }).then(() => {
                        if(this.tvShows.length) {
                            let cont = 0;
                            //Dopo aver copiato i film ciclo l'array ottenuto
                            this.tvShows.forEach((tvShow, index) => {
                            let tvShowProperties = {};

                            const newParams = {
                                params: {
                                    api_key,
                                    language: 'it'
                                }
                            }
                            // Richiesta per ricavare gli attori
                            const actorsRequest = axios.get(baseURLAPI + '/tv/' + tvShow.id + '/credits', newParams);
                            // Richiesta per ricavare i generi
                            const genresRequest = axios.get(baseURLAPI + '/tv/' + tvShow.id, newParams);

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

                                    tvShowProperties = {
                                        name: tvShow.name,
                                        actors,
                                        genres: results[1].data.genres
                                    }

                                    Vue.set(this.otherTVShowsProperties, index, tvShowProperties)
                                    // this.otherMoviesProperties.push(movieProperties); Non li mette in ordine a causa della casualità dell'arrivo delle api

                                    cont++;
                                    console.log(cont);
                                    if(cont == this.tvShows.length) {
                                        this.searchingTVShows = false;
                                        this.searching = this.searchingMovies && this.searchingTVShows;
                                    }
                                }));
                        });
                        } else {
                            this.searchingTVShows = false;
                            this.searching = !this.searchingMovies && !this.otherTVShowsProperties
                        }
                    });

            }
        },
        stars(rating) {
            return Math.round(rating / 2);
        },
    },
});
