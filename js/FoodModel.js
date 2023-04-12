/* 
  CREATED BY: JUAN DAVID LOPERA
  MVC Architecture
*/

import { yummlyAPIKey, yummlyAPIHost, yummlyAPIUrl } from './config.js';

/* MODEL */

export class FoodModel {

  #options;
  #url;
  #maxResults;
  #startResults;
  #myRecipes;

  constructor(settings) {

    const {
      options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': yummlyAPIKey,
          'X-RapidAPI-Host': yummlyAPIHost
        }
      },
      url = yummlyAPIUrl,
      maxResults = "12",
      startResults = "0"
    } = settings;

    // define basic parameters for Yummly
    this.#options = options;
    this.#url = url;
    this.#maxResults = maxResults;
    this.#startResults = startResults;

    // used to retrieve saved recipes from localStorage
    this.#myRecipes = this.getSavedRecipes();

  }

  // search for a particular query in Yummly
  async foodSearch(searchTerm) {
    try {
      const encodedSearch = encodeURI(searchTerm);
      const response = await fetch(this.#url + new URLSearchParams({
        q: encodedSearch,
        maxResult: this.#maxResults,
        start: this.#startResults
      }), this.#options);
      const data = await response.json();
      this.apiResponse(data);
    } catch (err) {
      this.apiError(err);
    }
  }

  // send event with the Yummly response
  apiResponse(apiJson) {
    if(apiJson.hasOwnProperty("feed")){
      const event = new CustomEvent(
        "foodApiResponse",
        {detail: apiJson}
      );
      document.dispatchEvent(event);
    }else{
      this.apiError(apiJson);
    }
  }

  // send event in case of an error
  apiError(theError) {
    // console.log(theError);
    const event = new Event('foodApiError');
    document.dispatchEvent(event);
  }

  // save a recipe in localStorage
  saveRecipe(newTitle, newImage, newURL) {
    const newRecipe = {
      title: newTitle,
      img: newImage,
      url: newURL
    };
    if(this.isRecipeSaved(newURL) === -1){
      this.#myRecipes.unshift(newRecipe);
      localStorage.setItem(
        "recipes",
        JSON.stringify(this.#myRecipes)
      );
      return true;
    }
    return false;
  }

  // delete a recipe using its URL
  deleteRecipe(url) {
    const found = this.isRecipeSaved(url);
    if(found >= 0){
      this.#myRecipes.splice(found, 1);
      localStorage.setItem(
        "recipes",
        JSON.stringify(this.#myRecipes)
      );
      return true;
    }
    return false;
  }

  // retrieve saved recipes object in localStorage
  getSavedRecipes() {
    const saved = localStorage.getItem("recipes");
    let savedRecipes = [];
    if(saved != null){
      try {
        savedRecipes = JSON.parse(saved);
      } catch(e) {
        localStorage.setItem("recipes", "");
      } 
    }
    this.#myRecipes = savedRecipes;
    return this.#myRecipes;
  }

  // get the number of recipes saved in localStorage
  getNumberOfRecipes() {
    return this.#myRecipes.length;
  }

  // test if this recipe is saved using its URL
  isRecipeSaved(url) {
    return this.#myRecipes.findIndex(recipe => {
      if(recipe.url === url){
        return true;
      }
      return false;
    });
  }

}