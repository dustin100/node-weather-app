const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup Handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicPath));

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Home page',
		name: 'Dustin',
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help Page',
		msg: 'Get the help you need',
		name: 'Dustin',
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About Page',
		name: 'Dustin',
	});
});

app.get('/weather', (req, res) => {
	const { address } = req.query;
	if (!req.query.address) {
		return res.send({
			error: 'Address is required',
		});
	}
	geocode(address, (error, { latitude, location, longitude } = {}) => {
		if (error) {
			return res.send({ error });
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error });
			}
			res.send({
				location: location,
				forecast: forecastData,
				address: address,
			});
		});
	});
});

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term',
		});
	}
	res.send({
		products: [],
	});
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		errorMsg: 'Help Article Not Found',
		name: 'Dustin',
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		errorMsg: 'Page Not Found',
		name: 'Dustin',
	});
});

app.listen(3000, () => {
	console.log('server running');
});
