$$(document).on('page:init', '.page[data-name="orders"]', function(e){
  var orders_items = [];
  app.request.json(FASHION_URL + '/api/orders', function(response){
  if(response.length > 0){
      for (var i = 0; i < response.length; i++) {
        order_items.push({
          designer: response[i].brand,
          title: response[i].designer,
          category: response[i].category,
          type: response[i].type
        });
      }
      var virtualList = app.virtualList.create({
      // List Element
      el: '.orders-list',
      // Pass array with items
      items: order_items,
      // List item Template7 template
      itemTemplate:
        '<li>' +
          '<a href="#" class="item-link item-content choose-type" data-type="{{title}}">' +
            '<div class="item-media"><img src="http://lorempixel.com/160/160/people/1" width="80"/></div>' +
            '<div class="item-inner">' +
              '<div class="item-title-row">' +
                '<div class="item-title">{{designer}}</div>' +
              '</div>' +
              '<div class="item-subtitle">{{category}} - {{type}}</div>' +
              '<div class="item-subtitle"><span class="badge badge-warning">Processing</span></div>' +
            '</div>' +
          '</a>' +
        '</li>',
      // Item height
        height: app.theme === 'ios' ? 63 : 73,
      });
    }else{
      $$('.orders-list').html('<p> You have no orders</p>')
    }
    
  })
})