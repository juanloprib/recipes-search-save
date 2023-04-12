/* 
  CREATED BY: JUAN DAVID LOPERA
  MVC Architecture
*/

'use strict';

// import and initialize MVC components
import { FoodModel } from './FoodModel.js';
import { FoodView } from './FoodView.js';
import { FoodController } from './FoodController.js';

const foodApp = new FoodController(
  new FoodModel(),
  new FoodView()
);