/* 
  CREATED BY: JUAN DAVID LOPERA
  MVC Architecture
*/


/* CONTROLLER */


export class FoodController {


  // private properties
  #model;
  #view;


  constructor(model, view) {
  
    // configure private properties
    this.#model = model;
    this.#view = view;

    // initialize app
    this.initSavedRecipes();
    this.initFoodAPIResponseListener();
    this.initFoodApiErrorListener();
    this.initViewSearchListener();
    this.initViewSaveListener();
    this.initViewDeleteListener();

  }


  // get saved recipes
  initSavedRecipes() {
    let numberOfSaved = this.#model.getNumberOfRecipes();
    if(numberOfSaved > 0){
      const mySavedRecipes = this.#model.getSavedRecipes();
      this.#view.displaySavedRecipes(mySavedRecipes);
    }
  }


  // listen for food API response from model
  initFoodAPIResponseListener() {
    const that = this;
    document.addEventListener("foodApiResponse", function(e) {
      const searchRecipes = e.detail.feed;
      that.#view.emptyResultsContainer();
      try {
        for(let i = 0;i < searchRecipes.length;i++){
          const recipe = searchRecipes[i].display;
          const resultTitle = recipe.displayName;
          const resultImg = recipe.images[0];
          const resultLink = recipe.source.sourceRecipeUrl;
          let hideSaveBtn = false;
          if(that.#model.isRecipeSaved(resultLink) > -1){
            hideSaveBtn = true;
          }
          that.#view.createResult(
            resultTitle,
            resultImg,
            resultLink,
            false,
            hideSaveBtn,
            false
          );
        }
        if(searchRecipes.length == 0){
          that.#view.error("Sorry, no results for the query.");
        }
      } catch(e) {
          console.log(e);
          that.#view.error("An error has ocurred, please try again.");
      }
      that.#view.loading(false);
    });
  }


  // listen for food API error from model
  initFoodApiErrorListener() {
    const that = this;
    document.addEventListener("foodApiError", function(e) {
      that.#view.error("An error has ocurred, please try again.");
    });
  }


  // listen for view search event
  initViewSearchListener() {
    const that = this;
    document.addEventListener("viewSearch", async function(e) {
      await that.search();
    });
  }


  // listen for view save event
  initViewSaveListener() {
    const that = this;
    document.addEventListener("viewSave", function(e) {
      const wasSaved = that.#model.saveRecipe(
        e.detail.title,
        e.detail.img,
        e.detail.url
      );
      if(wasSaved){
        e.detail.target.remove();
        that.#view.setNumberOfRecipes(that.#model.getNumberOfRecipes());
        that.#view.displayNoRecipesSaved(false);
      }
    });
  }

  
  // listen for view delete event
  initViewDeleteListener() {
    const that = this;
    document.addEventListener("viewDelete", function(e) {
      that.#model.deleteRecipe(e.detail);
      that.#view.setNumberOfRecipes(that.#model.getNumberOfRecipes());
      if(that.#model.getNumberOfRecipes() == 0){
        that.#view.displayNoRecipesSaved(true);
      }
    });
  }


  // search for query on input
  async search() {
    await this.#model.foodSearch(this.#view.getQuery());
  }


}