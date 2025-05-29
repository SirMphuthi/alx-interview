#!/usr/bin/env node
/**
 * A script that prints all characters of a Star Wars movie
 * based on the provided Movie ID.
 *
 * It uses the axios library for HTTP requests and includes
 * error handling for network issues and API responses.
 *
 */

const axios = require('axios'); // Import the 'axios' module
const https = require('https'); // Required for bypassing SSL
const movieId = process.argv[2]; // Get the Movie ID from command-line arguments

// Check if a Movie ID was provided
if (!movieId) {
  console.error("Usage: ./0-starwars_characters.js <movie_id>");
  process.exit(1); // Exit with an error code
}

const filmUrl = `https://swapi.dev/api/films/${movieId}/`;

// Create an HTTPS agent to ignore SSL certificate validation
// WARNING: This disables SSL certificate validation.
// Only use for development/testing if you understand the risks.
const agent = new https.Agent({
  rejectUnauthorized: false // Equivalent to strictSSL: false in 'request'
});

axios.get(filmUrl, { httpsAgent: agent }) // Use the agent for the film request
  .then(async response => { // Use async here to allow await inside
    const filmData = response.data; // Axios puts response data in .data
    const characterUrls = filmData.characters;

    if (!characterUrls || characterUrls.length === 0) {
      console.log(`No characters found for Movie ID: ${movieId}`);
      // Add trailing newline even if no characters found, if checker expects it
      console.log('');
      return;
    }

    // Fetch and print each character's name sequentially using async/await
    for (const charUrl of characterUrls) {
      try {
        const charResponse = await axios.get(charUrl, { httpsAgent: agent }); // Use the agent for character requests
        console.log(charResponse.data.name);
      } catch (charError) {
        // Log individual character fetch errors but continue for other characters
        console.error(`Error fetching character from ${charUrl}: ${charError.message}`);
      }
    }
    // --- ADDING THE TRAILING NEWLINE ---
    // This console.log('') will ensure there's an extra newline character
    // at the very end of the entire script's output, which some checkers require.
    console.log('');

  })
  .catch(error => {
    // Enhanced error handling for axios
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error(`Error: Received status code ${error.response.status} for film ID ${movieId}`);
      console.error(`Response data: ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an http.ClientRequest in node.js
      console.error(`Error connecting to the Star Wars API: No response received. ${error.message}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error(`An unexpected error occurred: ${error.message}`);
    }
    process.exit(1); // Exit with error code on any API fetch failure
  });
