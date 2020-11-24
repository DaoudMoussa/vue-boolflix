
const app = new Vue({
    el: '#root',
    data: {
        foundMovies: [],
        searchedText: '',

    },
    methods: {
        search() {
            const params = {
                api_key: 'a6029345db17cec20afdcb6beac01172',
                query: this.searchedText,
                language: it
            }
            axios.get('https://api.themoviedb.org/3/search/movie', {params})
                .then(result => {
                    this.foundMovies = result.data.results;
                });
        }
    }
});
