# Debugging Guide for getCharactersWithMultipleActors

## Method 1: Console Logging (Already Added) ✅

I've added debug logging to `tmdbService.js`. Now you can:

### 1. Start the server:
```bash
npm start
```

### 2. Test the endpoint with curl:
```bash
curl http://localhost:3000/charactersWithMultipleActors
```

### 3. Test with browser:
Open your browser and go to: http://localhost:3000/charactersWithMultipleActors

**What you'll see in the console:**
- Total characters found
- For each character with multiple actors:
  - Character name and list of actors
  - Whether it has a target actor
  - Whether it passed both criteria (✅) or failed (❌)
- Final summary stats

---

## Method 2: Node.js Inspector (Chrome DevTools)

### 1. Start server with inspector:
```bash
node --inspect index.js
```

### 2. Open Chrome DevTools:
- Open Chrome browser
- Go to: `chrome://inspect`
- Click "inspect" under your Node.js target

### 3. Set breakpoints:
- In Sources tab, find `tmdbService.js`
- Click line numbers to set breakpoints (e.g., line 146, 149)
- Make a request to the endpoint
- Execution will pause at breakpoints

---

## Method 3: VS Code Debugger

### 1. Create launch configuration (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/index.js"
    }
  ]
}
```

### 2. Set breakpoints in VS Code:
- Click left margin in `tmdbService.js` at line 146 or 149

### 3. Press F5 or click "Run and Debug"

### 4. Make a request to trigger the breakpoint

---

## Method 4: Test Script (Quick Testing)

Create a test file to run the function directly without starting the server:

**`test-endpoint.js`:**
```javascript
import { initData, getCharactersWithMultipleActors } from './tmdbService.js';

(async () => {
    console.log('Initializing data...');
    await initData();
    
    console.log('\n=== Running getCharactersWithMultipleActors ===\n');
    const result = getCharactersWithMultipleActors();
    
    console.log('\n=== Final Result ===');
    console.log(JSON.stringify(result, null, 2));
})();
```

**Run it:**
```bash
node test-endpoint.js
```

---

## Method 5: Using httpie or Postman

### With httpie:
```bash
# Install httpie if not installed: brew install httpie
http GET http://localhost:3000/charactersWithMultipleActors
```

### With Postman:
1. Create GET request to `http://localhost:3000/charactersWithMultipleActors`
2. Click Send
3. View response in Body tab
4. Check server console for debug logs

---

## Debugging Tips

1. **Check specific character**: Add this before the return statement:
   ```javascript
   if (result['Bruce Banner / The Hulk']) {
       console.log('[DEBUG] Hulk details:', result['Bruce Banner / The Hulk']);
   }
   ```

2. **Inspect actorsList**: Add at the top of the function:
   ```javascript
   console.log('[DEBUG] Target actors list:', actorsList);
   ```

3. **Check CACHED_DATA**: Add at the start:
   ```javascript
   console.log('[DEBUG] Total cached records:', CACHED_DATA.length);
   ```

---

## Expected Output Example

When you make a request, you should see something like:

```
[DEBUG] Total characters found: 1234
[DEBUG] Character "Bruce Banner / The Hulk" has 2 actors: ['Edward Norton', 'Mark Ruffalo']
[DEBUG] Has target actor: true
[DEBUG] ✅ "Bruce Banner / The Hulk" PASSED both criteria - including in results
[DEBUG] Character "James Rhodes / War Machine" has 2 actors: ['Terrence Howard', 'Don Cheadle']
[DEBUG] Has target actor: true
[DEBUG] ✅ "James Rhodes / War Machine" PASSED both criteria - including in results
...
[DEBUG] Summary: 5 characters with multiple actors, 3 passed both filters
```
