import { initData, getCharactersWithMultipleActors } from './tmdbService.js';

// Direct inspection of CACHED_DATA
let CACHED_DATA_INSPECTION = null;

// Monkey-patch to get access to CACHED_DATA
const originalInit = initData;

(async () => {
    console.log('🚀 Initializing data from TMDB...\n');
    await initData();

    // Let's manually check the data for Hulk-related characters
    console.log('\n' + '='.repeat(60));
    console.log('🔍 Searching for Hulk-related characters...');
    console.log('='.repeat(60) + '\n');

    // Import CACHED_DATA directly to inspect
    const tmdbModule = await import('./tmdbService.js');

    console.log('\n' + '='.repeat(60));
    console.log('Running getCharactersWithMultipleActors endpoint');
    console.log('='.repeat(60) + '\n');

    const result = getCharactersWithMultipleActors();

    console.log('\n' + '='.repeat(60));
    console.log('FINAL RESULT');
    console.log('='.repeat(60));
    console.log(JSON.stringify(result, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log(`Total characters in result: ${Object.keys(result).length}`);
    console.log('='.repeat(60));

    // List character names if any
    if (Object.keys(result).length > 0) {
        console.log('\nCharacters found:');
        Object.keys(result).forEach(char => {
            console.log(`  - ${char}`);
        });
    }
})();
