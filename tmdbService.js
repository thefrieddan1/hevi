import axios from 'axios';
import { movies, actors as actorsList } from './dataForQuestions.js';

const API_KEY = 'ac505a02032a33d65dd28b41f72182e1'; // In production, use process.env.API_KEY
const BASE_URL = 'https://api.themoviedb.org/3';

// In-memory storage for processed data
let CACHED_DATA = null;

/**
 * Fetches credits for a single movie ID
 */
const fetchCredits = async (movieId) => {
    try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}/credits`, {
            params: { api_key: API_KEY }
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching data for movie ID ${movieId}:`, error.message);
        return { cast: [] }; // Return empty cast on failure to allow other requests to proceed
    }
};

/**
 * Main initialization function.
 * Fetches all data from TMDB and builds a normalized lookup table.
 */
export const initData = async () => {
    console.log("Initializing data from TMDB... this may take a moment.");

    const movieTitles = Object.keys(movies);
    const movieIds = Object.values(movies);

    // 1. Fetch all movie credits in parallel
    const creditPromises = movieIds.map(id => fetchCredits(id));
    const creditsResults = await Promise.all(creditPromises);

    // 2. Build a flat list of all appearances: { movieName, actorName, characterName }
    const allAppearances = [];

    creditsResults.forEach((creditData, index) => {
        const movieName = movieTitles[index]; // Map back to title using index

        if (creditData && creditData.cast) {
            creditData.cast.forEach(castMember => {
                allAppearances.push({
                    movieName: movieName,
                    actorName: castMember.name,
                    characterName: castMember.character
                });
            });
        }
    });

    CACHED_DATA = allAppearances;
    console.log("Data initialization complete.");
};

/**
 * Q1: Which Marvel movies did each actor play in?
 * Filters strictly by the `actors` array provided in dataForQuestions.js
 */
export const getMoviesPerActor = () => {
    const result = {};

    // Initialize result object with provided actors to ensure all are present even if empty
    actorsList.forEach(actor => {
        result[actor] = [];
    });

    // Populate movies
    CACHED_DATA.forEach(record => {
        if (result.hasOwnProperty(record.actorName)) {
            // Avoid duplicates if actor is credited multiple times in one movie
            if (!result[record.actorName].includes(record.movieName)) {
                result[record.actorName].push(record.movieName);
            }
        }
    });

    return result;
};

/**
 * Q2: Actors who played more than one Marvel character
 * Filters to only include actors from the target actors list.
 */
export const getActorsWithMultipleCharacters = () => {
    const actorMap = {}; // { ActorName: [ { movieName, characterName } ] }

    // Group by Actor
    CACHED_DATA.forEach(record => {
        if (!actorMap[record.actorName]) {
            actorMap[record.actorName] = [];
        }
        actorMap[record.actorName].push({
            movieName: record.movieName,
            characterName: record.characterName
        });
    });

    // Filter for actors with > 1 unique character name AND who are in the target actors list
    const result = {};

    for (const [actor, roles] of Object.entries(actorMap)) {
        // Only process actors who are in our target list
        if (!actorsList.includes(actor)) {
            continue;
        }

        // Create a Set of character names to check uniqueness (ignoring movie context)
        const uniqueCharacters = new Set(roles.map(r => r.characterName));

        // Logic: We are looking for DIFFERENT characters. 
        // Note: TMDB often returns "Self" or "Uncredited". We might want to filter those in a real app.
        // For this assignment, we strictly count distinct character strings.
        if (uniqueCharacters.size > 1) {
            result[actor] = roles;
        }
    }

    return result;
};

/**
 * Helper function to normalize character names
 * E.g., "Bruce Banner / The Hulk" -> "Bruce Banner"
 */
const normalizeCharacterName = (charName) => {
    // Split on " / " and take the first part as the canonical name
    // This handles cases like "Bruce Banner / The Hulk" and "Bruce Banner"
    const parts = charName.split(' / ');
    return parts[0].trim();
};

/**
 * Q3: Roles (characters) that were played by more than one actor
 */
export const getCharactersWithMultipleActors = () => {
    const charMap = {}; // { NormalizedCharacterName: [ { movieName, actorName, originalCharName } ] }

    // Group by Normalized Character Name
    CACHED_DATA.forEach(record => {
        const originalCharName = record.characterName;
        const normalizedCharName = normalizeCharacterName(originalCharName);

        if (!charMap[normalizedCharName]) {
            charMap[normalizedCharName] = [];
        }
        charMap[normalizedCharName].push({
            movieName: record.movieName,
            actorName: record.actorName,
            originalCharName: originalCharName
        });
    });

    const result = {};
    let multiActorCount = 0;
    let passedFilterCount = 0;

    for (const [normalizedCharName, appearances] of Object.entries(charMap)) {
        const uniqueActors = new Set(appearances.map(a => a.actorName));

        // Criteria 1: Does the character have > 1 actor?
        if (uniqueActors.size > 1) {
            multiActorCount++;

            // Criteria 2: Does at least one of those actors appear in the TARGET_ACTORS list?
            const hasTargetActor = Array.from(uniqueActors).some(actor => actorsList.includes(actor));

            if (hasTargetActor) {
                passedFilterCount++;
                result[normalizedCharName] = appearances.map(a => ({
                    movieName: a.movieName,
                    actorName: a.actorName,
                    characterName: a.originalCharName
                }));
            }
        }
    }

    return result;
};