# Frequently Asked Questions
---

## My players can't access the server
---
There are multiple causes for a connection error from client to server.
- Your hosting address is not accessible and/or a local address. Make sure to have an open port and port-forwarding enabled if you want to use this on a local machine.
- The provided 'match token' is not valid. Make sure you gave your players the correct token
- There are already 10 players communicating with the server. You may have reused a match token, make sure to reset the tokens after each match/series.

## How can I add my own Overlays?
---
You can add your own overlays by creating a folder for each overlay in the ```/overlays``` directory. Each overlay has a ```index.html``` file which is where you'll build the overlay. Add ```.css``` and ```.js``` files as you wish.

## How can I add my own server endpopints?
---
You can add endpoints by creating a new ```.get``` or ```.post``` method in the ```/routes/routes.js``` file. Make sure that it is secure enough and is only accessible if it checks the ```checkUserMatchToken()``` function found at ```/utils.js```.


## Why use Overwolf?
---
Overwolf allows a quick access to a VALORANT API. As the real Riot API is not easy to access, it much easier to have each player install an app from the overwolf store directly and use this as a source. In addition the Riot API would not allow you to get every necessary piece of data needed for the overlay as player health, shield, weapon and other are not available for the enemy team.

## Can I use the overlay without Overwolf?
---
Un can technically use the overlay without Overwolf but you'll need someone to update each and every player stat manually and probably rewrite a lot of backend code, it is not recommended.
