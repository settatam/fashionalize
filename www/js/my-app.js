var app = new Framework7({
  root: '#app',
  name: 'My App',
  id: 'com.myapp.test',
  panel: {
    swipe: 'left',
  },
   smartSelect: {
    closeOnSelect: true
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
      path: '/choose-category/',
      url: 'choose-category.html',
    },
     {
      path: '/choose-type/',
      url: 'choose-type.html',
    },
    {
      path: '/what-to-sell/',
      url: 'what-to-sell.html',
    },
    {
      path: '/type/',
      url: 'type.html',
    },
    {
      path: '/other/',
      url: 'other.html',
    },
    {
      path: '/condition/',
      url: 'condition.html',
    },
    {
      path: '/sell/',
      url: 'sell.html',
    },
    {
      path: '/sales/',
      url: 'sales.html',
    },
    {
      path: '/age/',
      url: 'age.html',
    },
    {
      path: '/designer/',
      url: 'designer.html',
    },
    {
      path: '/image-upload/',
      url: 'image_upload.html',
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
      url: 'pages/settings/shipping.html',
    },
    {
      path: '/profile/',
      url: 'pages/settings/profile.html',
    },
    {
      path: '/reset-password/',
      url: 'pages/settings/password.html',
    },
    {
      path: '/notification/',
      url: 'pages/settings/notification.html',
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
var currency = '$';
var sub_total = 0;
var storage = window.localStorage;
var user_images = [];
let quotes = [];
var item = {};
var user = storage.getItem('user') !== null ? storage.getItem('user') : {};
var items_to_sell = [];
var current_item = {};
var item_additions = [];
var active_image;
var sell = {
  OriginalTags: 0,
  AuthCards: 0,
  DustBag: 0,
  DateCode: 0,
  brand: '',
  condition: '',
  color: '',
  age: '',
  style: '',
  category: '',
  type: ''
};

if(storage.getItem('token') !== null) {
  userIsLoggedIn = true;
  token = storage.getItem('token');
  user = JSON.parse(storage.getItem('user'));
   app.request.setup({
      headers: {
        'Accept': 'application/json',
        'Authorization': "Bearer " + token
      }
    })
}else{
  userIsLoggedIn = false;
}


image_responses = ["Add your first picture. Pointer: Upload a full frontal image of your item", 
                  "Add your second picture. Pointer: Take a picture of the opposite side of your item", 
                  "Add your third picture. Pointer: Takea picture of the auth tags if you have any.",  
                  "Add your fourth picture. Pointer: a picture of any scuffings or scrapes"];


//Pages

//Home Page
$$(document).on('page:init', '.page[data-name="home"]', function (e) {
    if(!userIsLoggedIn) {
      app.loginScreen.create('.user-login-screen');
      app.loginScreen.open('.user-login-screen');
    }
})

//Cart Page
$$(document).on('page:init', '.page[data-name="cart"]', function (e) {
     sub_total = 0;
     app.request.json(FASHION_URL + '/api/cart', function(response){
        response.forEach(loadCart)
    })
})

$$(document).on('page:init', '.page[data-name="product"]', function (e) {
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
     sub_total = 0;
     app.request.json(FASHION_URL + '/api/cart', function(response){
        response.forEach(loadCart)
    })
})

$$(document).on('page:init', '.page[data-name="designer"]', function (e) {
  setTimeout(function(){
    $$(document).find('#autocomplete-dropdown-typeahead').focus();
  }, 60)
  var autocompleteDropdownSimple = app.autocomplete.create({
  inputEl: '#autocomplete-dropdown-typeahead',
  openIn: 'dropdown',
  dropdownPlaceholderText: 'Type a designer i.e. "Chanel"',
  typeahead: true,
  source: function (query, render) {
    var results = [];
    if (query.length === 0) {
      render(results);
      return;
    }
    // Find matched items
    for (var i = 0; i < designers.length; i++) {
      if (designers[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(designers[i]);
    }
    render(results);
  },
  on: {
    change: function (value) {
     current_item.designer = value[0];
     sell.brand = value[0];
     $$('#item-brand').val(value[0])
    },
  },
  });
})

$$(document).on('page:init', '.page[data-name="what-to-sell"]', function(e){
  var autocompleteStandaloneSimple = app.autocomplete.create({
  openIn: 'page', //open in page
  openerEl: '#autocomplete-standalone', //link that opens autocomplete
  closeOnSelect: true, //go back after we select something
  source: function (query, render) {
    var results = [];
    if (query.length === 0) {
      render(results);
      return;
    }
    // Find matched items
    for (var i = 0; i < designers.length; i++) {
      if (designers[i].toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(designers[i]);
    }
    // Render items by passing array with result items
    render(results);
  },
  on: {
    change: function (value) {
        sell.brand = value[0];
        $$('#item-brand').val(value[0])
        // Add item text value to item-after
        $$('#autocomplete-standalone').find('.item-after').text(value[0]);
        // Add item value to input value
        $$('#autocomplete-standalone').find('input').val(value[0]);
      },
    },
  });
})

$$(document).on('page:init', '.page[data-name="choose-cat"]', function(e){
  var cats = Object.keys(category_types);
  var items = [];
  for (var i = 0; i < cats.length; i++) {
    items.push({
      title: ' ' + cats[i],
    });
  }

  var virtualList = app.virtualList.create({
    // List Element
    el: '.virtual-list',
    // Pass array with items
    items: items,
    // List item Template7 template
    itemTemplate:
      '<li>' +
        '<a href="#" class="item-link item-content choose-type" data-type="{{title}}">' +
          '<div class="item-inner">' +
            '<div class="item-title-row">' +
              '<div class="item-title">{{title}}</div>' +
            '</div>' +
          '</div>' +
        '</a>' +
      '</li>',
    // Item height
    height: app.theme === 'ios' ? 63 : 73,
  });
})

$$(document).on('click', '.choose-type', function(e){
  var t = $$(this).data('type').trim();
  var cats = category_types[t]['types'];
  var items = [];
  for (var i = 0; i < cats.length; i++) {
    items.push({
      cat:t, 
      title: cats[i],
    });
  }

  var virtualList = app.virtualList.create({
    // List Element
    el: '.virtual-list',
    // Pass array with items
    items: items,
    // List item Template7 template
    itemTemplate:
      '<li>' +
        '<a href="#" class="item-link item-content enter-type" data-category="{{cat}}" data-type="{{title}}">' +
          '<div class="item-inner">' +
            '<div class="item-title-row">' +
              '<div class="item-title">{{title}}</div>' +
            '</div>' +
          '</div>' +
        '</a>' +
      '</li>',
    // Item height
    height: app.theme === 'ios' ? 63 : 73,
  });
})

$$(document).on('click', '.choose-category', function(e){
  options = { animate: true }
  mainView.router.navigate('/choose-category/', options)
})

$$(document).on('click', '.enter-type', function(e){
  var obj = $$(this);
  $$('#choose-category').find('.item-after').text(obj.data('category') + ' - ' + obj.data('type'))
  $$('#item-category').val(obj.data('category'))
  $$('#item-type').val(obj.data('type'))
  sell.type = obj.data('type')
  app.router.back();
})

$$(document).on('page:init', '.page[data-name="shipping"]', function (e) {
    sub_total = 0;
    app.request.json(FASHION_URL + '/api/shipping-address', function(response){
        response.forEach(shippingAddress)
    })
})

$$(document).on('click', '.convert-form-to-data', function(){
  var formData = app.form.convertToData('#my-form')
  app.request.post(FASHION_URL + '/api/sell/store', formData, function (response) {
        response = JSON.parse(response)
        console.log(response)
    });
  options = { animation: true }
  mainView.router.navigate('/image-upload/', options)

});

//End pages

$$(document).on('click', '.add-category', function(){
  var obj = $$(this);
  item.category = obj.data('id');
  $$('.add-category').removeClass('on');
  obj.addClass('on');
  current_item.category = obj.data('id');
})

$$(document).on('click', '.add-condition', function(){
  var obj = $$(this);
  $$('.add-condition').removeClass('on');
  obj.addClass('on');
  current_item.condition = obj.data('id');
})

$$(document).on('click', '.add-age', function(){
  var obj = $$(this);
  current_item.age = obj.data('id');
  $$('.add-age').removeClass('on');
  obj.addClass('on');
})

$$(document).on('click', '.next', function(){
  var obj = $$(this);
  if(obj.hasClass('process-other-data')) {
    var chk_arr =  document.getElementsByName("addition");
    var chklength = chk_arr.length;
    
    for(k=0;k< chklength;k++){
      if(chk_arr[k].checked) item_additions.push(chk_arr[k].value)
    }
    current_item.date_code = $$('#date_code').val();
    current_item.additions = item_additions;
  }
  var next_route = obj.data('next');
  options = {
            reloadCurrent: true
  }
  mainView.router.navigate(next_route, options)
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
        //mainView.router.navigate('/main/', options)
        app.request.setup({
          headers: {
            'Accept': 'application/json',
            'Authorization': "Bearer " + data.success.token
          }
        })
    });
})

//Login

$$(document).on('click', '#login-button', function (e) {
    email = $$('#login-email').val();
    password = $$('#login-password').val();
    app.request.post(FASHION_URL + '/api/login', {email: email, password: password}, function (response) {
        data = JSON.parse(response);
        options = {
            reloadCurrent: true
        }
        userIsLoggedIn = true;
        //mainView.router.navigate('/', options)
        storage.setItem('token', data.success.token)
        user = {};
        user.id = data.success.user.id;
        user.name = data.success.user.name;
        storage.setItem('user', JSON.stringify(user));
        app.loginScreen.close('.user-login-screen')
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

//Show shipping form

$$(document).on('click', '.create-new-shipping', function(e){
  app.loginScreen.open('.add-shipping-address');
  $$('#shipping-user-id').val(user.id);
})

//Save shipping info

$$(document).on('click', '.save-shipping-address', function(){
  var formData = app.form.convertToData('#user-shipping-address');
    app.request.post(FASHION_URL + '/api/shipping-address/store', formData, function (response) {
      $$('.shipping-address-list').html('');
      console.log(response)
        response = JSON.parse(response)
        response.forEach(shippingAddress)
        app.loginScreen.close('.add-shipping-address');
    });
});


//Logout
$$(document).on('click', '.logout', function (e) {
    storage.removeItem('token');
    userIsLoggedIn = false;
    mainView.router.navigate('/');
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
    myCamera.startCameraAbove();
})

$$(document).on('click', '.sell-now', function (e) {
  navigator.camera.getPicture(uploadPhoto,failedPhoto,{quality:50, destinationType: Camera.DestinationType.FILE_URI});
})

$$('#take-picture').on('click', function(){
  CameraPreview.takePicture(function(imgData){
    alert('Picture has been taken');
      //document.getElementById('originalPicture').src = 'data:image/jpeg;base64,' + imgData;
  });
})

$$('.switch-camera').on('click', function(){
  CameraPreview.switchCamera();
})

$$('.take-picture').on('click', function(){
  CameraPreview.switchCamera();
  params = {title: title, amount: amount, user_id: user_id, image_url: image_url, sku:sku}
    app.request.post(FASHION_URL + '/api/images/store', params, function (response) {
        data = JSON.parse(response);
        options = {
            reloadCurrent: true
        }
        mainView.router.navigate('/cart/', options)
    });
})

$$('#close-camera').on('click', function(){
  CameraPreview.stopCamera();
})

function uploadPhoto(fileURL) {
  var options = new FileUploadOptions();
  options.fileKey = "file";
  options.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
  $$('.uploaded-image').html('<img src='+fileURL+' />');
  active_image = fileURL;
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
  user_images.push(r.response);
  alert(image_responses[user_images.length])
  images_length = user_images.length;
  var all_images = $$(document).find('.slide-photo');
  image_string = '<div class="slide-photo"><img src="'+ active_image +'" /></div>';
  $$('.slide-container').append(image_string);
  if(user_images.length == 4) {
    $$('#images-response').html('<p> You have uploaded as many images as needed </p>')
  }else{
    $$('#images-response').html('<p> '+ image_responses[user_images.length] +' </p>')
  }
}

var fail = function (error) {
    alert('An error occured! You image could not be uploaded. Please try again');
}

function cameraCallback(imageData) {
   var image = document.getElementById('myImage');
   image.src = "data:image/jpeg;base64," + imageData;
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

$$(document).on('click', '.wishlist-button', function(e){
  app.loginScreen.open('.sell-item-screen', true);
})

//Load content in pages

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

function shippingAddress(prod, index) {

  var html =  '<li>\
              <a href="#" class="item-link item-content">\
                  <div class="item-inner">\
                    <div class="item-title">\
                        <div class="item-header">' + prod.nickname + '</div>\
                          <p> '+ prod.address +'</p>\
                          <p> '+ prod.address2 +'</p>\
                          <p> '+ prod.state +' '+ prod.zip +'</p>\
                          <p> '+ prod.country +'</p>\
                        </div>\
                      <div class="item-after">Edit</div>\
                  </div>\
              </a>\
          </li>'
  $$('.shipping-address-list').append(html).show();

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

var categories = ['other', 'handbag', 'shoe', 'apparel', 'jewelry', 'accessory'];
