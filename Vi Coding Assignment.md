Vi Coding Assignment

Background

At Vi, we really like Marvel… REALLY REALLY LIKE Marvel.

Did you know that there are few actors who played 2 different leading roles in Marvel movies?

We’re not sure who those actors are, and you’re going to help us find out!

The assignment

We will need a web server that will answer the following questions:

1. Which Marvel movies did each actor play in?

​
Api definition: [GET] /moviesPerActor

​
Response structure: { actorName: [movies names] }

2. Who are the actors who played more than one Marvel character?

​
Api definition: [GET] /actorsWithMultipleCharacters

​
Response  structure: { actorName: [{movieName, characterName}] }

3. Roles (characters) that were played by more than one actor?

​
Api definition: [GET] /charactersWithMultipleActors

​
Response  structure: { characterName: [{movieName, actorName}] }

16 HaArba'a Street, Tel-Aviv, Zip 6473916   /   info@vi.co   /   https://vi.co

---

Prerequisites

●​ Your implementation should be committed to your own public git repository

●​ Attached is a zip file containing a skeleton for the assignment, you may use it as a base

for your answer

●​ Also in the zip file is a list of Marvel movies & actors we’re interested in

●​ The server will be implemented in JS and express.js

●​ You should expose REST endpoints that will provide answers to the questions above

●​ Add a README file with instructions on how to run the server and query these

endpoints

●​ Use the following API:

https://developers.themoviedb.org/3/getting-started/introduction

o​ api_key: ac505a02032a33d65dd28b41f72182e1

How will the assignment be evaluated

We’re looking for these main features:

●​ A working implementation that fulfills the assignment given

●​ Scalable & performant code with extensibility in mind

●​ Clean, legible and verbose code

●​ Efficient use of modern JS and its components

●​ Tests are very much encouraged

Good Luck!

16 HaArba'a Street, Tel-Aviv, Zip 6473916   /   info@vi.co   /   https://vi.co

---

