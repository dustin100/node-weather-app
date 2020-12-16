const request = require('request');

const forecast = (lat, lon, callback) => {
	const url = `http://api.weatherstack.com/current?access_key=855734c08b438a8db30830c92b33a24e&query=${lat},${lon}`;
	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to connect to weather service');
		} else if (body.error) {
			callback(body.error.info);
		} else {
			const { temperature, feelslike } = body.current;
			callback(
				undefined,
				`It's currently ${temperature} and it feels like ${feelslike}`
			);
		}
	});
};

module.exports = forecast;
