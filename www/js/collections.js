$$(document).on('page:init', '.page[data-name="collection"]', function (e) {
	//add gender
	//add category
	//add type

    app.request.json('https://www.luxesystems.com/api/products', function(response){
        response.forEach(createProduct)
    })
})