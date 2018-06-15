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
      url: 'index.html',
        
    },
    {
      path: '/about/',
      url: 'about.html',
    },
    {
      path: '/main/',
      url: 'main.html',
    },
    {
      path: '/category/',
      url: 'category.html',
    },
    {
      path: '/type/',
      url: 'type.html',
    },
    {
      path: '/sell/',
      url: 'sell.html',
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
      path: '/settings/',
      url: 'settings.html',
    },
     {
      path: '/shipping/',
      url: 'shipping.html',
    },
    {
      path: '/profile/',
      url: 'profile.html',
    },
    {
      path: '/collection/',
      url: 'collection.html',
    },
  ],
});

var token = false;
var userIsLoggedIn = false;

var FASHION_URL = "https://www.fashionerize.com";
var LUXE_URL = "https://www.luxesystems.com";

var mainView = app.views.create('.view-main');
var $$ = Dom7;

var price, image_url, sku, amount, user_id, name, sku;
var status = "pending";
var currency = '$';
var sub_total = 0;
var storage = window.localStorage;


// // If we need to use custom DOM library, let's save it to $$ variable:
// var $$ = Dom7;


// Now we need to run the code that will be executed only for About page.

// Option 1. Using page callback for page (for "about" page in this case) (recommended way):
$$(document).on('page:init', '.page[data-name="collection"]', function (e) {
    app.request.json('https://www.luxesystems.com/api/products', function(response){
        response.forEach(createProduct)
    })
})

$$(document).on('page:init', '.page[data-name="product"]', function (e) {
    console.log(mainView.router.currentRoute.query.id)
    app.request.json('https://www.luxesystems.com/api/products/'+mainView.router.currentRoute.query.id, function(response){
         $$('.product-description').text(response.OverallConditionDescription)
         $$('.price').text('$'+response.price) 
         $$('.designer').text(response.designer) 
         $$('.title').text(response.title)
         $$('#main-image').attr('src', response.images[0].image_url)
         $$('#product_id').val(response.sku);
         response.images.forEach(loadSlider);
         image_url = response.images[0].image_url;
         price = response.price;
         title = response.title;
         amount = response.price;
         sku = response.sku;
         var swiper = app.swiper.create('.demo-swiper', {
            pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
        }

        });

        swiper.pagination.render();
        response.attributes.forEach(loadAttributes);
    })
})

$$(document).on('page:init', '.page[data-name="cart"]', function (e) {
    // Do something here for "about" page
     sub_total = 0;
     app.request.json(FASHION_URL + '/api/cart', function(response){
        response.forEach(loadCart)
    })
})

$$(document).on('page:init', '.page[data-name="home"]', function (e) {
    // Do something here for "about" page
    options = {
            reloadCurrent: true
    }
    if(storage.getItem('token') === null) {
        mainView.router.navigate('/main/', options)
    }
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
        userIsLoggedIn = true;
        mainView.router.navigate('/main/', options)
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
        userIsLoggedIn = true;
        mainView.router.navigate('/main/', options)
        app.request.setup({
          headers: {
            'Accept': 'application/json',
            'Authorization': "Bearer " + data.success.token
          }
        })
        var close = $$('.login-screen-close')
        close.click();
    });
    
})

$$(document).on('click', '.add-to-cart', function (e) {
    params = {title: title, amount: amount, user_id: user_id, image_url: image_url, sku:sku}
    app.request.post(FASHION_URL + '/api/cart/store', params, function (response) {
        data = JSON.parse(response);
        options = {
            reloadCurrent: true
        }
        mainView.router.navigate('/cart/', options)
    });
})

$$(document).on('click', '.add-to-wishlist', function (e) {
    
})

$$(document).on('click', '.sell-now', function (e) {
    app.loginScreen.open('.sell-item-screen', true);
    navigator.camera.getPicture(uploadPhoto,failedPhoto,{quality:50, destinationType: Camera.DestinationType.FILE_URI});
})

function uploadPhoto(fileURL) {
  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
  options.mimeType = "image/jpeg";
  options.chunkedMode = false;
  options.headers = {Connection: "close"};
  options.httpMethod = 'POST';

  var params = {};
  params.value1 = "test";
  params.value2 = "param";

  options.params = params;

  var ft = new FileTransfer();
  ft.upload(fileURL, encodeURI("https://www.fashionerize.com/api/images/upload"), win, fail, options);
}

var win = function (r) {
    //app.loginScreen.open('.sell-item-screen', true);
}

var fail = function (error) {
    alert("An error has occurred: Code = " + error.code);
    alert("upload error source " + error.source);
    alert("upload error target " + error.target);
}

function showProduct(item, index){
    console.log(item)
}

function loadSlider(img, index) {
    var swiper = $$('.swiper-wrapper');
    swiper.append('<div class="swiper-slide"><div class="swiper-slide-image"><img src="'+img.image_url+'"/></div></div>');
}


function loadAttributes(attr, index) {
    if(attr.name == "Type") $$('.type').text(attr.value);
    $$('.attributes').append('<p>' + attr.name + ': ' + attr.value + '</p>');
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
$$(document).on('click', '.wishlist-button', function(e){
  
})


function createProduct(prod, index) {
    var product = '<div class="col-50">';
        product += '<a href="/product/?id='+prod.id+'" class="product-block">'
        product +='<div class="product-image">'
        product +='<img src="'+ prod.image+'" class="lazy lazy-fade-in">'
        product +='</div>'
        product +='<div class="title">'+ prod.title +'</div>'
        product +='<div class="price">$'+ prod.price +'</div>'
        product +='</a>'
        product +='</div>'
        $$('#products').append(product);
}

function loadCart(prod, index) {
     var item = '<div class="row">';
         item += '<div class="col-20">';
         item += '<div class="cart-image">';
         item += '<img src="'+ prod.image_url+'" />';
         item += '</div>'
         item += '</div>'
         item += '<div class="col-50">'
         item += '<p> '+ prod.title +'</p>'
         item += '<p>Color: White</p>'
         item +=' <p>Size: N/A</p>'
         item += '</div>';
         item += '<div class="col-30">';
         item += '<span class="cart-page-price">$'+ prod.amount+'</span>';
         item += '<div class="cart-remove"><a href="#">Remove</a></div>'
         item += '</div>';
         item += '</div>'
         item += '</div>';
         $$('#cart').append(item);
         sub_total += parseInt(prod.amount)
         $$('.sub-total').text('$' + sub_total.toFixed(2));
}

function cartProduct(prod, index) {
    $$('.designer').text(prod.designer)
    var product = '<div class="col-50">';
        product += '<a href="/product/?id='+prod.id+'" class="product-block">'
        product +='<div class="product-image">'
        product +='<img src="'+ prod.images[0].image_url+'" class="lazy lazy-fade-in">'
        product +='</div>'
        product +='<div class="title">'+ prod.title +'</div>'
        product +='<div class="price">'+ prod.price+'</div>'
        product +='</a>'
        product +='</div>'
        $$('#products').append(product);
}

function getCategory(cat){
    if(cat == 1) return "Handbag";
    if(cat == 2) return "Shoe";
    if(cat == 3) return "Accessory";
    if(cat == 4) return "Jewelry";

}

function failedPhoto(data){
    alert('there was a problem with the camera')
}

function getContent() {
  content = '\
    <div class="page no-navbar no-toolbar no-swipeback">\
        <div class="page-content login-screen-content">\
          <div class="login-screen-title">My App</div>\
          <form>\
            <div class="list">\
                <ul>\
                  <li class="item-content item-input">\
                      <div class="item-inner">\
                          <div class="item-title item-label">Category</div>\
                          <div class="item-input">\
                            <select>\
                              <option value="0">Choose Category</option>\
                              <option value="1">Handbags</option>\
                              <option value="2">Shoes / Heel </option>\
                              <option value="4"> Accessories </option>\
                              <option value="5"> Accessories </option>\
                            </select>\
                        </div>\
                      </div>\
                    </li>\
                    <li class="item-content item-input">\
                      <div class="item-inner">\
                          <div class="item-title item-label">Category</div>\
                          <div class="item-input">\
                            <select>\
                              <option value="0">Choose Designer</option>\
                              <option value="1">Handbags</option>\
                              <option value="2">Shoes / Heel </option>\
                              <option value="4"> Accessories </option>\
                              <option value="5"> Accessories </option>\
                            </select>\
                        </div>\
                      </div>\
                    </li>\
                </ul>\
            </div>\
            <div class="list">\
              <ul>\
                <li><a href="#" class="item-link list-button">Sign In</a></li>\
              </ul>\
              <div class="block-footer">\
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>\
                <p><a href="#" class="link back">Close Login Screen</a></p>\
              </div>\
            </div>\
          </form>\
        </div>\
      </div>'
}

