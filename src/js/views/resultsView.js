import View from './view.js';
import icons from 'url:../../img/icons.svg';
class ResultsView extends View {
    _errorMessage = 'No results!';
    _parentElement = document.querySelector('.results');

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
                            ${d.key ? `<svg>
                <use href="${icons}#icon-user"></use>
              </svg>` : ``}
                            </div>
                        </div>
                    </a>
                </li>
                `}).join('');
        return markup;
    }

    resetPreviewFormat(id) {
        document.querySelector('.preview__link--active')?.classList.remove('preview__link--active');
        document.querySelector(`[href$='${id}']`)?.classList.add('preview__link--active');
    }
}

export default new ResultsView();