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

$$(document).on('page:init', '.page[data-name="collection"]', function (e) {
    app.request.json('https://www.luxesystems.com/api/products', function(response){
        response.forEach(createProduct)
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
      console.log(value);
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
        '<a href="#" class="item-link item-content enter-type" data-category="{{t}}" data-type="{{title}}">' +
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
  options = {
            reloadCurrent: true
        }
  app.router.navigate('/choose-category/', options)
})

$$(document).on('click', '.enter-type', function(e){
  var obj = $$(this);
  alert('updating category');
  $$('#choose-category').find('.item-after').text(obj.data('category') + ' - ' + obj.data('type'))
  app.router.back();
})

$$(document).on('change', '#category', function(e){
  app.router.back()
})

$$(document).on('change', '#age', function(e){
  app.router.back()
})

$$(document).on('page:init', '.page[data-name="shipping"]', function (e) {
    sub_total = 0;
    app.request.json(FASHION_URL + '/api/shipping-address', function(response){
        response.forEach(shippingAddress)
    })
})

$$(document).on('click', '.convert-form-to-data', function(){
  var formData = app.form.convertToData('#my-form');
  var category = 2;
  var designer = "Chanel";
  var age = 3;
  var date_code = 3;
  var additions = ['clothes', 'shoes'];
  options = {
            reloadCurrent: true
        }
  mainView.router.navigate('/image-upload/', options)
  
  //params = {category: category, designer: designer, age: age, date_code: date_code, style:style, additions:additions}
    //app.request.post(FASHION_URL + '/api/sell/store', params, function (response) {
        //data = JSON.parse(response);
        //options = {
            //reloadCurrent: true
        //}
        //mainView.router.navigate('/cart/', options)
    //});
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

// all designers
//all category types:

var category_types = {
  'handbags' : {
    name: 'handbag',
    types : ['Clutch', 'Tote']
  },
  'shoes': {
    name: 'shoes',
    types: ['boots', 'heels']
  },
  'accessories': {
    name: 'accessories',
    types: ['wallets', 'sunglasses']
  },
  'jewelry': {
    name: 'jewelry',
    types: ['necklaces', 'bracelets']
  },
  'apparel': {
    name: 'apparel',
    types: ['skirts', 'pants']
  }

}

var designers = [
  "1883",
  "Ella Moss",
  "4 Collective",
  "7 For All Mankind",
  "A.B.S",
  "A.T. 2",
  "Accessorcraft NYC",
  "Ace Delivery",
  "Adampluseve",
  "Adriano Goldschmied",
  "Adrienne Landau",
  "Adrienne Vittadini",
  "Adrienne Vittadini",
  "AG + Liberty",
  "Akris",
  "Al Beres",
  "Alaia",
  "Alberto Makali",
  "Alexander Birman",
  "Alexander McQueen",
  "Alexander Wang",
  "Alexis Bittar",
  "Alexis Hudson",
  "Alfani",
  "Alice & Trixie",
  "Alice Olivia",
  "Alisa",
  "Alixandre",
  "Allegri",
  "American Apparel",
  "Amour Vert",
  "Andrea Candela",
  "Andrew Marc",
  "Angelus",
  "Ann Demeulemeester",
  "Ann Fontaine",
  "Ann Freedberg",
  "Ann Turk",
  "Ann-Louise Roswald",
  "Anna",
  "Annabel Ingall",
  "Anne Dee Goldin",
  "Anne Klein",
  "Anthropologie",
  "Antonio Derrico",
  "Anue Ligne",
  "Anya Hindmarch",
  "Anys Hindman",
  "Apepazza",
  "Aqua",
  "Arfango",
  "Armani",
  "Armani Collezioni",
  "Ash",
  "Ashley B",
  "Ashley Pitman",
  "Ashneil",
  "Atsuro Tayama",
  "Autumn Cashmere",
  "Avalon",
  "Ayka",
  "Ayka Deri",
  "Babocho For Nicole",
  "Badgley Mischka",
  "Baggallini",
  "Bailey 44",
  "Balenciaga",
  "Bally",
  "Bally Banks & Biddle",
  "Banana Republic",
  "Barbara Bolan",
  "Barbara Bui",
  "Barneys New York",
  "Barry Kieselstein-Cord",
  "Baume & Mercier",
  "BCBG MAX AZRIA",
  "BCBGirls",
  "Belford",
  "Belle",
  "Belstaff",
  "Bergdorf Goodman",
  "Bertolucci",
  "Beth Bowley",
  "Betmar",
  "Betseyville",
  "Betsy Johnson",
  "Bettye Muller",
  "Bieff",
  "Bienen Davis",
  "Bill Blass",
  "Bloomingdales",
  "Blue Duck",
  "Blum",
  "Bogner",
  "Boots",
  "Bosca",
  "Boss",
  "Bostonian",
  "Botkier",
  "Bottega Veneta",
  "Boyds Philadelphia",
  "BOYY",
  "Brahmin",
  "Brandy Milville",
  "Breitling",
  "Brian Atwood",
  "Brighton",
  "Brooks Brothers",
  "Bruce Hunt",
  "Bruno Cucinelli",
  "Bruno Frisoni",
  "Bruno Magli",
  "Buco",
  "Bulga",
  "Bulova",
  "Burberry",
  "Burberry Prorsum",
  "Burhan",
  "Buxton",
  "Buzz 18",
  "Bvlgari",
  "Byblo",
  "Bzar",
  "C. Luce",
  "C. Wonder",
  "Cacharel",
  "Calvin Klein",
  "Calypso St. Barth",
  "Cambio",
  "Cameron Blake",
  "Canali",
  "Captiva Cashmere",
  "Carla Mancini",
  "Carlos Falchi",
  "Carmen Marc Valvo",
  "Carolina Herrera",
  "Carrera",
  "Cartier",
  "Casadei",
  "Catherine Malandrino",
  "Cece Cord",
  "Cee Cee",
  "Celine",
  "Celine by Champion",
  "Chach",
  "Chaiken",
  "Champion",
  "Chanel",
  "Chantal",
  "Charles by Charles David",
  "Charles Calfun",
  "Charles Chang-Lima",
  "Charles Jourdan",
  "Charles Nolan",
  "Charles Underwood",
  "Charlotte Olympia",
  "Charriol",
  "Chelsea",
  "Chip & Pepper",
  "Chloe",
  "Chopard",
  "Chris Kole",
  "Christa",
  "Christian Dior",
  "Christian Lacroix",
  "Christian Louboutin",
  "Christiansen",
  "Chrome Hearts",
  "Cinzia Rocca",
  "Citizen",
  "Citizen Of Humanity",
  "Claire Dickson",
  "Clara",
  "Clara Kasavina",
  "Clarence",
  "Claudia Ciuti",
  "Claudio Orciani",
  "Cloudveil",
  "Coach",
  "Cole Haan",
  "Colin Stuart",
  "Collection Fiftynine",
  "Concord",
  "Converse",
  "Coralia Leets",
  "Cordani",
  "Cosabella",
  "Cosci",
  "Credit Suisse",
  "Cristiano di Thiene",
  "Crown",
  "Cuore & Pelle",
  "Current Elliott",
  "Cut25 by Yigal Azrouel",
  "Cynthia Rowley",
  "Cynthia Vincent",
  "Cypress Grove by Kara George",
  "Daniele Birardi",
  "Danskin",
  "Darby Scott",
  "Darjoni",
  "Daryl K",
  "David Hayes",
  "David Lerner",
  "David Meister",
  "David Yurman",
  "De Vecchi",
  "Debbie Brooks",
  "Dejac Paris",
  "Dell",
  "Delvaux",
  "Denmark",
  "Derek Lam",
  "DesignerName",
  "Desmo",
  "Devi Kroell",
  "Diamond Tea",
  "Diane von Furstenberg",
  "Diesel",
  "DKNY",
  "DL1961",
  "Dofan",
  "Dolce & Gabbana",
  "Dolce Vita",
  "Donald J Pliner",
  "Donna Karan",
  "Dooney & Bourke",
  "Dorian",
  "Drama",
  "Dries van Noten",
  "Dunhill",
  "Dupont",
  "Ebel",
  "Echo",
  "Eileen Fisher",
  "Eileen Kramer",
  "Elements by Vakko",
  "Elgin",
  "Elie Tahari",
  "Elise M",
  "Elizabeth and James",
  "Ellen Tracy",
  "Emanuel",
  "Emanuel Ungaro",
  "Emilio Pucci",
  "Emporio Armani",
  "Energie",
  "English Laundry",
  "Equipment",
  "Equiptment",
  "Eric Javits",
  "Ermenegildo Zegna",
  "Escada",
  "Eskandar",
  "Etolon",
  "Etro",
  "Evans",
  "F.B.Rogers",
  "Faconnable",
  "Fendi",
  "Fiets Voor 2",
  "Fifty Street",
  "Finesse La Model",
  "Firuze",
  "Flavio Castellani",
  "Folio",
  "For All Mankind",
  "Fornarina",
  "Francesco Biasia",
  "Francesco Rogani",
  "Franco Sarto",
  "Fred",
  "Fred Segal",
  "Free People",
  "French Company Luggage",
  "Freperic",
  "Frye",
  "Furla",
  "Future Paradise",
  "G Canofa",
  "Gary Graham",
  "Geneve",
  "Ghurka",
  "Gian Mori",
  "Gianfranco Ferre",
  "Gianfranco Ferre Studio",
  "Gianmarco Lorenzi",
  "Gianni Versace",
  "Giorgio Armani",
  "Giuseppe Zanotti",
  "Givenchy",
  "Givenchy Sport",
  "Glam",
  "Glentex",
  "Gold",
  "Gold Hawk",
  "Gold Pfeil",
  "Gottex",
  "Goyard",
  "Grace Ann Agostino",
  "Gran Sasso",
  "Grayson & Dunn",
  "Griffith Gray for St. John",
  "Gring",
  "Gryphon",
  "Gucci",
  "Gunex",
  "H & M",
  "H. Flitter",
  "Habitual",
  "Hale Bob",
  "Halogen",
  "Hamilton",
  "Hanii Y",
  "Hanky Panky",
  "Harel",
  "Hartmann",
  "Hauliuetrigere",
  "Havaianas",
  "Helmut Lang",
  "Henri Bendel",
  "Henri Cuir",
  "Henry Beguelin",
  "Heppelwhite",
  "Hermes",
  "Herve Leger",
  "Hinge",
  "Hobo International",
  "Hogan",
  "HTC",
  "Hudson",
  "Hugo Boss",
  "Hugo Buscati",
  "Hunter",
  "Hunter Dixon",
  "HWR",
  "I Medici",
  "i Santi",
  "iiJin",
  "Il Bisonte",
  "Ilie Wacs",
  "Inge Christopher",
  "Invicta",
  "Ippolita",
  "Iradj Moini",
  "Isaac Mizrahi",
  "isabel and nina",
  "Isabel Marant",
  "Isabella Fiore",
  "Ivana",
  "J Brand",
  "J Crew",
  "J Tiktiner",
  "J Valdi",
  "Jack Georges",
  "Jack Wills",
  "Jaeger LeCoultre",
  "Jason Wu",
  "Jay Herbert",
  "Jay Strongwater",
  "Jean Paul Gaultier",
  "Jean-Michel Cazabat",
  "Jenne Maag",
  "Jerome C Rousseau",
  "Jessica McClintock",
  "Jessica Simpson",
  "Jesslyn Blake",
  "Jet",
  "Jil Sander",
  "Jill Stuart",
  "Jimmy Choo",
  "Joan & David",
  "Jocelyn",
  "Joe",
  "John Galliano",
  "John Hardy",
  "John Patrick",
  "John Varvatos",
  "Johnny Farah",
  "Johnny Was",
  "Joie",
  "Jones New York",
  "Jos. A Bank",
  "Joseph Abboud",
  "Josephine Sasso",
  "Jubilee",
  "Judith Ann Creations",
  "Judith Leiber",
  "Judith Ripka",
  "Juicy Couture",
  "Jurgi Persoons",
  "Just Cavalli",
  "Justin",
  "KA 7",
  "Kara George",
  "Karl Lagerfeld",
  "Kate Spade",
  "Katherine Kwei",
  "Kathrine Baumann",
  "Kay Unger",
  "Kazuo Kawasaki",
  "Kenneth Cole",
  "Kenneth Jay Lane",
  "Khombu",
  "Kier + J",
  "Kieselstein-Cord",
  "KM",
  "Konstantino",
  "Kooba",
  "Koret",
  "Kors Michael Kors",
  "Kristina Ti",
  "Krizia",
  "L.A.M.B",
  "L.K. Bennett",
  "La Paglia",
  "La Rok Luxe",
  "Lacoste",
  "Lagos",
  "Lalique",
  "Lambertson Truex",
  "Lana Marks",
  "Lana Of London",
  "Lancel",
  "Lanel",
  "Lanvin",
  "Laundry by Shelli Segal",
  "Lauren by Ralph Lauren",
  "Lauren Merkin",
  "Lauren Moshi",
  "Laurie B",
  "Le Medici",
  "Le Phare",
  "Le Vian",
  "Leatherock",
  "Lederer",
  "Lee Angel",
  "Leene Maag",
  "Leith",
  "Liberty",
  "Lilly Pulitzer",
  "Lily Scott",
  "Linda Allard for Ellen Tracy",
  "Line Long",
  "Linea Pelle",
  "Lodis",
  "Loeffler Randall",
  "Loewe",
  "Longchamp",
  "Longines",
  "Loro Piana",
  "Lorenzo Banfi",
  "Louis Vuitton",
  "Love Moschino",
  "Loxwood",
  "LP Italy",
  "Lubiam",
  "Lucchese",
  "Luciano Barbera",
  "Lucille de Paris",
  "Lucy Isaac",
  "Luella",
  "Luii",
  "Luisa Spagnoli",
  "Lulu Frost",
  "Lulu Guinness",
  "Lululemon",
  "Lupo",
  "Luruena",
  "Madame a Paris",
  "Magalli",
  "Magaschoni",
  "Maggy London",
  "Maison Scotch",
  "Mandalay",
  "Manolo Blahnik",
  "Mantero",
  "Mantoni",
  "Mara Hoffman",
  "Marc Aurel",
  "Marc by Andrew Marc",
  "Marc By Marc Jacobs",
  "Marc Jacobs",
  "Marc Joseph",
  "Marco Bicego",
  "Marco Gianotti",
  "Margaret Oleary",
  "Marheta",
  "Marie Saint Pierre",
  "Marina Rinaldi",
  "Mario Prolofria",
  "Mario Valentino",
  "Marithe Francois Girbaud",
  "Mark Cross",
  "Marni",
  "Mary Frances",
  "Materia Prima",
  "Matsuda",
  "Matthew Campbell Laurenza",
  "Maud Frizon",
  "Maui",
  "Maui Jim",
  "Mauri",
  "Max Mara",
  "Maxamilian",
  "Mayberry",
  "MCL",
  "MCM",
  "Meda",
  "Megaschoni",
  "Melina Eng",
  "Menin",
  "Michael Kors",
  "Michael Michael Kors",
  "Michael Stars",
  "Michal Negrin",
  "Michel Desjardins",
  "Michel Perry",
  "Michele",
  "Michelle Moissac",
  "Miguel Ases",
  "Mikimoto",
  "Milch",
  "Milly",
  "Minnie Rose",
  "Miss Trish of Capri",
  "Missoni",
  "Mitchie",
  "Miu Miu",
  "Modella",
  "Moncler",
  "Mont Blanc",
  "Morle",
  "Moschino",
  "Mossimo Dutti",
  "Moth",
  "Mother",
  "Movado",
  "Mr. Beene",
  "Mulberry",
  "My Ferragamo",
  "My Flat in London",
  "MZ Wallace",
  "Naeem Khan",
  "Nan Duskin",
  "Nancy Gonzalez",
  "Nanette Lepore",
  "Narciso Rodrigues",
  "Nathalie M",
  "Nazareno Gabrielli",
  "Neiman Marcus",
  "New Man",
  "Nicole Miller",
  "Nike",
  "Nina Ricci",
  "Nocona",
  "Nordica",
  "North Face",
  "Notorious",
  "NSF",
  "Nuti",
  "Oasis",
  "Old Gringo",
  "Oleg Cassini",
  "Olivia Harris",
  "Omega",
  "Ongaru",
  "Onna Ehrlich",
  "Oquendo",
  "OrYany",
  "Oscar",
  "Oscar de la Renta",
  "Other",
  "Oxxford Clothes",
  "Oxxford Clothes for Neiman Marcus",
  "Page",
  "Pal Zileri",
  "Paloma Picaso",
  "Pamela Dennis",
  "Pancaldi",
  "Pandora",
  "Paule KA",
  "Pauline Trigere",
  "Pedre",
  "Pedro Garcia",
  "Pelle Moda",
  "Pentimento",
  "Perre Ellis",
  "Persol",
  "Peserico",
  "Philip Lim",
  "Philip Mendelsohn",
  "Philip Stein",
  "Philippe Charriol",
  "Philosophy Di Alberta Ferretti",
  "Pianegonda",
  "Piazza Sempione",
  "Pierre Balmain",
  "Pierre Hardy",
  "Plinio Visona",
  "Polo Ralph Lauren",
  "Poupete Of St Barths",
  "Pour la Victoire",
  "Prada",
  "Primabase",
  "Proenza Schouler",
  "Pronto Uomo",
  "R & Y Augusti",
  "R G",
  "Rachel Comey",
  "Rachel Roy",
  "Rachel Zoe",
  "Rado",
  "Rafe",
  "Rag & Bone",
  "Ralph Lauren",
  "Raw 7",
  "Ray Ban",
  "Raymond Weil",
  "Rebecca Minkoff",
  "Rebecca Taylor",
  "Red Haute",
  "Red Valentino",
  "Regency",
  "Rena Lange",
  "Renato Nucci",
  "Renaud Pellegrino",
  "Rene Caovilla",
  "Rene Lezard",
  "Rene Mancici",
  "Revo",
  "Richard Tyler",
  "Rickie Freeman for Teri Jon",
  "Robbi & Nikki",
  "Robert Clergerie",
  "Robert Graham",
  "Robert Lee Morris",
  "Robert Rodriguez",
  "Roberta Di Camerino",
  "Roberto Cavalli",
  "Roberto Coin",
  "Roberto del Carlo",
  "Robertson Los Angeles",
  "Rodo",
  "Rogers",
  "Rolex",
  "Ron Herman",
  "Rosenfeld",
  "Roslyn",
  "Royal Danish",
  "Ruco Line",
  "Ruth Saltz",
  "Saga Furs",
  "Saint by Sarah Jane",
  "Saint Laurent",
  "Saks Fifth Avenue",
  "Salvatore Ferragamo",
  "Sam Edelman",
  "Samuel Dong",
  "Sanctuary",
  "Santini Mavardi",
  "Sara Fredericks",
  "Schumacher",
  "Scott Kay",
  "Scrap Gold",
  "Scrap Silver",
  "Seaver",
  "See by Chloe",
  "Seiko",
  "Sequoia",
  "Sergio Rossi",
  "Sesto Meucci",
  "Seth Thomas",
  "Seychelles",
  "Shoemint",
  "Shoshanna",
  "Sigerson Morrison",
  "Silhouette",
  "Silvia Fiorentina",
  "Skagen",
  "Skemo",
  "Sky",
  "Smythe",
  "Soft Joie",
  "Solo Paris",
  "Sondra Roberts",
  "Sonia Rykiel",
  "Sophie Hulme",
  "Sophy Curson",
  "Sorrelli",
  "Sperry",
  "Splendid",
  "St. John",
  "Stefano",
  "Stefano Bravo",
  "Stella McCartney",
  "Stella Page",
  "Stephane Kelian",
  "Stephen Dweck",
  "Sterling",
  "Steve Madden",
  "Streets Ahead",
  "Stuart Weitzman",
  "Studio Pollini",
  "Sue Wong",
  "Sundry",
  "Superga",
  "Susan Kalan",
  "Susana Monaco",
  "Sutton Studio",
  "Swarovski",
  "Sweet Pea",
  "Sydney Evan",
  "Sydney Evans",
  "T-Bags",
  "Tag Heuer",
  "Tahari",
  "Tart",
  "Taryn Rose",
  "TechnoMarine",
  "Tecnica",
  "Ted Baker",
  "Ted Muehling",
  "Tee-Party",
  "Temple St. Claire",
  "The Bridge",
  "The Franklin Mint",
  "The Frye Company",
  "Theory",
  "Thierry Mugler",
  "Thierry Rabotin",
  "Three Dots",
  "Tibi",
  "Tiffany & Co.",
  "Timberland",
  "Timex",
  "Tods",
  "Tom and Linda Platt",
  "Tom Ford",
  "Tommy Bahama",
  "Tony Cohen",
  "Top Shop",
  "Tory Burch",
  "Town Home",
  "TRF",
  "Trina Turk",
  "Troo",
  "Trussini",
  "TSE",
  "Tumi",
  "Twill Twenty Two",
  "Twisted Heart",
  "Tyrolean",
  "UGG Australia",
  "Unaluna",
  "Unknown",
  "Valentino",
  "Van Cleef & Arpels",
  "Van Eli",
  "Vanessa Noel",
  "Varda",
  "Velvet",
  "Vera Bradley",
  "Vera Wang",
  "Versace",
  "Vertigo",
  "Via Spiga",
  "Vicenza",
  "Vicini",
  "Vigant",
  "Vince",
  "Vince Camuto",
  "Vivien Westwood",
  "Von Saken",
  "Wakmann",
  "Walborg",
  "Walla W",
  "Walter",
  "Walter Katten",
  "Waltham",
  "Warren Edwards",
  "We the Free",
  "Weather Proof Garment Company",
  "White",
  "Whiting and Davis International",
  "Wilardy",
  "William Rast",
  "Wink NYC",
  "Worth",
  "Wright. Kay & Co.",
  "XXXX Collection",
  "YA Los Angeles",
  "Yansi Fugel",
  "Yoana Baraschi",
  "Young Fabulous Broke",
  "Yves Saint Laurent",
  "Zac Posen",
  "Zagliani",
  "Zanella",
  "Zara",
  "ZeHava",
  "Zelda",
  "Zimmermann",
  "Zoe Karssen",
  "Vibram",
  "Paul Andrew",
  "A.L.C. ",
  "Pelle Melle",
  "W. Kleinberg",
  "Metradamo",
  "AJ Velenci",
  "B-Low The Belt",
  "Jennifer Scott",
  "Bed Stu",
  "Hana K ",
  "Vogue",
  "Paige",
  "Maliparmi",
  "Timberline",
  "Louis Feraud",
  "Cynthia Steffe",
  "True Religion",
  "Not Your Daughters Jeans",
  "FIT",
  "Beirn",
  "Khols",
  "Gustto ",
  "Roger Vivier",
  "Delman",
  "Nine  West",
  "Kathy",
  "Alberta Ferreti ",
  "Christian Cota",
  "Ruthie Davis",
  "Giambattista Valli",
  "Cesare Paciotti ",
  "Thakahoon",
  "Tuleh",
  "Bob Mackie",
  "Valerie Bertinelli",
  "Kors By Michael Kors",
  "J. Mendel",
  "Karen Millen",
  "Moyna",
  "Reed Krakoff",
  "CO OP Barneys New York",
  "Oliver Peoples",
  "Cavage",
  "Kenzo ",
  "Gabriele Strehle",
  "Charles David",
  "10022-Shoe Saks 5th Ave",
  "Tracesy Reese",
  "Tracy Reese",
  "Les Copains",
  "Dana Buchman",
  "Louben",
  "Sportmax",
  "Company Ellen Tracy",
  "Oscar by Oscar de la Renta",
  "Maryl",
  "Layfayette 148",
  "Classiques Entier",
  "Joan and David",
  "Cheeta B Sherrie Bloom Peter Noveillo",
  "Norma Kamali- Everlast",
  "S Max Mara",
  "Tommy Hilfiger",
  "Victor & Rolf",
  "Rock & Republic ",
  "Maurice Lacroix",
  "J.Mclaughlin",
  "Paul Morelli",
  "Tadashi",
  "Kron",
  "Todd Reed",
  "Jeffrey Campbell",
  "Michael Dawkins",
  "Roger Viver",
  "Barbara Bixby",
  "Alejandro Ingelmo",
  "Les Bernard",
  "Alberta Faretti",
  "EDNA",
  "Agnona",
  "Cabi",
  "Identify",
  "Zara Basic",
  "Rich & Skinny",
  "Montana",
  "M+M",
  "Macbeth Collection",
  "Gerard Darel",
  "Bianca Nero",
  "Steve By Searle",
  "Obermeyer",
  "Raguel Allegra",
  "Hickey Freeman",
  "Brooks 346",
  "Van Heusen",
  "J. Lindeberg",
  "Classic U Ungaro",
  "Jhane Barnes",
  "Sophie Sitbon",
  "Max Studio",
  "Harari",
  "Claiborne",
  "Natori",
  "Anne Klein 2",
  "Armani Junior",
  "Junior Gaultier",
  "Paul Smith",
  "Lida Baday",
  "Vivienne Tam",
  "Allesandro DellAcqua",
  "Lilli Rubin",
  "Baby Dior",
  "Jekel",
  "Richard Shah",
  "Havaianas Slim",
  "Nanni",
  "Oliver Peeples",
  "Martinez Valero",
  "Ungaro Ter",
  "VBH",
  "Rochas",
  "Tevrow + Chase",
  "Yigal Azrouel",
  "Open Ceremony",
  "CO OP Barneys",
  "Theyskens Theory",
  "Acne",
  "Paul Mayer",
  "Obakki",
  "Alviero Martini",
  "Versus",
  "Maison Martin Margiela ",
  "Test Designer",
  "test",
  "Jack Rogers",
  "Stubbs & Wootton",
  "Monique Lhuillier",
  "Kay Jewelers",
  "Leifsdottir",
  "Foley and Corinna",
  "Yohji Yamamoto",
  "Baccarat",
  "Bluemarine",
  "Iceberg",
  "Lorenzo",
  "Costume Jewelry",
  "Porsche",
  "Mansur Gavriel",
  "Milor",
  "The Original Car Shoe",
  "Brioni",
  "House of Harlow 1960",
  "Valentino By Mario Valentino",
  "Fiorentini & Baker",
  "3.1 Phillip lim",
  "Corum",
  "J",
  "Panerai",
  "Martin Dingman",
  "Bacio 61",
  "Ibiza",
  "Avanti",
  "Chie Mihara",
  "Camilla Skovgaard",
  "Edie Parker",
  "The Row",
  "Kara Ross",
  "Caterina Lucchio",
  "American Rag",
  "Francois Pinton",
  "Magnanni",
  "Stephen Webster",
  " Sasha Primak",
  "Sola",
  "Isola",
  "Eddie Parker",
  "Balmain",
  "Currency",
  "Shipping",
  "Credit",
  "Commission",
  "Santoni",
  "Escales",
  "Jean Patou",
  "Jun Ashida",
  "Comme Ca Ism",
  "Renoma",
  "Richel Paris Collection",
  "Courtesy",
  "Bueche Girod",
  "To Boot New York",
  "Sophia Webster",
  "Adidas",
  "Jocasi",
  "Annabelle Ingall",
  "Altuzarra"
]

var categories = ['other', 'handbag', 'shoe', 'apparel', 'jewelry', 'accessory'];
