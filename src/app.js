const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode.js');
const forecast = require('./utils/forecast.js');

const app = express();

//Define path for express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

//Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

//Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (request, response) => {
    response.render('index', {
        title: 'Weather',
        name: 'Catarina Brendel'
    });
});

app.get('/about', (request, response) =>{
    response.render('about', {
        title: 'About',
        name: 'Catarina Brendel'
    })
});

app.get('/help', (request, response) => {
    response.render('help', {
        helpText: 'This is some help Text',
        title: 'Help',
        name: 'Catarina Brendel'
    });
});

app.get('/weather', (request, response) => {
    if(!request.query.adress){
        return response.send('You must provide a valid adress')
    }

    const adress = request.query.adress;

    geocode(adress, (error, {latitude, longitude, location} = 0) => {
        if(error){
            return response.send({error});
        };

        forecast(latitude, longitude, (error, forecastData) =>{
            if(error){
                return response.send({error});
            }

            response.send({
                location,
                forecast: forecastData
            })
        })
    });
});

//Handles non existing pages within the help page
app.get('/help/*', (request, response) => {
    response.render('404', {
        title: '404',
        content: 'Help article not found',
        name: 'Catarina Brendel'
    });
})

//Handles non existing pages
app.get('*', (request, response) => {
    response.render('404', {
        title: '404',
        content: 'Page not found',
        name: 'Catarina Brendel'
    });
});

app.listen(3000, () => {
    console.log('Server up on port 3000');
});