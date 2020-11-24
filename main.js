
const app = new Vue({
    el: '#root',
    data: {
        foundMovies: [],
        foundTVShows: [],
        searchedText: '',
        availableFlags: ['en', 'it', 'es', 'fr', 'zh']
    },
    methods: {
        search() {
            let params = {
                api_key: 'a6029345db17cec20afdcb6beac01172',
                query: this.searchedText,
                language: "it"
            }
            axios.get('https://api.themoviedb.org/3/search/movie', {params})
                .then(result => {
                    this.foundMovies = result.data.results;
                });
            this.searchedText = '';

            // axios.get('https://api.themoviedb.org/3/search/tv?api_key=a6029345db17cec20afdcb6beac01172&query=la casa&language=it', {})
        },
        errore() {
                console.log('errore');
        },
        stars(rating) {
            return Math.round(rating / 2);
        }
    }
});
