$(document).ready(function () {
    var pantryUrl = 'https://api.yummly.com/v1/api/recipes?_app_id=d8ff7ac7&_app_key=a07332a882b586c48dadbbd230308af1&maxResult=20';

    // highlight the search bar
    $('body').find('.search input').focus();

    function getRecipes(url) {
        $.getJSON(url, function (data) {
            var recipe = data.matches;
            console.log(recipe);
            if (recipe.length === 0) {
                $('.Output').html('<p>Shoot...no matches for that search. 😕</p>');
            } else {
                $('.Output').html('<h2>Your pantry created these delicious recipes.</h2>');
                $.each(recipe, function () {
                    var recipeName = this.recipeName,
                        recipeId = this.id,
                        recipeUrl = 'http://www.yummly.com/recipe/' + recipeId,
                        recipeObject = this.imageUrlsBySize,
                        recipeArray = Object.keys(recipeObject),
                        recipeArrayLength = recipeArray.length,
                        recipeImage = recipeObject[recipeArray[recipeArrayLength - 1]],
                        recipeIngredient = this.ingredients,
                        recipeList = '';
                    time = parseFloat(this.totalTimeInSeconds / 60);
                    $('.Output').append('<div id="recipe-' + recipeId + '" class="recipe"><div><p><strong>' + recipeName + ' - </strong><a target="_blank" href="' + recipeUrl + '">See the recipe</a></p><p>This takes about ' + time + ' minutes to make.</p><ul class="ingredients"></ul></div><div><img src="' + recipeImage + '"/></div></div>');
                    $.each(recipeIngredient, function (i, val) {
                        recipeList = recipeList + '<li>' + val + '</li>'
                    });
                    // $('#recipe-' + recipeId).find('ul').html(recipeList); TODO add this
                });
                $('html,body').animate({
                    scrollTop: $('.Output').offset().top
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
        var searched = $(this).closest('.search').find('input.ingredientSearchText').val().trim().replace(/,/g, ''),
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
