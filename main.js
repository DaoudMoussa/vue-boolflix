
const app = new Vue({
    el: '#root',
    data: {
        contentVisibility: 'visible',
        movies: {
            foundMovies: [],
            visible: false
        },
        tvShows: {
            foundTVShows: [],
            visible: false
        },
        searchStatus: false,
        searching: false,
        searchedText: '',
        lastSearchedText: '',
        availableFlags: ['en', 'it', 'es', 'fr', 'zh']
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
                this.searchedText = '';
                const params = {
                    api_key: 'a6029345db17cec20afdcb6beac01172',
                    query: this.lastSearchedText,
                    language: "it"
                }

                this.movies.foundMovies = [];
                axios.get('https://api.themoviedb.org/3/search/movie', {params})
                    .then(result => {
                        this.movies.foundMovies = result.data.results;
                    });

                this.tvShows.foundTVShows = [];
                axios.get('https://api.themoviedb.org/3/search/tv', {params})
                    .then(result => {
                        this.tvShows.foundTVShows = result.data.results;
                        this.searching = false;
                    })

            }
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
