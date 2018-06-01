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
  ],
});

var mainView = app.views.create('.view-main');

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
// myApp.onPageInit('collection', function (page) {
//     // Do something here for "about" page
//     $$.ajax({
//     url: 'https://www.luxesystems.com/api/products',
//     method: 'GET',
//     dataType: 'json',
//     contentType: 'application/json',
//     success: function(response){
//         $$.each(response, function(key, product){
//             var new_product = createProduct(product)
//             $$('#products').append(new_product);
//         })
//     },
//     error: function(xhr, status){
//         alert('Error: '+JSON.stringify(xhr));
//         alert('ErrorStatus: '+JSON.stringify(status));
//     }
//     });
// })

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
// myApp.onPageInit('product', function (page) {
//     // Do something here for "about" page
//      $$.ajax({
//         url: 'https://www.luxesystems.com/api/products/'+page.query.id,
//         method: 'GET',
//         dataType: 'json',
//         contentType: 'application/json',
//         success: function(response){
//             console.log('https://www.luxesystems.com/api/products/'+page.query.id)
//             $$('.product-description').text(response.title)
//             $$('.price').text(response.price) 
//             $$('.designer').text(response.designer) 
//             $$('.title').text(response.title)
//             $$('#main-image').attr('src', response.images[0].image_url)
//             $$('#product_id').val(response.sku);
//         },
//         error: function(xhr, status){
//             console.log('there is an error')
//             alert('Error: '+JSON.stringify(xhr));
//             alert('ErrorStatus: '+JSON.stringify(status));
//         }
//     });
// })

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

