import icons from 'url:../../img/icons.svg';
import View from './view.js';
import { pagination } from '../controller.js';

class PaginationView extends View {
    _errorMessage = '';
    _parentElement = document.querySelector('.pagination');

    render(data) {
        // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError()
        // this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }

    addHandlerClick(subscriber) {
        this._parentElement.addEventListener('click', function (e) {
            const el = e.target.closest('button');
            subscriber[el.dataset.action]();
        });
    }

    _generateMarkup() {
        const markup = ((pagination.page > 1 && pagination.page <= pagination.numPages) ? `
                <button data-action="prev" class="btn--inline pagination__btn--prev">
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${pagination.page - 1} </span>
                </button>` : ``) +
            ((pagination.page < pagination.numPages) ? `
                <button data-action="next" class="btn--inline pagination__btn--next">
                    <span>Page ${pagination.page + 1}</span>
                    <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                </button>`: ``);
        return markup;
    }
}
export default new PaginationView();