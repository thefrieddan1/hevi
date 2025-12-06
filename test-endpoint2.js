import { initData, getActorsWithMultipleCharacters } from './tmdbService.js';

// Helper to normalize character names (same logic as in tmdbService)
const normalizeCharacterName = (charName) => {
    const parts = charName.split(' / ');
    return parts[0].trim();
};

(async () => {
    console.log('🚀 Initializing data from TMDB...\n');
    await initData();

    console.log('\n' + '='.repeat(70));
    console.log('Endpoint 2: Actors with Multiple Characters (NORMALIZED)');
    console.log('='.repeat(70) + '\n');

    const result = getActorsWithMultipleCharacters();

    console.log(`✅ Total actors found: ${Object.keys(result).length}\n`);

    if (Object.keys(result).length > 0) {
        console.log('Actors who played TRULY DIFFERENT characters:\n');

        for (const [actor, roles] of Object.entries(result)) {
            // Get unique NORMALIZED character names
            const normalizedChars = new Set(roles.map(r => normalizeCharacterName(r.characterName)));

            console.log(`📌 ${actor} (${normalizedChars.size} unique characters):`);

            // Group by normalized name
            const charGroups = {};
            roles.forEach(role => {
                const normalized = normalizeCharacterName(role.characterName);
                if (!charGroups[normalized]) {
                    charGroups[normalized] = [];
                }
                charGroups[normalized].push(role);
            });

            // Show each character with its variations
            for (const [normalizedChar, variations] of Object.entries(charGroups)) {
                console.log(`   • ${normalizedChar}`);
                const moviesList = variations.map(v => `${v.movieName}`).join(', ');
                console.log(`     Movies: ${moviesList}`);

                // Show variations if any
                const uniqueVariations = [...new Set(variations.map(v => v.characterName))];
                if (uniqueVariations.length > 1) {
                    console.log(`     Name variations: ${uniqueVariations.join(' | ')}`);
                }
            }
            console.log('');
        }
    }

    console.log('\n' + '='.repeat(70));
    console.log('FULL JSON OUTPUT');
    console.log('='.repeat(70));
    console.log(JSON.stringify(result, null, 2));
})();
