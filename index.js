import express from "express";
import {
    initData,
    getMoviesPerActor,
    getActorsWithMultipleCharacters,
    getCharactersWithMultipleActors
} from "./tmdbService.js";

const app = express();
const PORT = 3000;

// Middleware to ensure data is ready before handling requests
const checkDataReady = (req, res, next) => {
    try {
        // In a real app we might check a boolean flag here
        next();
    } catch (e) {
        res.status(503).send("Server is still initializing data");
    }
};

/**
 * Endpoint 1: Which Marvel movies did each actor play in?
 */
app.get('/moviesPerActor', checkDataReady, (req, res) => {
    try {
        const data = getMoviesPerActor();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 2: Who are the actors who played more than one Marvel character?
 */
app.get('/actorsWithMultipleCharacters', checkDataReady, (req, res) => {
    try {
        const data = getActorsWithMultipleCharacters();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * Endpoint 3: Roles (characters) that were played by more than one actor?
 */
app.get('/charactersWithMultipleActors', checkDataReady, (req, res) => {
    try {
        const data = getCharactersWithMultipleActors();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server only after data is fetched
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    try {
        await initData();
        console.log("Ready to accept requests.");
    } catch (error) {
        console.error("Failed to initialize data:", error);
    }
});