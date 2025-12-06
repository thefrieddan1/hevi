import { initData } from './tmdbService.js';

// This is a copy of getCharactersWithMultipleActors WITHOUT the actorsList filter
const getCharactersWithMultipleActorsNoFilter = (CACHED_DATA) => {
    const charMap = {};

    CACHED_DATA.forEach(record => {
        const charName = record.characterName;

        if (!charMap[charName]) {
            charMap[charName] = [];
        }
        charMap[charName].push({
            movieName: record.movieName,
            actorName: record.actorName
        });
    });

    const result = {};

    for (const [charName, appearances] of Object.entries(charMap)) {
        const uniqueActors = new Set(appearances.map(a => a.actorName));

        if (uniqueActors.size > 1) {
            result[charName] = {
                actors: Array.from(uniqueActors),
                appearances: appearances
            };
        }
    }

    return result;
};

(async () => {
    console.log('🚀 Initializing data...\n');
    await initData();

    // Import and run the actual function to get CACHED_DATA populated
    const tmdbModule = await import('./tmdbService.js');

    // We need to access CACHED_DATA somehow. Let's just manually query the TMDB API
    // Actually, let's check what getMoviesPerActor returns to see if Mark Ruffalo is there
    console.log('\n=== Checking if Mark Ruffalo appears in the data ===');
    const moviesPerActor = tmdbModule.getMoviesPerActor();

    if (moviesPerActor['Mark Ruffalo']) {
        console.log('✅ Mark Ruffalo found! Movies:');
        console.log(moviesPerActor['Mark Ruffalo']);
    } else {
        console.log('❌ Mark Ruffalo NOT found in the data');
    }

    if (moviesPerActor['Edward Norton']) {
        console.log('\n✅ Edward Norton found! Movies:');
        console.log(moviesPerActor['Edward Norton']);
    } else {
        console.log('\n❌ Edward Norton NOT found in the data');
    }

    console.log('\n=== Checking Don Cheadle (War Machine recast) ===');
    if (moviesPerActor['Don Cheadle']) {
        console.log('✅ Don Cheadle found! Movies:');
        console.log(moviesPerActor['Don Cheadle']);
    } else {
        console.log('❌ Don Cheadle NOT found in the data');
    }

    console.log('\n=== Running getCharactersWithMultipleActors (WITH filter) ===');
    const withFilter = tmdbModule.getCharactersWithMultipleActors();
    console.log(`Characters found WITH actorsList filter: ${Object.keys(withFilter).length}`);

    if (Object.keys(withFilter).length > 0) {
        console.log('\nCharacters:');
        for (const [char, appearances] of Object.entries(withFilter)) {
            const actors = [...new Set(appearances.map(a => a.actorName))];
            console.log(`  - "${char}": ${actors.join(', ')}`);
        }
    }
})();
