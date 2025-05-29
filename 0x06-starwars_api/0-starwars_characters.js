#!/usr/bin/env node
/**
 * A script that prints all characters of a Star Wars movie
 * based on the provided Movie ID.
 *
 * Usage: ./0-starwars_characters.js <movie_id>
 */

const request = require('request'); // Import the 'request' module
const movieId = process.argv[2]; // Get the Movie ID from command-line arguments

// Check if a Movie ID was provided
if (!movieId) {
  console.error("Usage: ./0-starwars_characters.js <movie_id>");
  process.exit(1); // Exit with an error code
}

const filmUrl = `https://swapi.dev/api/films/${movieId}/`;

request(filmUrl, (error, response, body) => {
  if (error) {
    console.error(`Error connecting to the Star Wars API: ${error.message}`);
    process.exit(1);
  }

  if (response.statusCode !== 200) {
    console.error(`Error: Received status code ${response.statusCode} for film ID ${movieId}`);
    process.exit(1);
  }

  try {
    const filmData = JSON.parse(body);
    const characterUrls = filmData.characters;

    if (!characterUrls || characterUrls.length === 0) {
      console.log(`No characters found for Movie ID: ${movieId}`);
      return;
    }

    // Function to fetch character names sequentially
    // This uses a recursive approach to maintain order
    function fetchCharacter(index) {
      if (index >= characterUrls.length) {
        return; // All characters fetched
      }

      request(characterUrls[index], (charError, charResponse, charBody) => {
        if (charError) {
          console.error(`Error fetching character: ${charError.message}`);
          // Continue to next character even if one fails
          fetchCharacter(index + 1);
          return;
        }

        if (charResponse.statusCode !== 200) {
          console.error(`Error: Received status code ${charResponse.statusCode} for character URL ${characterUrls[index]}`);
          fetchCharacter(index + 1);
          return;
        }

        try {
          const charData = JSON.parse(charBody);
          console.log(charData.name);
          fetchCharacter(index + 1); // Fetch the next character
        } catch (parseError) {
          console.error(`Error parsing character data: ${parseError.message}`);
          fetchCharacter(index + 1);
        }
      });
    }

    // Start fetching the first character
    fetchCharacter(0);

  } catch (parseError) {
    console.error(`Error parsing film data: ${parseError.message}`);
    process.exit(1);
  }
});
