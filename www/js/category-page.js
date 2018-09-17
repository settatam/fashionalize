//Cart Page
$$(document).on('page:init', '.page[data-name="category"]', function (e) {
  var q = mainView.router.currentRoute.query;
  var cats = gender_categories[q['gender']]['categories'];
  console.log(cats)
  var items = [];
  for (var i = 0; i < cats.length; i++) {
    items.push({
      title: cats[i],
    });
  }

  console.log(items)

  var virtualList = app.virtualList.create({
    // List Element
    el: '.category-list',
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