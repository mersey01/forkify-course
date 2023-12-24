import View from './view.js';
import icons from './../../img/icons.svg';

class BookmarkView extends View {
    _parentElement = document.querySelector('.bookmarks__list');
    _generateMarkup() {
        const id = window.location.hash.slice(1);
        const markup = this._data.map(d => {
            return `
                <li class="preview">
                    <a class="preview__link ${d.id === id ? 'preview__link--active' : ''}" href="#${d.id}">
                        <figure class="preview__fig">
                        <img src="${d.image}" alt="Test" />
                        </figure>
                        <div class="preview__data">
                            <h4 class="preview__title">${d.title}</h4>
                            <p class="preview__publisher">${d.publisher}</p>
                            <div class="preview__user-generated">
                                <svg>
                                    <use href="${icons}#icon-user"></use>
                                </svg>
                            </div>
                        </div>
                    </a>
                </li>
                `}).join('');
        return markup;
    }

    update(data) {
        this._data = data;
        this._clear();
        this._parentElement.insertAdjacentHTML('beforeend', this._generateMarkup());
    }
}

export default new BookmarkView();