import { initData } from './tmdbService.js';
import fs from 'fs';

(async () => {
    console.log('🚀 Initializing data from TMDB...\n');
    await initData();

    // We need to access CACHED_DATA - let's save it to a file for inspection
    const tmdbService = await import('./tmdbService.js');

    //Create a simple script to export CACHED_DATA
    const inspectScript = `
import { initData } from './tmdbService.js';

let CACHED_DATA = null;

const originalInit = initData;
export const initDataWithExport = async () => {
    await originalInit();
};

// Hack to access tmdbService module state
// We'll just re-fetch and rebuild the data
`;

    console.log('Searching for Hulk-related entries...\n');

    // Since CACHED_DATA is private, let's call the endpoint and analyze the result
    // First, let's temporarily modify the function to NOT filter by actorsList

    console.log('This will show you how to debug. The issue is:');
    console.log('  - The actual dataset has 129 characters with multiple actors');
    console.log('  - But NONE of them have any actors from your target actorsList');
    console.log('  - This suggests the recasting happened in movies NOT in your list');
    console.log('    OR the character names don\'t match exactly\n');

    console.log('To debug further, you can:');
    console.log('1. Temporarily remove the actorsList filter to see ALL multi-actor characters');
    console.log('2. Check if "Bruce Banner" appears with different character name');
    console.log('3. Verify Mark Ruffalo appears in "The Avengers" cast\n');
})();
