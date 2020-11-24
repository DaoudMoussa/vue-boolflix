
const app = new Vue({
    el: '#root',
    data: {
        movies: {
            foundMovies: [],
            visible: false
        },
        tvShows: {
            foundTVShows: [],
            visible: false
        },
        searchedText: '',
        availableFlags: ['en', 'it', 'es', 'fr', 'zh']
    },
    methods: {
        search() {
            const params = {
                api_key: 'a6029345db17cec20afdcb6beac01172',
                query: this.searchedText,
                language: "it"
            }

            axios.get('https://api.themoviedb.org/3/search/movie', {params})
                .then(result => {
                    this.movies.foundMovies = result.data.results;
                });

            axios.get('https://api.themoviedb.org/3/search/tv', {params})
                .then(result => {
                    this.tvShows.foundTVShows = result.data.results;
                })

            this.searchedText = '';
        },
        stars(rating) {
            return Math.round(rating / 2);
        },
        toggleTVShows() {
            this.tvShows.visible = !this.tvShows.visible;
        },
        toggleMovies() {
            this.movies.visible = !this.movies.visible;
        }
    }
});
