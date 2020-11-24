
const app = new Vue({
    el: '#root',
    data: {
    },
    methods: {
    },
    mounted() {

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
