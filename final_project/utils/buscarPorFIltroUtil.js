"use strict";

module.exports.echo = function echo(lista, atributo, valor) {
	var book = null;
    Object.keys(lista).forEach((bk) => {        
		for (const [key, value] of Object.entries(lista[bk])) {
			if(atributo == key && value == valor) {
				book = JSON.stringify(lista[bk],null,4); 
			}
		}
	});
	
    return book;
}

module.exports.echoId = function echoId(lista, atributo, valor) {
	var id = null;
    Object.keys(lista).forEach((bk) => {        
		for (const [key, value] of Object.entries(lista[bk])) {
			if(atributo == key && value == valor) {
				id = bk; 
			}
		}
	});
	
    return id;
}