# A Community made VALORANT Tournament Overlay
> This is made by the community and is not affiliated with Riot Games and/or VALORANT.

### The concept
We always wanted to have a real tournament overlay for community hosted events. As it seems like Riot only gives access to their "VCT Style" overlay to prominent groups (OfflineTV, AfreecaTV, ...) we tried to replicate the overlay as much as possible in the form of an HTML overlay and a Python App that hot-modifies the html markup in the files. As well as server data fetching should the user host game results and map picks on an offsite server.

### Setup
- Download or clone the repository in a desired folder
- Download all dependencies needed for the program to work (fs, express)
- Modify the ```/game_config.json``` file and change the boolean value for ```is_remote_origin``` to  ```true``` or  ```false``` in case you use a custom server origin for your game state components. (Note that you need to make sure that the output of your desired endpoint gives out json values with the same structure as in the game_config file)
- start the server client with ```node .```
- Go to either, ```localhost:3000/pannel``` to access the control panel where you can change the map picks and more or go to ```localhost:3000/``` to see all possible endpoints for overlays and the possibility to copy them for adding in OBS.
- Once the local server is running, start the capture app by navigating to ```./capture_app/main.py``` and executing that. This app will need to be connected to an open VALORANT instance and be capturing the viewpoint of an observer. This account should be an inactive observer, meaning that the program will actively change the spectated player each 500ms and always keep the TAB open in order to capture the relevant information. Keep this app running as long as your match is ongoing. The app constantly updates the values in the JSON file to update the overlay in real time, if you close this app the overlay will become unresponsive.

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

![Map State Counter](./readme_assets/game_score.png)
> Built to resemble the official VCT overlay, the top part of the screen boasts information on the team seeding, maps won in the series (small diamond shapes), round counter and timer and information on who has to plant the spike (indicated by the small arrow pointing to either team)

![Player Stats](./readme_assets/finished_player_stats.png)
> Player Scores progress, player healt, ult points, agent, and name are displayed as in the VCT. The overlay updates every second by getting information from the main application server. Right now editing the json file live also updates the overlay.

### References
![VCT Overlay Reference](https://preview.redd.it/izxic4tn0cab1.jpg?width=640&crop=smart&auto=webp&s=3400e7a4badb75196a13e87b5eb47d3819577784)
> VCT Overlay from which the overlay is extremely inspired (made to look almost identical)

[Valorant Fandom](https://valorant.fandom.com/wiki/VALORANT_Wiki)
> All assets that originate from inside the game are taken from there. (Agent icons, gun icons, game icons, etc...)
### Thanks
