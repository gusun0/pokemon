const express = require('express');
const Pokedex = require('pokedex-promise-v2');
const random = require('random');
const bodyParser = require('body-parser');


var options = {
	protocol: 'https',
	hostName: 'localhost:3000',
	versionPath: '/api/v2/',
	cacheLimit: 100 * 1000, // 100s
	timeout: 5 * 1000 // 5s
}

const app = express();
const P = new Pokedex();
app.use(bodyParser.urlencoded({ extended: false })); // recuperar los datos del formulario html
app.use(bodyParser.json());


app.get('/random', (req,res,next) => {

	const ran = random.int(min=1,max=898);

	P.getPokemonByName(ran) // with Promise
		.then(function(response) {

			const obj = {
				name: response.name,
				id: response.id,
				moves: response.moves[0].move.name,
				stats_back: response.sprites.back_default,
				stats_front: response.sprites.front_default

				

			}

			res.send(obj);
			next();
		})
		.catch(function(error) {
			console.log('There was an ERROR: ', error);
		});



});




app.post('/lista', (req,res) => {

	let { inicio, fin } = req.body;

	total = parseInt(parseInt(fin)+1); 

	var interval = {
		limit: total,
		offset: parseInt(inicio-1)
	}

	P.getPokemonsList(interval)
		.then(function(response) {
			(response.results).forEach(pok => {
				let id = pok.url.split('https://pokeapi.co/api/v2/pokemon/');
				id = id[1].split('/');
				id = id[0];


				res.end(`Pokemon: ${pok.name} - id: ${id}`);
				console.log(`Pokemon: ${pok.name} - id: ${id}`);
			});

			res.end();
		}).catch(function(err){
			console.log(err);
		});






});




app.get('/:nombre', (req,res) => {

	let nombre = req.params.nombre;
	console.loog

	P.getPokemonByName(nombre) // with Promise
		.then(function(response) {

			const obj = {
				name: response.name,
				id: response.id,
				moves: response.moves[0].move.name,
				stats_back: response.sprites.back_default,
				stats_front: response.sprites.front_default

			}

			res.send(obj);
		})
		.catch(function(error) {
			console.log('There was an ERROR: ', error);
		});


});

/*
app.get('/:id', (req,res) => {

	let id = req.params.id;

	P.getPokemonByName(id) // with Promise
		.then(function(response) {

			const obj = {
				name: response.name,
				id: response.id,
				moves: response.moves[0].move.name,
				stats_back: response.sprites.back_default,
				stats_front: response.sprites.front_default
			}

			res.send(obj);
		})
		.catch(function(error) {
			console.log('There was an ERROR: ', error);
		});


});

*/



app.listen(3000, () => {
	console.log('Server funcionando');
}); 
