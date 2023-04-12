# Recipe Search App

This is a simple recipe search app built with vanilla JavaScript, CSS, and HTML. It uses the Yummly API to search for recipes and displays a maximum of 12 results. The app follows the Model-View-Controller (MVC) architecture. Find a demo at:

* [https://www.sessiontown.com/food](https://www.sessiontown.com/food)

## Features

* MVC architecture
* Search for recipes using the Yummly API
* Displays a maximum of 12 results
* Save recipes to LocalStorage
* Loading screen with a CSS animation of a fork
* Show a generic image if no image is available

## Getting started

To run the app locally, clone this repository and then open the `index.html` file in your web browser. You will need an internet connection, as the app relies on the Yummly API to search for recipes.

You also need a Yummly API key. You can get one at [RapidAPI](https://rapidapi.com/apidojo/api/yummly2/). Create a `js/config.js` file and add the following code:

```js
const yummlyAPIKey = 'abc123';
const yummlyAPIHost = 'yummly2.p.rapidapi.com';
const yummlyAPIUrl = 'https://yummly2.p.rapidapi.com/feeds/search?';

export { yummlyAPIKey, yummlyAPIHost, yummlyAPIUrl };
``` 

## Design

The app was designed by me from scratch. I aimed for a clean and simple user interface that is easy to use and navigate. No frameworks were used in the development of this app.

## Technology

The app was built using the following technologies:

* HTML
* CSS
* Vanilla JavaScript
* Yummly API

## Acknowledgements

I would like to thank the creators of the Yummly API for providing a free API to use in this project.

## License

This project is licensed under the MIT License.

## Security

This project is for educational purposes (MVC architecture). It is not intended for production use as the API key is publicly available which is a security risk. In a real-world application, a proxy server would be used to hide the API key.

## Versions

* 1.0.0
    * Initial release
* 1.1.0
    * Private properties added to FoodModel.js
    * FoodModel class now accepts an object `settings` as an argument
    * foodSearch() method in FoodModel is now asynchronous and uses await instead of the previous callback hell
    * js/config.js file added to store the Yummly API key, host, and URL
    * FoodView class now has setupEvents() method to handle events
    * FoodView class now has a all the DOM elements as private properties
    * README.md file updated
    * Epoch times in index.html updated
    * The controller now has multiple methods to handle events for better readability
* 1.1.1
    * README.md file updated