/* 
  CREATED BY: JUAN DAVID LOPERA
  MVC Architecture
*/


/* VIEW */

export class FoodView {

  // constructor
  constructor() {

    const that = this;
    this.hasDeleted = false; // tracks when a user deletes a recipe. If true search is reloaded to have the save button back

    // get dom elements
    this.sendButton = document.getElementById("search-submit");
    this.queryField = document.getElementById("search-text");
    this.resultsContainer = document.getElementById("search-results");
    this.savedContainer = document.getElementById("saved-results");
    this.loadingScreen = document.getElementById("loading");
    this.navSearchBtn = document.getElementById("nav-search");
    this.navSavedBtn = document.getElementById("nav-saved");

    // focus search input
    this.focusSearch(true);

    // EVENTS:

    // submit search with button
    this.sendButton.addEventListener("click", (event) => {
        that.search();
    });

    // submit with enter key
    this.queryField.addEventListener("keyup", (event) => {
      if(event.key === "Enter"){
        that.search();
      }
    });

    // display saved recipes
    this.navSavedBtn.addEventListener("click", function(e) {
      that.displaySaved(true);
    });

    // display results
    this.navSearchBtn.addEventListener("click", function(e) {
      if(that.hasDeleted){
        that.search();
        that.hasDeleted = false;
      }
      that.displaySaved(false);
    });

    // save and delete recipe 
    document.addEventListener("click", function(e) {

      // save
      if(e.target && e.target.classList.contains("save-recipe")){
        that.createResult(
          e.target.getAttribute("data-title"),
          e.target.getAttribute("data-img"),
          e.target.getAttribute("data-url"),
          true,
          true,
          true
        );
        const saveEvent = new CustomEvent(
          "viewSave",
          {detail: {
            title: e.target.getAttribute("data-title"),
            img: e.target.getAttribute("data-img"),
            url: e.target.getAttribute("data-url"),
            target: e.target
          }}
        );
        document.dispatchEvent(saveEvent);

      // delete
      } else if(e.target && e.target.classList.contains("delete-recipe")) {
        e.target.parentElement.remove();
        const deleteEvent = new CustomEvent(
          "viewDelete",
          {detail: e.target.getAttribute("data-delete")}
        );
        document.dispatchEvent(deleteEvent);
        that.hasDeleted = true;
      }

    });

  }

  // returns the query for the search
  getQuery() {
    return this.queryField.value;
  }

  // if true displays saved recipes
  // If false shows results from search
  displaySaved(showSaved) {
    if(showSaved){
      this.resultsContainer.style.display = "none";
      this.savedContainer.style.display = "flex";
      this.navSearchBtn.classList.remove("selected");
      this.navSavedBtn.classList.add("selected");
    }else{
      this.resultsContainer.style.display = "flex";
      this.savedContainer.style.display = "none";
      this.navSearchBtn.classList.add("selected");
      this.navSavedBtn.classList.remove("selected");
    }
  }

  // toggle no saved recipes message
  displayNoRecipesSaved(showMsg) {
    let msgEl = this.savedContainer.getElementsByTagName("p")[0];
    if(showMsg){
      msgEl.style.display = "block";
    }else{
      msgEl.style.display = "none";
    }
  }

  // create a container for one recipe
  createResult(title, img, url, displayInSaved, hideSave, addBefore) {

    // create elements
    const resultContainer = document.createElement("div");
    const resultImgContainer = document.createElement("div");
    const resultImage = document.createElement("img");
    const resultTitle = document.createElement("h6");
    const resultLink = document.createElement("a");
    const resultSaveBtn = document.createElement("button");
    const resultDeleteBtn = document.createElement("button");

    // add content to elements 
    resultLink.innerText = "See recipe";
    resultSaveBtn.innerText = "Save Recipe";
    resultDeleteBtn.innerText = "Delete recipe";
    resultDeleteBtn.setAttribute("data-delete", url);
    resultSaveBtn.setAttribute("data-title", title);
    resultSaveBtn.setAttribute("data-img", img);
    resultSaveBtn.setAttribute("data-url", url);
    resultLink.href = url;
    resultLink.target = "_blank";
    resultTitle.innerText = title;
    resultImage.src = img;

    // add styles 
    resultContainer.classList.add("search-result");
    resultImgContainer.classList.add("search-result-img");
    resultLink.classList.add("generic-button");
    resultSaveBtn.classList.add(
      "generic-button",
      "secondary-button",
      "save-recipe"
    );
    resultDeleteBtn.classList.add(
      "generic-button",
      "secondary-button",
      "delete-recipe"
    );

    // append elements to dom
    resultImgContainer.appendChild(resultImage);
    resultContainer.appendChild(resultImgContainer);
    resultContainer.appendChild(resultTitle);
    resultContainer.appendChild(resultLink);
    if(displayInSaved){
      resultContainer.appendChild(resultDeleteBtn);
      if(addBefore){
        this.savedContainer.prepend(resultContainer);
      }else{
        this.savedContainer.appendChild(resultContainer);
      }
    }else{
      if(!hideSave){
        resultContainer.appendChild(resultSaveBtn);
      }
      this.resultsContainer.appendChild(resultContainer);
    }

    // image not loaded 
    resultImage.setAttribute(
      "onerror",
      "this.onerror=null;this.src='images/noimage.jpg';this.classList.add('no-image');"
    );
  }

  // display saved recipes
  displaySavedRecipes(savedRecipes) {
    for(let i = 0;i < savedRecipes.length;i++){
      this.createResult(
        savedRecipes[i].title,
        savedRecipes[i].img,
        savedRecipes[i].url,
        true,
        true,
        false
      );
    }
    this.setNumberOfRecipes(savedRecipes.length);
    this.displayNoRecipesSaved(false);
    this.displaySaved(true);
  }

  // remove results container children
  emptyResultsContainer() {
    this.resultsContainer.innerHTML = "";
  }

  // display or hide loading screen
  loading(displayLoading) {
    if(displayLoading){
      this.loadingScreen.style.display = "flex";
    }else{
      this.loadingScreen.style.display = "none";
    }
  }

  // display an error message
  error(errorMessage) {
    that.view.emptyResultsContainer();
    const errorContainer = document.createElement("p");
    errorContainer.innerText = errorMessage;
    this.resultsContainer.appendChild(errorContainer);
    that.view.loading(false);
  }

  // focus and blurs search input
  focusSearch(shouldFocus) {
    if(shouldFocus){
      this.queryField.focus();
    }else{
      this.queryField.blur();
    }
  }

  // set number of saved recipes 
  setNumberOfRecipes(numberOfRecipes) {
    this.navSavedBtn.getElementsByTagName('span')[0].innerText = numberOfRecipes;
  }

  // when user submits search
  search() {
    this.displaySaved(false);
    this.loading(true);
    this.focusSearch(false);
    const event = new Event('viewSearch');
    document.dispatchEvent(event);
  }
  
}