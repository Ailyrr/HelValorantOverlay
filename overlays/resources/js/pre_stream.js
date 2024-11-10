class adminPreStreamInterface{
    constructor(){
        this.mapPicksDiv = document.getElementById('map-pick-holder');
        this.mapSelectors;
        this.actionSelectors;
        this.seriesPreviewMapPicks = false;
    }
    //Map Pick Logic
    async updateMapPick(map, action, index){
        let data = new FormData();
        data.append('index', index);
        data.append('map', map);
        data.append('action', action);

        const res = await fetch('../set_map_picks', {
            method: 'POST',
            body: data
        });
        if(res.status === 200){
            successAlertLowerBottom('Updated map pick')
        } else {
            errorAlertLowerBottom('Failed to contact server')
        }
    }
    async constructMapPickInterface(){
        const res = await fetch('../get_map_picks');
        const json = await res.json();
        if(res.status === 200){
            for(let i = 0; i < json.picks.length; i++){
                this.mapPicksDiv.innerHTML += `
                <div class="map-pick-update-container">
                    <span>${i+1}</span>
                    <label for="map">Map</label>
                    <select class="map-pick-map-selector" name="map">
                        <option ${json.picks[i][0] == 'abyss' ? 'selected' : ''} value="abyss">Abyss</option>
                        <option ${json.picks[i][0] == 'ascent' ? 'selected' : ''} value="ascent">Ascent</option>
                        <option ${json.picks[i][0] == 'bind' ? 'selected' : ''} value="bind">Bind</option>
                        <option ${json.picks[i][0] == 'breeze' ? 'selected' : ''} value="breeze">Breeze</option>
                        <option ${json.picks[i][0] == 'fracture' ? 'selected' : ''} value="fracture">Fracture</option>
                        <option ${json.picks[i][0] == 'haven' ? 'selected' : ''} value="haven">Haven</option>
                        <option ${json.picks[i][0] == 'icebox' ? 'selected' : ''} value="icebox">Icebox</option>
                        <option ${json.picks[i][0] == 'lotus' ? 'selected' : ''} value="lotus">Lotus</option>
                        <option ${json.picks[i][0] == 'pearl' ? 'selected' : ''} value="pearl">Pearl</option>
                        <option ${json.picks[i][0] == 'split' ? 'selected' : ''} value="split">Split</option>
                        <option ${json.picks[i][0] == 'sunset' ? 'selected' : ''} value="sunset">Sunset</option>
                    </select>
                    <label for="action">Map Action</label>
                    <select class="map-pick-action-selector">
                        <option ${json.picks[i][1] == 'ban' ? 'selected' : ''} value="ban">Ban</option>
                        <option ${json.picks[i][1] == 'attack' ? 'selected' : ''} value="attack">Attack</option>
                        <option ${json.picks[i][1] == 'defense' ? 'selected' : ''} value="defense">Defense</option>
                    </select>
                </div>`;
            }
            this.mapPicksDiv.innerHTML = '<h4>Set Map Picks</h4>' + this.mapPicksDiv.innerHTML + '<span style="color: darkgray;">Change json file to add more maps</span>';
    
            //Now that the selectors are created get them all
            this.mapSelectors = document.getElementsByClassName('map-pick-map-selector');
            this.actionSelectors = document.getElementsByClassName('map-pick-action-selector');
            for(let i = 0; i<this.mapSelectors.length; i++){
                this.mapSelectors[i].addEventListener('change', (e) => {
                    
                    this.updateMapPick(
                        e.target.value,
                        this.actionSelectors[[...this.mapSelectors].indexOf(e.target)].value,
                        [...this.mapSelectors].indexOf(e.target)
                    )
                })
            }
            for(let i = 0; i<this.actionSelectors.length; i++){
                this.actionSelectors[i].addEventListener('change', (e) => {
    
                    this.updateMapPick(
                        this.mapSelectors[[...actionSelectors].indexOf(e.target)].value,
                        e.target.value,
                        [...actionSelectors].indexOf(e.target)
                    )
                })
            }
        }
    }
}

const adminPanelLogic = new adminPreStreamInterface();
adminPanelLogic.constructMapPickInterface();