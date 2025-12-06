# Marvel Movies API

A RESTful API service that provides insights into Marvel movies and actors using data from The Movie Database (TMDB). The service answers queries about which actors appeared in which movies, identifies actors who played multiple characters, and finds characters portrayed by multiple actors.

## 📋 Project Overview

This application fetches movie credits data from TMDB for a curated list of Marvel movies and actors, then provides three analytical endpoints:

1. **Movies Per Actor** - Which Marvel movies did each target actor appear in?
2. **Actors with Multiple Characters** - Which target actors played more than one distinct Marvel character (with smart character name normalization)?
3. **Characters with Multiple Actors** - Which characters were portrayed by different actors, where at least one actor is in the target list?

## 🚀 How to Run the Code

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/thefrieddan1/hevi
cd vi_labs
```

2. Install dependencies:
```bash
npm install
```

### Running the Application

Start the server:
```bash
npm start
```

The server will start on `http://localhost:3000`. During startup, it will automatically fetch and cache data from TMDB (this takes a few seconds).

### Available Endpoints

Once the server is running, you can access:

- **GET** `/moviesPerActor` - Returns a mapping of target actors to their movies
- **GET** `/actorsWithMultipleCharacters` - Returns target actors who played multiple distinct characters (normalized)
- **GET** `/charactersWithMultipleActors` - Returns characters played by multiple actors (where at least one is a target actor)

#### Example Requests

Using curl:
```bash
# Get movies per actor
curl http://localhost:3000/moviesPerActor

# Get actors with multiple characters
curl http://localhost:3000/actorsWithMultipleCharacters

# Get characters with multiple actors
curl http://localhost:3000/charactersWithMultipleActors
```

Or open in your browser:
- http://localhost:3000/moviesPerActor
- http://localhost:3000/actorsWithMultipleCharacters
- http://localhost:3000/charactersWithMultipleActors

### Running Tests

Execute the test suite:
```bash
npm test
```

The tests use Jest and include mocked TMDB API responses to ensure reliable, fast testing without external dependencies.

## 🏗️ Architecture & Design Principles

### Scalable & Performant Code with Extensibility in Mind

This project demonstrates several key architectural decisions for scalability and performance:

#### 1. **Performance Optimizations**

- **Data Caching**: Movie credits are fetched once at startup and stored in memory (`CACHED_DATA`), eliminating redundant API calls for every query
- **Parallel API Requests**: All TMDB movie credits are fetched concurrently using `Promise.all()`, reducing total fetch time from sequential O(n) to parallel O(1) relative to the slowest request
- **Comprehensive Data Storage**: All cast members from target movies are cached to enable character recasting detection (endpoint 3), while endpoints 1 & 2 filter to target actors only
- **O(n) Query Complexity**: All three endpoint queries run in linear time, using single-pass iterations over the cached data
- **Smart Character Normalization**: Character names are normalized to handle variations (military ranks, aliases, uncredited tags), ensuring accurate multi-character detection

#### 2. **Scalability Features**

- **Asynchronous Architecture**: Non-blocking async/await patterns throughout ensure the server can handle concurrent requests efficiently
- **Separation of Concerns**: Clear separation between:
  - **API Layer** (`index.js`) - HTTP endpoints and request handling
  - **Service Layer** (`tmdbService.js`) - Business logic and data processing
  - **Data Layer** (`dataForQuestions.js`) - Configuration and data sources
- **Stateless Query Functions**: All query functions (`getMoviesPerActor`, etc.) are stateless and read from shared cache, enabling horizontal scaling

#### 3. **Extensibility Design**

- **Configurable Data Source**: Movies and actors are defined in `dataForQuestions.js`, making it trivial to:
  - Add new movies or actors
  - Switch to different movie franchises
  - Load data from external configuration files or databases
- **Modular Service Functions**: Each analytical query is a separate exported function, allowing:
  - Easy addition of new query types
  - Independent testing and modification
  - Reuse in different contexts (CLI, GraphQL, etc.)
- **Swappable Components**:
  - The TMDB API client could be replaced with another data source by updating `fetchCredits()`
  - The in-memory cache (`CACHED_DATA`) could be replaced with Redis/Memcached with minimal changes
  - The Express server could be swapped for a different framework without touching business logic
- **Type-Safe Data Structures**: Consistent data shapes (`{ movieName, actorName, characterName }`) make it easy to add transformation layers, validation, or migrate to TypeScript

#### 4. **Code Quality & Maintainability**

- **Comprehensive Testing**: Mocked tests ensure reliability and enable safe refactoring
- **Error Handling**: Graceful degradation when individual API requests fail
- **Clean Code**: Well-documented functions with single responsibilities
- **ES6 Modules**: Modern import/export syntax for better tree-shaking and dependency management

#### 5. **Character Name Normalization**

To accurately detect when actors play multiple characters or when characters are recast, the system implements intelligent character name normalization:

- **Alias Handling**: `"Bruce Banner / The Hulk"` → `"Bruce Banner"` (takes first name before " / ")
- **Uncredited Tags**: `"Nick Fury (uncredited)"` → `"Nick Fury"` (removes uncredited suffix)
- **Military Ranks**: `"Lt. Col. James 'Rhodey' Rhodes"` → `"James Rhodes"` (removes ranks like Lt., Colonel, etc.)
- **Nicknames**: Removes quoted nicknames like `'Rhodey'` to get the canonical name

This ensures variations like "Tony Stark", "Tony Stark (uncredited)", and "Tony Stark / Iron Man" are all treated as the same character, while truly different characters like "Johnny Storm" and "Erik Killmonger" (both played by Michael B. Jordan) are correctly identified as distinct.

### Potential Future Enhancements

The architecture supports straightforward extensions:
- Add pagination for large result sets
- Implement GraphQL for flexible client queries
- Add database persistence layer
- Integrate caching layer (Redis) for distributed deployments
- Add rate limiting and request throttling
- Implement real-time updates via WebSockets
- Add monitoring and observability (Prometheus, Grafana)

## 📁 Project Structure

```
vi_labs/
├── index.js                 # Express server & API endpoints
├── tmdbService.js          # Core business logic & TMDB integration
├── dataForQuestions.js     # Configuration: movies & actors list
├── tmdbService.test.js     # Unit tests
├── package.json            # Dependencies & scripts
├── babel.config.json       # Babel configuration for Jest
└── README.md              # This file
```

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Web Framework**: Express.js
- **HTTP Client**: Axios
- **Testing**: Jest with Babel
- **Data Source**: The Movie Database (TMDB) API
