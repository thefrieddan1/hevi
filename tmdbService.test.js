import axios from 'axios';
import {
    initData,
    getMoviesPerActor,
    getActorsWithMultipleCharacters,
    getCharactersWithMultipleActors
} from './tmdbService.js';

// 1. Mock Axios to prevent real network calls
jest.mock('axios');

// 2. Mock the configuration file to use a small, controlled dataset
jest.mock('./dataForQuestions.js', () => ({
    movies: {
        'Movie A': 100,
        'Movie B': 200
    },
    actors: ['Actor 1', 'Actor 2', 'Actor 3'] // We are only interested in these
}));

describe('Vi Coding Assignment - Logic Tests', () => {

    // Setup test data
    beforeAll(async () => {
        // Define mock responses for TMDB API
        axios.get.mockImplementation((url) => {
            if (url.includes('/movie/100/credits')) {
                return Promise.resolve({
                    data: {
                        cast: [
                            { id: 1, name: 'Actor 1', character: 'Hero X' },
                            { id: 2, name: 'Actor 2', character: 'Villain Y' },
                            { id: 99, name: 'Random Extra', character: 'Civilian' }
                        ]
                    }
                });
            }
            if (url.includes('/movie/200/credits')) {
                return Promise.resolve({
                    data: {
                        cast: [
                            { id: 1, name: 'Actor 1', character: 'Hero X' }, // Same char
                            { id: 2, name: 'Actor 2', character: 'Hero Z' }, // Different char (Q2 Trigger)
                            { id: 3, name: 'Actor 3', character: 'Villain Y' } // Same char as Actor 2 in Movie A (Q3 Trigger)
                        ]
                    }
                });
            }
            return Promise.resolve({ data: { cast: [] } });
        });

        // Initialize the service with our mocked data
        await initData();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('Q1: getMoviesPerActor should map actors to their movies', () => {
        const result = getMoviesPerActor();

        // Actor 1 is in both movies
        expect(result['Actor 1']).toEqual(expect.arrayContaining(['Movie A', 'Movie B']));

        // Actor 2 is in both movies
        expect(result['Actor 2']).toEqual(expect.arrayContaining(['Movie A', 'Movie B']));

        // Actor 3 is only in Movie B
        expect(result['Actor 3']).toEqual(['Movie B']);

        // Results should not contain actors not in the interest list (e.g., Random Extra)
        expect(result['Random Extra']).toBeUndefined();
    });

    test('Q2: getActorsWithMultipleCharacters should find actors playing different roles', () => {
        const result = getActorsWithMultipleCharacters();

        // Actor 2 played "Villain Y" in Movie A and "Hero Z" in Movie B
        expect(result['Actor 2']).toBeDefined();
        expect(result['Actor 2']).toHaveLength(2);
        expect(result['Actor 2'][0].characterName).not.toEqual(result['Actor 2'][1].characterName);

        // Actor 1 played "Hero X" in both, so should NOT be in this list
        expect(result['Actor 1']).toBeUndefined();
    });

    test('Q3: getCharactersWithMultipleActors should find roles played by multiple actors', () => {
        const result = getCharactersWithMultipleActors();

        // "Villain Y" was played by Actor 2 (Movie A) and Actor 3 (Movie B)
        expect(result['Villain Y']).toBeDefined();
        expect(result['Villain Y']).toHaveLength(2);

        const actorsForVillainY = result['Villain Y'].map(r => r.actorName);
        expect(actorsForVillainY).toContain('Actor 2');
        expect(actorsForVillainY).toContain('Actor 3');

        // "Hero X" was only played by Actor 1, so should NOT be in this list
        expect(result['Hero X']).toBeUndefined();
    });
});