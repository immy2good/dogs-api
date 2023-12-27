const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // This line is optional if your views are in the 'views' folder

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', async (req, res) => {
    try {
        // Fetch a random dog image
        const randomImageResponse = await axios.get('https://dog.ceo/api/breeds/image/random');
        const dogImage = randomImageResponse.data.message;

        // Fetch breeds list
        const breedsResponse = await axios.get('https://dog.ceo/api/breeds/list/all');
        const breeds = Object.keys(breedsResponse.data.message);

        // Render the index page with both dogImage and breeds
        res.render('index', { dogImage: dogImage, breeds: breeds });
    } catch (error) {
        res.status(500).send(error.message);
    }
});


// Breed Selections 

app.get('/breed', async (req, res) => {
    try {
        const breed = req.query.breed;
        const limit = parseInt(req.query.limit) || 3; // Default to 3 if limit is not provided

        const imagesResponse = await axios.get(`https://dog.ceo/api/breed/${breed}/images`);
        let images = imagesResponse.data.message;

        // Apply the limit to the images array
        images = images.slice(0, limit);

        // Fetch breeds list again to populate the dropdown
        const breedsResponse = await axios.get('https://dog.ceo/api/breeds/list/all');
        const breeds = Object.keys(breedsResponse.data.message);

        res.render('index', { breeds: breeds, images: images, selectedBreed: breed, imageLimit: limit });
    } catch (error) {
        res.status(500).send(error.message);
    }
});






app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
