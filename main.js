const baseURLAPI = 'https://api.themoviedb.org/3';
const api_key = 'a6029345db17cec20afdcb6beac01172';

const newParams = {
    params: {
        api_key,
        language: 'it'
    }
};
const app = new Vue({
    el: '#root',
    data: {
        contentVisibility: 'visible',
        movies: [],
        otherMoviesProperties: [],
        tvShows: [],
        otherTVShowsProperties: [],
        searchStatus: false,
        searchingTVShows: true,
        searchingMovies: true,
        searching: true,
        searchedText: '',
        lastSearchedText: '',
        availableFlags: ['en', 'it', 'es', 'fr', 'zh'],
        movieGenresList: [{id: 0, name: 'Tutti'}],
        tvShowsGenresList: [{id: 0, name: 'Tutti'}],
        activeMoviesFilter: 0,
        activeTVShowsFilter: 0,
    },
    methods: {
        toggleSearchBar() {
            this.searchStatus = !this.searchStatus;
            if(this.searchStatus) {
                Vue.nextTick(() => {
                    this.$refs.search.focus();
                });
            }
        },
        search() {
            this.searchedText = this.searchedText.trim();

            if(this.searchedText) {
                this.searching = true;
                this.searchingMovies = true;
                this.searchingTVShows = true;
                this.lastSearchedText = this.searchedText;

                const params = {
                    params: {
                        api_key,
                        query: this.lastSearchedText,
                        language: "it"
                    }
                };

                this.otherMoviesProperties = [];
                this.movies = [];
                axios.get(baseURLAPI + '/search/movie', params)
                //copio l'array di film nella variabile di istanza movies
                    .then(result => {
                        this.movies = result.data.results;
                    }).then(() => this.getMoviesProperties());


                this.otherTVShowsProperties = [];
                this.tvShows = [];
                axios.get(baseURLAPI + '/search/tv', params)
                    .then(result => {
                        this.tvShows = result.data.results;
                    }).then(() => this.getTVShowsProperties());

            }
        },
        stars(rating) {
            return Math.round(rating / 2);
        },
        getMoviesProperties() {
                if(this.movies.length) {
                    let contatore = 0;
                    //Dopo aver copiato i film ciclo l'array ottenuto
                    this.movies.forEach((movie, index) => {
                    let movieProperties = {};


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
                    //Se è vuoto quello dei film aspetta quello delle serie
                    this.searching = !this.searchingMovies && !this.otherTVShowsProperties
                }
        },
        getTVShowsProperties() {
            if(this.tvShows.length) {
                let contatore = 0;
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

                        contatore++;
                        if(contatore == this.tvShows.length) {
                            this.searchingTVShows = false;
                            this.searching = this.searchingMovies && this.searchingTVShows;
                        }
                    }));
            });
            } else {
                this.searchingTVShows = false;
                this.searching = !this.searchingMovies && !this.otherTVShowsProperties
            }
        },
        isGenreInMovies(genre) {
            let contained = false;
            this.movies.forEach(movie => {
                if(movie.genre_ids.includes(genre)) {
                    contained = true;
                }
            });
            return contained;
        },
        isGenreInTVShows(genre) {
            let contained = false;
            this.tvShows.forEach(tvShow => {
                if(tvShow.genre_ids.includes(genre)) {
                    contained = true;
                }
            });
            return contained;
        },
    },
    mounted() {
        axios.get(baseURLAPI + '/genre/movie/list', newParams)
            .then(result => {
                this.movieGenresList.push(...result.data.genres);
            });

        axios.get(baseURLAPI + '/genre/tv/list', newParams)
            .then(result => {
                this.tvShowsGenresList.push(...result.data.genres);
            });

        axios.get(baseURLAPI + "/trending/movie/week", {params: {api_key}})
            .then(response => {
                this.movies = response.data.results;
            }).then(() => this.getMoviesProperties());

        axios.get(baseURLAPI + "/trending/tv/week", {params: {api_key}})
            .then(response => {
                this.tvShows = response.data.results;
            }).then(() => this.getTVShowsProperties());
    }
});
