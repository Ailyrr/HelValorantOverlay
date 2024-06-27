# A Community made VALORANT Tournament Overlay
> This is made by the community and is not affiliated with Riot Games and/or VALORANT.

### The concept
We always wanted to have a real tournament overlay for community hosted events. As it seems like Riot only gives access to their "VCT Style" overlay to prominent groups (OfflineTV, AfreecaTV, ...) we tried to replicate the overlay as much as possible in the form of an HTML overlay and a Python App that hot-modifies the html markup in the files. As well as server data fetching should the user host game results and map picks on an offsite server.

### Setup
- Download or clone the repository in a desired folder
- Download all dependencies needed for the program to work (fs, express)
- Modify the ```/server/game_config.json``` file and change the boolean value for ```is_remote_origin``` to  ```true``` or  ```false``` in case you use a custom server origin for your game state components.
- start the server client with ```node ./server/server.js```
- Go to ```localhost:3000/pannel``` to access the control panel where you can change the map picks and more.

### Adding sources to OBS (Open Broadcast Software)
- Download OBS if not already done at [this link](https://obsproject.com/)
- Create your scenes and add a ```Browser Source``` to your scene.
- In the browser check the ```local file```checkbox.
- Chose the corresponding .html file for each overlay component you'd like to add to your stream.

### Functionalites
This is a comprehensive list of all planned and currently working functionalities that this repository contains.

##### Local function (no need for server data)
- Custom Scoreboard Styling. (WIP)
- Custom map picks on top left of screen (Local done, server WIP)
- Custom Halftime and Timeout timers. (Done)
##### Server dependent functions
- Map pick overlay (Done)
- Map pick selector, admin only (WIP)
##### Misc functions
- Streamdeck compatibility (WIP)

### Examples
![Map Picks Top Left Bar](./readme_assets/map_picks_bar.png)
> Used to display which map is currently played and which one is up next. Works with either manual local data modification or with server data fetching.

![Player Stats](./readme_assets/finished_player_stats.png)
> Player Scores progress, player healt, ult points, agent, and name are displayed as in the VCT. The overlay updates every second by getting information from the main application server. Right now editing the json file live also updates the overlay.
### References
![VCT Overlay Reference](https://preview.redd.it/izxic4tn0cab1.jpg?width=640&crop=smart&auto=webp&s=3400e7a4badb75196a13e87b5eb47d3819577784)
> VCT Overlay from which the overlay is extremely inspired (made to look almost identical)

[Valorant Fandom](https://valorant.fandom.com/wiki/VALORANT_Wiki)
> All assets that originate from inside the game are taken from there. (Agent icons, gun icons, game icons, etc...)
### Thanks
