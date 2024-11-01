
class upcommingMapInterface{
    constructor(){
        this.upcommingMapsDiv = document.getElementById('upcomming-maps');
    }
    async init(){
        const res = await fetch('../get_game_configuration', {method: 'GET', crossorigin: true});
        const json = await res.json();
        const team1Icon = json.team_1.icon_link;
        const team2Icon = json.team_2.icon_link;
        if(res.status === 200){
            let mapArray = [];
            for(const key in json.game_flow){
                switch(json.game_flow[key].state){
                    case 'over':
                        mapArray.push(['over', this.formatMapOverPanel(
                            json.game_flow[key].team_1_score,
                            json.game_flow[key].team_2_score,
                            json.game_flow[key].map,
                            team1Icon,
                            team2Icon
                        )]);
                        break;
                    case 'current':
                        mapArray.push(['current', this.formatMapCurrentPanel(
                            json.game_flow[key].map,
                            json.game_flow[key].map_pick,
                            team1Icon,
                            team2Icon
                        )]);
                        break;
                    case 'upcomming':
                        mapArray.push(['upcomming', this.formatMapUpcommingPanel(
                            json.game_flow[key].map,
                            json.game_flow[key].map_pick,
                            team1Icon,
                            team2Icon
                        )]);
                        break;
                    case 'decider':
                        mapArray.push(['decider', this.formatMapDeciderPanel(
                            json.game_flow[key].map
                        )]);
                        break;
                    default:
                        console.warn('Unknow game state found: ', json.game_flow[key].state, ', ignoring.')
                }
            }
            //Find index of map where map = current
            //For BO3 show every map, for BO5 show a window with three maps shown and with 
            if(mapArray.length > 3){
                let targetIndex = 0;
                for(let i = 0; i<mapArray.length; i++){
                    if(mapArray[i][0] == 'current'){
                        targetIndex = i;
                    }
                }
                if(targetIndex == 0){
                    for(let i = targetIndex; i<targetIndex + 3; i++){
                        this.upcommingMapsDiv.innerHTML += mapArray[i][1];
                    }
                } else if(targetIndex == mapArray.length -1){
                    for(let i = targetIndex - 2; i<targetIndex + 1; i++){
                        this.upcommingMapsDiv.innerHTML += mapArray[i][1];
                    }
                } else {
                    for(let i = targetIndex - 1; i<targetIndex + 2; i++){
                        this.upcommingMapsDiv.innerHTML += mapArray[i][1];
                    }
                }
                //Change Styling for first and last element;
                document.getElementsByClassName('map-select-information-container')[0].classList.add('first-map-select');
                document.getElementsByClassName('map-select-information-container')[document.getElementsByClassName('map-select-information-container').length - 1].classList.add('decider-map-select');
            } else {
                //Map is smaller or equal to 3
                for(let i = 0; i<mapArray.length; i++){
                    this.upcommingMapsDiv.innerHTML += mapArray[i][1];
                }
                //Change Styling for first and last element;
                document.getElementsByClassName('map-select-information-container')[0].classList.add('first-map-select');
                document.getElementsByClassName('map-select-information-container')[document.getElementsByClassName('map-select-information-container').length - 1].classList.add('decider-map-select');
                
            }
        }
    }
    formatMapOverPanel(t1Score, t2Score, map, t1Icon, t2Icon){
        let scoreString = `<img class="team-select-image" src="${t1Icon}"><span class="information-text">${t1Score}:${t2Score}</span><img class="team-select-image" src="${t2Icon}">`
        if(t2Score > t1Score){
            scoreString = `<img class="team-select-image" src="${t2Icon}"><span class="information-text">${t2Score}:${t1Score}</span><img class="team-select-image" src="${t1Icon}">`
        }
        return `<div class="map-select-information-container">
                    <span class="map-text">${map.toUpperCase()}</span>
                    ${scoreString}
                </div>`
    }
    formatMapCurrentPanel(map, team_selected, t1Icon, t2Icon){
        let imageLink;
        if(team_selected != '') imageLink = (team_selected == 'team_1') ? t1Icon : t2Icon;
        return `<div class="map-select-information-container">
                    <span class="information-text">CURRENT:</span>
                    <span class="map-text">${map.toUpperCase()}</span>
                    ${team_selected == '' ? `` : `<img class="team-select-image" src="${imageLink}">`}
                </div>`;
    }
    formatMapUpcommingPanel(map, team_selected, t1Icon, t2Icon){
        let imageLink = team_selected == 'team_1' ? t1Icon : t2Icon;
        return `<div class="map-select-information-container">
                    <span class="information-text">NEXT:</span>
                    <span class="map-text">${map.toUpperCase()}</span>
                    <img class="team-select-image" src="${imageLink}">
                </div>`;
    }
    formatMapDeciderPanel(map){
        return `<div class="map-select-information-container">
                    <span class="information-text">DECIDER:</span>
                    <span class="map-text">${map.toUpperCase()}</span>
                </div>`;
    }
}

//Init New Interface
const mapList = new upcommingMapInterface();
mapList.init();