var app = new Framework7({
  root: '#app',
  name: 'My App',
  id: 'com.myapp.test',
  panel: {
    swipe: 'left',
  },
  routes: [
    {
        path: '/',
        url: 'about.html',
    },
    {
      path: '/about/',
      url: 'about.html',
    },
    {
      path: '/product/',
      url: 'product.html',
    },
    {
      path: '/cart/',
      url: 'cart.html',
    },
    {
      path: '/orders/',
      url: 'orders.html',
    },
    {
      path: '/collection/',
      url: 'collection.html',
    },
  ],
});

var token = false;

var FASHION_URL = "https://www.fashionerize.com";
var LUXE_URL = "https://www.luxesystems.com";

var mainView = app.views.create('.view-main');
var $$ = Dom7;

var price, image_url, sku, amount, user_id, name, sku;
var status = "pending";


// // If we need to use custom DOM library, let's save it to $$ variable:
// var $$ = Dom7;

// // Initialize app
// var myApp = new Framework7({
//     root: '#app',
//     theme: 'auto',
//     routes: [{
//         path: '/login-screen/',
//         content: '\
//       <div class="page no-navbar no-toolbar no-swipeback">\
//         <div class="page-content login-screen-content">\
//           <div class="login-screen-title">My App</div>\
//           <form>\
//             <div class="list">\
//             </div>\
//             <div class="list">\
//               <ul>\
//                 <li><a href="#" class="item-link list-button">Sign In</a></li>\
//               </ul>\
//               <div class="block-footer">\
//                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\
//                 <p><a href="#" class="link back">Close Login Screen</a></p>\
//               </div>\
//             </div>\
//           </form>\
//         </div>\
//       </div>'
//     }]
// });


// var ls = myApp.loginScreen.create({ el: '.login-screen' });
// ls.open(false);

// // Handle Cordova Device Ready Event
// $$(document).on('deviceready', function() {

// });

// $$('.login-screen').on('loginscreen:open', function (e, loginScreen) {
//   alert('opening now')
// });


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
$$(document).on('page:init', '.page[data-name="collection"]', function (e) {
    // Do something here for "about" page
    app.request.json('https://www.luxesystems.com/api/products', function(response){
        response.forEach(createProduct)
    })
})

$$(document).on('page:init', '.page[data-name="product"]', function (e) {
    // Do something here for "about" page
     app.request.json('https://www.luxesystems.com/api/products/'+mainView.router.currentRoute.query.id, function(response){
         $$('.product-description').text(response.title)
         $$('.price').text(response.price) 
         $$('.designer').text(response.designer) 
         $$('.title').text(response.title)
         $$('#main-image').attr('src', response.images[0].image_url)
         $$('#product_id').val(response.sku);
         image_url = response.images[0].image_url;
         price = response.price;
         title = response.title;
         amount = response.price;
         sku = response.sku;
    })
})

$$(document).on('page:init', '.page[data-name="cart"]', function (e) {
    // Do something here for "about" page
     app.request.json(FASHION_URL + '/api/cart', function(response){
        console.log(response)
    })
})

$$('.sign-up-button').on('click', function(){
    name = $$('#name').val();
    password = $$('#password').val();
    email = $$('#email').val();
    confirm_password = $$('#confirm_password').val();
    var params = { name: name, password: password, email: email, confirm_password: confirm_password}
    param = app.utils.serializeObject(params);
    app.request.post(FASHION_URL + '/api/register', param, function (response) {
        data = JSON.parse(response);
        options = {
            reloadCurrent: true
        }
        mainView.router.navigate('collection.html', options)
        app.request.setup({
          headers: {
            'Accept': 'application/json',
            'Authorization': "Bearer " + data.success.token
          }
        })
    });
})
//Sign UP

$$(document).on('click', '#login-button', function (e) {
    email = $$('#login-email').val();
    password = $$('#login-password').val();
    app.request.post(FASHION_URL + '/api/login', {email: email, password: password}, function (response) {
        data = JSON.parse(response);
        options = {
            reloadCurrent: true
        }
        mainView.router.navigate('/collection/', options)
        app.request.setup({
          headers: {
            'Accept': 'application/json',
            'Authorization': "Bearer " + data.success.token
          }
        })
        console.log(data.success.token);
        var close = $$('.login-screen-close')
        close.click();
    });
    
})

$$(document).on('click', '.add-to-cart', function (e) {
    params = {title: title, amount: amount, user_id: user_id, image_url: image_url, sku:sku}
    app.request.post(FASHION_URL + '/api/cart/store', params, function (response) {
        console.log(response);
        data = JSON.parse(response);
        options = {
            reloadCurrent: true
        }
        mainView.router.navigate('/cart/', options)
    });
})

$$(document).on('click', '.add-to-wishlist', function (e) {
    
})

function showProduct(item, index){
    console.log(item)
}

// $$(document).on('click', '.add-to-cart', function(e){
//     var sku = $$('#product_id').val()
//      $$.ajax({
//         url: 'https://www.luxesystems.com/api/products/'+page.query.id,
//         method: 'POST',
//         dataType: 'json',
//         contentType: 'application/json',
//         success: function(response){
           
//         },
//         error: function(xhr, status){
//             console.log('there is an error')
//             alert('Error: '+JSON.stringify(xhr));
//             alert('ErrorStatus: '+JSON.stringify(status));
//         }
//     });
// })


function createProduct(prod, index) {
    var product = '<div class="col-50">';
        product += '<a href="/product/?id='+prod.sku+'" class="product-block">'
        product +='<div class="product-image">'
        product +='<img src="'+ prod.images[0].image_url+'" class="lazy lazy-fade-in">'
        product +='</div>'
        product +='<div class="title">'+ prod.title +'</div>'
        product +='<div class="price">'+ prod.price+'</div>'
        product +='</a>'
        product +='</div>'
        $$('#products').append(product);
}

