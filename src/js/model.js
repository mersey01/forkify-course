import { API_URL, API_KEY, RECIPE_PER_PAGE } from './config.js'
import { AJAX } from './helpers.js'
export const state = {
    recipe: {},
    search: {
        query: '',
        results: []
    },
    bookmarks: [],
    pagination: {
        page: 1,
        numPages: 1
    }
}

export const loadRecipe = async function (recipeID) {
    const bookmark = (state.bookmarks?.length) ? state.bookmarks.filter(b => b.id == recipeID) : [];
    try {
        if (bookmark.length) {
            state.recipe = bookmark[0];
        } else {
            const data = await AJAX(`${API_URL}/${recipeID}?key=${API_KEY}`);
            if (!data.data.recipe) throw new Error('No recipe data');
            const { id, title, publisher, image, servings, ingredients, bookmarked } = data.data.recipe;
            state.recipe = formatForApp(data.data.recipe);
            console.log(state.recipe);
        }
    } catch (err) {
        console.log(`💥Error: ${err}`);
        throw err
    }
}

export const loadSearchResults = async function (query) {
    try {
        state.search.query = query;
        const data = await AJAX(`${API_URL}${'?search=' + query}&key=${API_KEY}`)

        state.search.results = data.data.recipes.map((rec) => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,
                ...(rec.key && {key: rec.key})
            }
        });
        state.pagination.page = 1;
        state.pagination.numPages = Math.ceil(state.search.results.length / RECIPE_PER_PAGE);
    } catch (err) {
        throw err;
    }
}

export const getSearchResultsPage = function (page = state.pagination.page) {
    if (!state.search.results.length) return;
    state.pagination.page = page;
    const start = RECIPE_PER_PAGE * (page - 1);
    const end = (state.search.results.length >= page * RECIPE_PER_PAGE) ? RECIPE_PER_PAGE * page : state.search.results.length;
    return state.search.results.slice(start, end);
}

export const getBookmarkedRecipes = function () {
    return (state.bookmarks) ? state.book : null;
}

export const updateServings = function (newServings) {
    state.recipe?.ingredients?.map(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
    });
    state.recipe.servings = Number(newServings);
}

export const updateBookmark = function (recipe) {
    if(recipe.bookmarked || (isBookmarked(recipe.id))) {
        state.bookmarks = state.bookmarks.filter(b => b.id !== recipe.id)
    } else {
        state.bookmarks.push(recipe);
    }
    if (recipe.id == state.recipe.id) state.recipe.bookmarked = !state.recipe.bookmarked;
}

const isBookmarked = function (id) {
    if (!state.bookmarks) return false
    (state.bookmarks?.some(b => b.id === recipe.id))
    return state.bookmarks.some(bookmark => bookmark.id === id)
}

const formatForApp = function (recipe) {
    const { id, title, publisher, servings, ingredients, key } = recipe;
    return {
        id,
        title,
        publisher,
        servings,
        ingredients,
        bookmarked: isBookmarked(recipe.id),
        image: recipe.image_url,
        sourceUrl: recipe.source_url,
        cookingTime: recipe.cooking_time,
        key: key ? key : ''
        // ...(key && {key: key})
    }
}

const formatToSend = function (recipe, ingredients) {
    const { publisher, title, image, sourceUrl, cookingTime, servings } = recipe;
    return recipe = {
        publisher,
        title,
        ingredients,
        image_url: image,
        source_url: sourceUrl,
        cooking_time: +cookingTime,
        servings: +servings
    }
}

export const uploadRecipe = async function (newRecipe) {
    try {
        const { cookingTime, image, publisher, servings, sourceUrl, title } = Object.fromEntries(newRecipe);
        const ingredients = newRecipe.filter(entry => (entry[0].startsWith('ingredient') && entry[1] !== ''))
            .map((ingredient, i) => {
                const ingArr = ingredient[1].trim().split(',');
                if (ingArr.length !== 3) throw new Error(`Ingedient ${i} not in correct format: qty, unit, description`);
                const [quantity, unit, description] = ingArr;
                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description
                };
            });

        const recipe = formatToSend(Object.fromEntries(newRecipe), ingredients);
        const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe, 'POST');

        if (!data.data) throw new Error('No data');
        if (data.status !== 'success') return;
        state.recipe = data.data.recipe;
        updateBookmark(data.data.recipe);
    } catch (err) {
        throw err;
    }
}