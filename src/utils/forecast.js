const request = require('request');

const forecast = (latitude, longitude, callback) => {
    const url = 'https://api.darksky.net/forecast/35f908491d02717f434646ed868d41e4/' + latitude + ',' + longitude + '?units=si';

    request({url, json: true}, (error, response) => {
        if (error){
            callback('Unable to connect to weather service', undefined);
        } else if(response.body.error){
            callback(response.body.error, undefined);
        } else{
            callback(undefined, `${response.body.daily.data[0].summary} It is currently ${response.body.currently.temperature} degrees out. There is a ${response.body.currently.precipProbability}% chance of rain.`)
        }
    });
};

module.exports = forecast;