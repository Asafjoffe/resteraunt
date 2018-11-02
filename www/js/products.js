var app = window.app || {},
business_paypal = ''; // aquí va tu correo electrónico de paypal


(function($){
	'use strict';

	//no coflict with underscores

	app.init = function(){
		//totalItems totalAmount
		var total = 0,
		items = 0
		
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ;
		
		if(undefined != cart.items && cart.items != null && cart.items != '' && cart.items.length > 0){
			_.forEach(cart.items, function(n, key) {
			   items = (items + n.cant)
			   total = total  + (n.cant * n.price)
			});

		}

		$('#totalItems').text(items)
		$('.totalAmount').text('$ ' + total + ' USD')

		// Show and Hide cart
		var cartIcon = document.getElementsByClassName("cart-icon")[0];
		cartIcon.onclick = () => {
			var cartItems = document.getElementsByClassName("cart")[0];
			if (cartItems.style.display == "none") {
				cartItems.style.display = "block";
			}
			else {
				cartItems.style.display = "none";
			}
		}
		
	}
	
	app.createProducts = function(){

		var productos = [];
		        $.ajax({

		        	url: "/api/Product", 
		        	success: function(products){
		        	productos = products;
					console.log(productos);

					var wrapper = $('.productosWrapper');
					console.log(wrapper);
					var contenido = '';
				   for(var i = 0; i < productos.length; i++){
					//    if(productos[i] > 0){
		   
						   contenido+= '<div class="coin-wrapper">'
						   contenido+= '		<img class="prodImg" src="'+productos[i].img+'" alt="'+productos[i].name+'">'
						   contenido+= '		<span class="large-12 columns product-details">'
					   contenido += '			<h3>' + productos[i].name + '  </br> <span class="price">$ '+productos[i].price+' USD</span></h3>'
						   contenido+= '		</span>'
						   contenido+= '		<a class="large-12 columns btn submit  prod-'+productos[i].id+'" data-style="slide-right" onclick="app.addtoCart('+productos[i].id+');">Add to cart</a>'
						   contenido+= '		<div class="clearfix"></div>'
						   contenido+= '</div>'
		   
					//    }

				   }
				   wrapper.html(contenido)

				   localStorage.setItem('productos',JSON.stringify(productos))

		        }
		        });

		        	



	}

	app.addtoCart = function(id){

		var productos = JSON.parse(localStorage.getItem('productos')),
		producto = _.find(productos,{ 'id' : id }),
		cant = 1

			if(undefined != producto){
				if(cant > 0){
					setTimeout(function(){
						var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ;
						app.searchProd(cart,producto.id,parseInt(cant),producto.name,producto.price,producto.img)
						l.stop();
					},2000)
				}else{
					alert('Solo se permiten cantidades mayores a cero')
				}
			}else{
				alert('Oops! algo malo ocurrió, inténtalo de nuevo más tarde')
			}
		// }else{
		// 	alert('No se pueden añadir más de este producto')
		// }
	}

	app.searchProd = function(cart,id,cant,name,price,img,available){
		//if we pass a negative value to the amount, it is deducted from the cart
		var curProd = _.find(cart.items, { 'id': id })

		if(undefined != curProd && curProd != null){
			//the product already exists, we add one more to its quantity
				curProd.cant = parseInt(curProd.cant + cant)
		}else{
			//if not, we add it to the cart
			var prod = {
				id : id,
				cant : cant,
				name : name,
				price : price,
				img : img,
				available : available
			}
			cart.items.push(prod)
			
		}
		localStorage.setItem('cart',JSON.stringify(cart))
		app.init()
		app.getProducts()
		app.updatePayForm()
	}

	app.getProducts = function(){
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []},
		msg = '',
		wrapper = $('.cart'),
		total = 0
		wrapper.html('')

		if(undefined == cart || null == cart || cart == '' || cart.items.length == 0){
			wrapper.html('<li>Your basket is empty</li>');
		}else{
			var items = '';
			_.forEach(cart.items, function(n, key) {
	
			   total = total  + (n.cant * n.price)
			   items += '<li>'
			   items += '<img class="cartImg" src="'+n.img+'" />'
				items += '<h3 class="title">' + n.name + '<br><span class="price">' + n.cant + ' x $ ' + n.price + ' USD</span> <button class="add" onclick="app.updateItem(' + n.id + ',' + n.available + ')"><i class="fas fa-minus"></i></button> <button onclick="app.deleteProd(' + n.id +')" ><i class="fas fa-times"></i></button><div class="clearfix"></div></h3>'
			   items += '</li>'
			});

			//add the total to the cart
			items += '<li id="total">Total : $ '+total+' USD <div id="submitForm"></div></li>'
			wrapper.html(items)

		}
	}

	app.updateItem = function(id,available){
		//subtract one to the amount of the shopping cart
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ,
		curProd = _.find(cart.items, { 'id': id })
			//update the cart
			curProd.cant = curProd.cant - 1;
			//validate that the amount is not less than 0
			if(curProd.cant > 0){
				localStorage.setItem('cart',JSON.stringify(cart))
				app.init()
				app.getProducts()
				app.updatePayForm()
			}else{
				app.deleteProd(id,true)
			}
	}

	app.delete = function(id){
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ;
		var curProd = _.find(cart.items, { 'id': id })
		_.remove(cart.items, curProd);
		localStorage.setItem('cart',JSON.stringify(cart))
		app.init()
		app.getProducts()
		app.updatePayForm()
	}

	app.deleteProd = function(id,remove){
		if(undefined != id && id > 0){
			
			if(remove == true){
				app.delete(id)
			}else{
				var conf = confirm('¿Deseas eliminar este producto?')
				if(conf){
					app.delete(id)
				}
			}
			
		}
	}

	app.updatePayForm = function(){
		//that will generate a dynamic form for paypal
		//with the products and their prices
		var cart = (JSON.parse(localStorage.getItem('cart')) != null) ? JSON.parse(localStorage.getItem('cart')) : {items : []} ;
		var statics = '<form action="https://www.paypal.com/cgi-bin/webscr" method="post"><input type="hidden" name="cmd" value="_cart"><input type="hidden" name="upload" value="1"><input type="hidden" name="currency_code" value="USD" /><input type="hidden" name="business" value="'+business_paypal+'">',
		dinamic = '',
		wrapper = $('#submitForm')

		wrapper.html('')
		
		if(undefined != cart && null != cart && cart != ''){
			var i = 1;
			_.forEach(cart.items, function(prod, key) {
					dinamic += '<input type="hidden" name="item_name_'+i+'" value="'+prod.name+'">'
					dinamic += '<input type="hidden" name="amount_'+i+'" value="'+prod.price+'">'
					dinamic += '<input type="hidden" name="item_number_'+i+'" value="'+prod.id+'" />'
					dinamic += '<input type="hidden" name="quantity_'+i+'" value="'+prod.cant+'" />'
				i++;
			})

			statics += dinamic + '<button type="submit" class="pay">pay<i class="ion-chevron-right"></i></button></form>'

			wrapper.html(statics)
		}
	}

	$(document).ready(function(){
		app.init()
		app.getProducts()
		app.updatePayForm()
		app.createProducts()
	})

})(jQuery)