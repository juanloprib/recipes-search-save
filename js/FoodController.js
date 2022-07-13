/* 
  CREATED BY: JUAN DAVID LOPERA
  MVC Architecture
*/


/* CONTROLLER */

export class FoodController {

  constructor(model, view) {
  
    const that = this;
    this.model = model;
    this.view = view;

    // get saved recipes
    let numberOfSaved = this.model.getNumberOfRecipes();
    if(numberOfSaved > 0){
      const mySavedRecipes = this.model.getSavedRecipes();
      this.view.displaySavedRecipes(mySavedRecipes);
    }

    // listen for yummly response from model
    document.addEventListener("foodApiResponse", function(e) {
      const searchRecipes = e.detail.feed;
      that.view.emptyResultsContainer();
      try {
        for(let i = 0;i < searchRecipes.length;i++){
          const recipe = searchRecipes[i].display;
          const resultTitle = recipe.displayName;
          const resultImg = recipe.images[0];
          const resultLink = recipe.source.sourceRecipeUrl;
          let hideSaveBtn = false;
          if(that.model.isRecipeSaved(resultLink) > -1){
            hideSaveBtn = true;
          }
          that.view.createResult(
            resultTitle,
            resultImg,
            resultLink,
            false,
            hideSaveBtn,
            false
          );
        }
        if(searchRecipes.length == 0){
          that.view.error("Sorry, no results for the query.");
        }
      } catch(e) {
          console.log(e);
          that.view.error("An error has ocurred, please try again.");
      }
      that.view.loading(false);
    });

    // listen for errors from model
    document.addEventListener("foodApiError", function(e) {
      that.view.error("An error has ocurred, please try again.");
    });

    // listen for view search event 
    document.addEventListener("viewSearch", function(e) {
      that.search();
    });

    // listen for view save event 
    document.addEventListener("viewSave", function(e) {
      const wasSaved = that.model.saveRecipe(
        e.detail.title,
        e.detail.img,
        e.detail.url
      );
      if(wasSaved){
        e.detail.target.remove();
        that.view.setNumberOfRecipes(that.model.getNumberOfRecipes());
        that.view.displayNoRecipesSaved(false);
      }
    });

    // listen for view delete event 
    document.addEventListener("viewDelete", function(e) {
      that.model.deleteRecipe(e.detail);
      that.view.setNumberOfRecipes(that.model.getNumberOfRecipes());
      if(that.model.getNumberOfRecipes() == 0){
        that.view.displayNoRecipesSaved(true);
      }
    });

  }

  // search for query on input
  search() {
    this.model.foodSearch(this.view.getQuery());
  }

}