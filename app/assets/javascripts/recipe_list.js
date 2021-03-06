// Send AJAX request from basket click handler - returns matching recipes
//Create function
//to create HTML for displaying recipes (2 functions, displayALL & displayOne)

var Squirrelicious = Squirrelicious || {};

Squirrelicious.button_check = function(ingredients){
  if(ingredients.length !== 0){
    $("#find-recipe").removeClass('disabled');
  } else {
    $("#find-recipe").addClass('disabled');
  }
};

Squirrelicious.getRandom = function(array){
  return array[Math.floor(Math.random() * array.length)];
};

//Runs set_up_div_container and make API call for the recipies
Squirrelicious.requestRecipes = function(event, meat) {
  var meat = meat || Squirrelicious.getRandom(Squirrelicious.allMeats);
  Squirrelicious.meat = meat;

  $.ajax({
    url: '/yummly',
    type: 'GET',
    dataType: 'json',
    data: {ingredients: meat }
  })
  .done(function(data) {
    Squirrelicious.renderAllRecipes(data.hits, meat);
  });
};

// iterates and runs over the array to render
Squirrelicious.renderAllRecipes = function(recipes, meat) {
  var $container_div = $('#content'), $recipe_container;
  
  $container_div.empty();
  $container_div.append(HandlebarsTemplates['list_header']);
  $("#ingredient").attr("placeholder", meat);
  $recipe_container = $('#recipe-list');

  Squirrelicious.get_favorites(function(data) {
    var j = 0 , k = data.length,
        favorite_array = [];
    for (; j < k; j++){
       favorite_array.push(data[j].yummlyid);
    }

    if (recipes == undefined || recipes.length === 0) {
      $recipe_container.empty()
      $recipe_container.append('<div class="center"><br><br><h4>Sorry, your search did not return any recipes</h4></div>');
    } else {
      $recipe_container.empty();
      var l = recipes.length, i = 0;
      for(; i < l; i++) {
        recipes[i].recipe.id = recipes[i].recipe.uri.split("_")[1];
        Squirrelicious.renderRecipe(recipes[i].recipe, $recipe_container, favorite_array);
      }
    }
  });
};

// renders the div for display on the index page
Squirrelicious.renderRecipe = function(recipe, container, favorite_array) {
  var regEx = new RegExp(Squirrelicious.meat, "ig");
  var newName = recipe.label.replace(regEx, "Squirrel");

  var recipe_image = recipe.image || '/recipeme.png',
    $recipe_div = $('<div class="col-sm-4 recipe thumbnail" id="recipe' + recipe.id + '">'),
    $recipe_content = $('<div class="recipe-content dark-boxy">'),
    $recipe_content_inner_title = $('<div class="col-sm-10">'),
    $recipe_content_inner_favorite = $('<div class="col-sm-2">'),
    $recipe_title = $("<a class='recipe_title'>" + newName + "</h3>"),
    $recipe_img = $('<img class="recipe-img" src="' + recipe_image + '">'),
    $recipe_favor = $('<span class="glyphicon glyphicon-star"></span>');

  // Add recipe to database
  Squirrelicious.addRecipe(recipe, function(data) {
    if ($.inArray(recipe.id, favorite_array) !== -1){
      $recipe_favor.addClass('favorite');
    }

    $recipe_favor.click(function(event) {
      event.preventDefault();
      $(this).toggleClass('favorite');
      Squirrelicious.add_favorite(recipe);
      return false;
    });

    $recipe_content_inner_title.append($recipe_title);
    $recipe_content_inner_favorite.append($recipe_favor);
    $recipe_content.append($recipe_content_inner_title, $recipe_content_inner_favorite);
    $recipe_div.append($recipe_img, $recipe_content);

    container.append($recipe_div);

    $recipe_title.click(function(event) {
      event.preventDefault();
      Squirrelicious.look_up_recipe(data.id, Squirrelicious.meat);
      return false;
    });
  });
};

// Squirrelicious.renderAttribution = function() {
//   var $yummly_attribution = $('<div id="yummly-att">'),
//       $yummly_attribution_content = $('<small id="yummly-att-content"> Recipe search powered by <a href="http://www.yummly.com/recipes"><img alt="Yummly" src="http://static.yummly.com/api-logo.png"/></a></small>'),
//       $container = $('.container');

//   $yummly_attribution.append($yummly_attribution_content);
//   return $yummly_attribution;
// };




