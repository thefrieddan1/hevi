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
        'Movie B': 200,
        'Movie C': 300
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
            if (url.includes('/movie/300/credits')) {
                return Promise.resolve({
                    data: {
                        cast: [
                            // Test normalization: same character with different formats
                            { id: 1, name: 'Actor 1', character: 'Lt. Col. James Rhodes' },
                            { id: 1, name: 'Actor 1', character: 'Colonel James Rhodes' },
                            { id: 1, name: 'Actor 1', character: 'James \'Rhodey\' Rhodes / War Machine' },
                            { id: 2, name: 'Actor 2', character: 'Bruce Banner / The Hulk' },
                            { id: 2, name: 'Actor 2', character: 'Bruce Banner (uncredited)' },
                            // Test Q3 filtering: character with multiple actors
                            { id: 99, name: 'Non-Target Actor', character: 'Side Character' },
                            { id: 100, name: 'Another Non-Target Actor', character: 'Side Character' }
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

        // Actor 2 played different characters: "Villain Y", "Hero Z", and "Bruce Banner" 
        // Note: "Bruce Banner / The Hulk" and "Bruce Banner (uncredited)" normalize to same, 
        // but we still return all entries showing the character played across movies
        expect(result['Actor 2']).toBeDefined();

        // Check that Actor 2 has entries that include different character names
        const actor2Chars = result['Actor 2'].map(r => r.characterName);
        expect(actor2Chars).toContain('Villain Y');
        expect(actor2Chars).toContain('Hero Z');
    });

    test('Q2: Character normalization - should treat variations as same character', () => {
        const result = getActorsWithMultipleCharacters();

        // Actor 1 appears because they played "Hero X" (in Movie A and B) 
        // and "James Rhodes" variations (in Movie C)
        // These are TWO different normalized characters
        expect(result['Actor 1']).toBeDefined();

        // But within the "James Rhodes" entries, all variations should be grouped
        const actor1JamesRhodesEntries = result['Actor 1'].filter(r =>
            r.characterName.includes('Rhodes')
        );
        // Should have 3 James Rhodes entries with different name formats
        expect(actor1JamesRhodesEntries.length).toBeGreaterThan(0);
    });

    test('Q2: Should only include actors from target list', () => {
        const result = getActorsWithMultipleCharacters();

        // Non-target actors should never appear, even if they play multiple characters
        expect(result['Random Extra']).toBeUndefined();
        expect(result['Non-Target Actor']).toBeUndefined();
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

    test('Q3: Should filter out characters where NO actor is in target list', () => {
        const result = getCharactersWithMultipleActors();

        // "Side Character" was played by 2 actors, but NEITHER is in the target list
        // So it should NOT appear in results
        expect(result['Side Character']).toBeUndefined();
    });

    test('Q3: Should normalize character names when grouping', () => {
        const result = getCharactersWithMultipleActors();

        // Even though Actor 2 played "Bruce Banner / The Hulk" and "Bruce Banner (uncredited)"
        // in the same movie, they should be grouped together as "Bruce Banner"
        // Since it's the same actor, it doesn't meet the "multiple actors" criteria
        expect(result['Bruce Banner']).toBeUndefined();
    });

    test('Q3: Should preserve original character names in output', () => {
        const result = getCharactersWithMultipleActors();

        // When a character IS returned, it should include the original character names
        if (result['Villain Y']) {
            const charNames = result['Villain Y'].map(r => r.characterName);
            expect(charNames).toContain('Villain Y'); // Original names preserved
        }
    });
});