import icons from 'url:../../img/icons.svg';
import View from './view.js';

class AddRecipeView extends View {
    _errorMessage = 'Recipe upload unsuccessful :(';
    _message = 'Recipe was successfully uploaded :)';
    _parentElement = document.querySelector('.upload');
    _window = document.querySelector('.add-recipe-window');
    _overlay = document.querySelector('.overlay');
    _btnClose = document.querySelector('.btn--close-modal');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');

    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow();
    }

    _toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
    }
    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
    }
    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this._toggleWindow.bind(this));
    }

    addHandlerUpload(subscriber) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = [...new FormData(this)];
            subscriber(formData);
        })
    }

    _generateMarkup() {
    }
}
export default new AddRecipeView();