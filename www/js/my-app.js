// Initialize app
var myApp = new Framework7({
});


// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

// Add view
var mainView = myApp.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: true
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {

});


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('collection', function (page) {
    // Do something here for "about" page
    $$.ajax({
    url: 'https://www.luxesystems.com/api/products',
    method: 'GET',
    dataType: 'json',
    contentType: 'application/json',
    success: function(response){
        $$.each(response, function(key, product){
            var new_product = createProduct(product)
            $$('#products').append(new_product);
        })
    },
    error: function(xhr, status){
        alert('Error: '+JSON.stringify(xhr));
        alert('ErrorStatus: '+JSON.stringify(status));
    }
    });
})

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
myApp.onPageInit('product', function (page) {
    // Do something here for "about" page
     $$.ajax({
        url: 'https://www.luxesystems.com/api/products/'+page.query.id,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function(response){
            console.log('https://www.luxesystems.com/api/products/'+page.query.id)
            $$('.product-description').text(response.title)
            $$('.price').text(response.price) 
            $$('.designer').text(response.designer) 
            $$('.title').text(response.title)
            $$('#main-image').attr('src', response.images[0].image_url)
            $$('#product_id').val(response.sku);
        },
        error: function(xhr, status){
            console.log('there is an error')
            alert('Error: '+JSON.stringify(xhr));
            alert('ErrorStatus: '+JSON.stringify(status));
        }
    });
})

$$(document).on('click', '.add-to-cart', function(e){
    var sku = $$('#product_id').val()
     $$.ajax({
        url: 'https://www.luxesystems.com/api/products/'+page.query.id,
        method: 'GET',
        dataType: 'json',
        contentType: 'application/json',
        success: function(response){
            console.log('https://www.luxesystems.com/api/products/'+page.query.id)
            $$('.product-description').text(response.title)
            $$('.price').text(response.price) 
            $$('.designer').text(response.designer) 
            $$('.title').text(response.title)
            $$('#main-image').attr('src', response.images[0].image_url)
            $$('#product_id').val(response.sku);
        },
        error: function(xhr, status){
            console.log('there is an error')
            alert('Error: '+JSON.stringify(xhr));
            alert('ErrorStatus: '+JSON.stringify(status));
        }
    });
})



$$('.login-screens').on('click', function(){
    alert('open screen')
    var screen = myApp.loginScreen.open('login-screen')
})

function createProduct(prod) {
    var product = '<div class="col-50">';
        product += '<a href="product.html?id='+prod.sku+'" class="product-block">'
        product +='<div class="product-image">'
        product +='<img src="'+ prod.images[0].image_url+'" class="lazy lazy-fade-in">'
        product +='</div>'
        product +='<div class="title">'+ prod.title +'</div>'
        product +='<div class="price">'+ prod.price+'</div>'
        product +='</a>'
        product +='</div>'
    return product;
}

$$(document).on('pageInit', function (e) {
    // Get page data from event data
    var page = e.detail.page;
    myApp.closePanel('left');

})
