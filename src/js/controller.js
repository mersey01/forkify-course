import 'core-js/stable';
import 'regenerator-runtime/runtime';

import * as model from './model.js'
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarkView from './views/bookmarkView.js';
import addRecipeView from './views/addRecipeView.js';
import icons from 'url:../img/icons.svg';
import { MODAL_CLOSE_SEC } from './config.js';
import paginationView from './views/paginationView.js';

// https://forkify-api.herokuapp.com/v2
/////////////////////
// let recipeID = `5ed6604591c37cdc054bcd09`;
let searchWord = 'pizza';
const controlRecipe = async function (event) {
  try {
    const recipeID = window.location.hash.slice(1);
    if (!recipeID) return;

    recipeView.renderSpinner();

    // 1. Load recipe
    await model.loadRecipe(recipeID);
    // 0. Update results view
    resultsView.update(model.getSearchResultsPage());


    // 2. Rendering recipe
    recipeView.render(model.state.recipe);

  } catch (err) {
    console.error(`💥 ${err}`);
    recipeView.renderError();
  }
}

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render();
  } catch (err) {

  }
}

const controlPagination = {
  next: () => {
    resultsView.render(model.getSearchResultsPage(pagination.page + 1));
    paginationView.render();
  },
  prev: () => {
    resultsView.render(model.getSearchResultsPage(pagination.page - 1));
    paginationView.render();
  }
}

const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
}

const controlUpdateBookmark = function () {
  model.updateBookmark(model.state.recipe);
  recipeView.update(model.getSearchResultsPage())
  //if (model.state.bookmarks)
  bookmarkView.update(model.state.bookmarks);
}

const controlAddRecipe = async function (newRecipe) {
  try {

    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    bookmarkView.update(model.state.bookmarks);

    recipeView.render(model.state.recipe);
    window.location.hash = model.state.recipe.id

    addRecipeView.renderMessage();

    // Close form after delay
    setTimeout(() => {
      addRecipeView._toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);

  } catch (err) {
    console.error(`💥${err}`);
    addRecipeView.renderError();
  }
}

const controlStateToStorage = function () {
  localStorage.removeItem('bookmarks');
  if (model.state.bookmarks.length) {
    localStorage.setItem('bookmarks', JSON.stringify(model.state.bookmarks));
  }
}

const controlStateFromStorage = function () {
  const bookmarkStorage = localStorage.getItem('bookmarks');
  if (bookmarkStorage) {
    model.state.bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    bookmarkView.render(model.state.bookmarks);
  }
}
const init = () => {
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlUpdateBookmark);
  recipeView.addHandlerLoad(controlStateFromStorage);
  recipeView.addHandlerUnload(controlStateToStorage);
  searchView.addHandlerSearch(controlSearchResults);

  paginationView.addHandlerClick(controlPagination);

  addRecipeView.addHandlerUpload(controlAddRecipe);
  // bookmarkView.addHandlerClick();
}

init();

export const pagination = model.state.pagination;