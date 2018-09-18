//Cart Page
$$(document).on('page:init', '.page[data-name="category"]', function (e) {
  var q = mainView.router.currentRoute.query;
  var cats = gender_categories[q['gender']]['categories'];
  var items = [];
  items.push({
  	title: 'All ' + q['gender'],
  	url: '/collections/?gender='+q['gender']
  })
  for (var i = 0; i < cats.length; i++) {
    items.push({
      title: cats[i],
      url: '/type/?gender='+q['gender']+'&cat='+cats[i],
    });
  }

  var virtualList = app.virtualList.create({
    // List Element
    el: '.category-list',
    // Pass array with items
    items: items,
    // List item Template7 template
    itemTemplate:
      '<li>' +
        '<a href="{{url}}" class="item-link item-content">' +
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


//Cart Page
$$(document).on('page:init', '.page[data-name="type"]', function (e) {
  var q = mainView.router.currentRoute.query;
  var cats = gender_categories[q['gender']]['categories'];
  var types = category_types[q['cat']]['types'];
  console.log(types);
  var items = [];
  items.push({
  	title: 'All ' + q['cat'],
  	url: '/collections/?gender='+q['gender']+'&category='+q['cat']
  })
  for (var i = 0; i < types.length; i++) {
    items.push({
      title: types[i],
      url: '/collection/?gender='+q['gender']+'&type='+cats[i],
    });
  }

  var virtualList = app.virtualList.create({
    // List Element
    el: '.type-list',
    // Pass array with items
    items: items,
    // List item Template7 template
    itemTemplate:
      '<li>' +
        '<a href="{{url}}" class="item-link item-content">' +
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

//var queryString = Object.keys(params).map(key => key + '=' + params[key]).join('&');
