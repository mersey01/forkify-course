import icons from 'url:../../img/icons.svg';
import View from './view.js'
class SearchView extends View {
    #parentEl = document.querySelector('.search');

    getQuery() {
        const query = this.#parentEl.querySelector('.search__field').value;
        this.#clear();
        return query;
    } 

    addHandlerSearch(subscriber) {
        this.#parentEl.addEventListener('submit', function (e) {
            e.preventDefault();
            subscriber();
        });
    }

    #clear() {
        this.#parentEl.querySelector('.search__field').value = '';
    }
}

export default new SearchView();