import { initData } from './tmdbService.js';
import { actors as actorsList } from './dataForQuestions.js';

(async () => {
    console.log('🚀 Initializing data from TMDB...\n');
    await initData();

    // Import to get CACHED_DATA
    const { default: CACHED_DATA_EXPORT } = await import('./tmdbService.js');

    // Manually run the logic to see what's happening
    const tmdbService = await import('./tmdbService.js');

    console.log('\n' + '='.repeat(70));
    console.log('STEP 1: Checking if target actors appear in the data at all');
    console.log('='.repeat(70));

    console.log('\nTarget actors from dataForQuestions.js:');
    console.log(actorsList);

    console.log('\n' + '='.repeat(70));
    console.log('STEP 2: Testing WITHOUT the actorsList filter');
    console.log('='.repeat(70) + '\n');

    // Call the function to see debug output
    const result = tmdbService.getCharactersWithMultipleActors();

    console.log('\n' + '='.repeat(70));
    console.log('FINAL RESULT');
    console.log('='.repeat(70));

    if (Object.keys(result).length === 0) {
        console.log('⚠️  NO RESULTS! This means either:');
        console.log('   1. No characters have multiple actors, OR');
        console.log('   2. Characters with multiple actors don\'t include anyone from actorsList');
    } else {
        console.log(JSON.stringify(result, null, 2));
        console.log(`\n✅ Total characters: ${Object.keys(result).length}`);
    }
})();
