#!/bin/bash

# Base URL
URL="http://localhost:3000"

echo "---------------------------------------------------"
echo "Testing Vi Coding Assignment API Endpoints"
echo "---------------------------------------------------"

echo ""
echo "1. Testing /moviesPerActor"
echo "   (Expected: JSON object of { ActorName: [Movies] })"
echo "---------------------------------------------------"
curl -s "$URL/moviesPerActor" | python3 -m json.tool || curl "$URL/moviesPerActor"

echo ""
echo ""
echo "2. Testing /actorsWithMultipleCharacters"
echo "   (Expected: Actors who played >1 character)"
echo "---------------------------------------------------"
curl -s "$URL/actorsWithMultipleCharacters" | python3 -m json.tool || curl "$URL/actorsWithMultipleCharacters"

echo ""
echo ""
echo "3. Testing /charactersWithMultipleActors"
echo "   (Expected: Characters played by >1 actor)"
echo "---------------------------------------------------"
curl -s "$URL/charactersWithMultipleActors" | python3 -m json.tool || curl "$URL/charactersWithMultipleActors"

echo ""
echo "---------------------------------------------------"
echo "Done."