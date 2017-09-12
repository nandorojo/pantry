$(document).ready(function () {
    var pantryUrl = 'http://api.yummly.com/v1/api/recipes?_app_id=d8ff7ac7&_app_key=aa3cae3ea1bda4bcb576ad14eb83bcac&requirePictures=true';

    // highlight the search bar
    $('body').find('.search input').focus();
    
    function getRecipes(url) {
        $.getJSON(url, function (data) {
            var recipe = data.matches;
            console.log(recipe);
            if (recipe.length === 0) {
                $('.Output').append('<p>Shoot...no matches for that search.</p>');
            } else {
                $('.Output').html('<h2>Your pantry created these delicious recipes.</h2>');
                $.each(recipe, function () {
                    var recipeName = this.recipeName,
                        recipeId = this.id,
                        recipeUrl = 'http://www.yummly.com/recipe/' + recipeId,
                        recipeObject = this.imageUrlsBySize,
                        recipeArray = Object.keys(recipeObject),
                        recipeArrayLength = recipeArray.length,
                        recipeImage = recipeObject[recipeArray[recipeArrayLength - 1]];
                        time = parseFloat(this.totalTimeInSeconds / 60);
                    $('.Output').append('<div id="recipe-' + recipeId + '" class="recipe"><div><p><strong>' + recipeName + ' </strong><a target="_blank" href="' + recipeUrl + '">See the recipe</a></p><p>This takes about ' + time + ' minutes to make.</p></div><img src="' + recipeImage + '"/></div>');
                });
            }
        });
    };

    $('body').on('keypress', '.ingredientSearch input', function (e) {
        if (e.keyCode == 13) {
            $('.ingredientSearchTrigger').click();
        }
    });

    $('body').on('click', '.ingredientSearchTrigger', function () {
        var searched = $(this).closest('.search').find('input').val().trim().replace(/,/g, ''),
            searchedItem = searched.split(' '), // list of every word searched, split by space bar
            searchTerm = '',
            searchLink = pantryUrl;
        $.each(searchedItem, function () { // for each word typed
            searchTerm = searchTerm + '&allowedIngredient[]=' + this;
        });
        searchLink = searchLink + searchTerm;
        console.log(searchLink);
        getRecipes(searchLink);
    });
    // go to correct (in-page) link when you click on a link
    $('a[href$=".html"]').on('click', function (e) { // simulate page changes without actually changing page

        var $currentPage = $('page.active'),
            $link = $(this).attr('href').replace('.html', ''),
            $targetPage = $('#' + $link),
            $this = $(this);
        if ($targetPage.length != 0) {
            e.preventDefault(); // if the <page> exists
            if ($this.attr('target') != '_blank' && !$targetPage.hasClass('active')) { // if it isn't target blank or the current page
                $('page').removeClass('active');
                $targetPage.addClass('active');
            }
        };
        window.location.hash = '#' + $link;
    });
});
