const map_selectors = document.getElementsByClassName('map-pick-map-selector');
const action_selectors = document.getElementsByClassName('map-pick-action-selector');


async function constructMapPickInterface(){
    const res = await fetch('../get_map_picks');
    const json = await res.json();
    if(res.status === 200){
        const adding_div = document.getElementById('map-pick-holder') || false;
        for(let i = 0; i < json.picks.length; i++){
            adding_div.innerHTML += `
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
        adding_div.innerHTML = '<h4>Set Map Picks</h4>' + adding_div.innerHTML + '<span style="color: darkgray;">Change json file to add more maps</span>';

        for(let i = 0; i<map_selectors.length; i++){
            map_selectors[i].addEventListener('change', (e) => {
                
                updateMapPick(
                    e.target.value,
                    action_selectors[[...map_selectors].indexOf(e.target)].value,
                    [...map_selectors].indexOf(e.target)
                )
            })
        }
        for(let i = 0; i<action_selectors.length; i++){
            action_selectors[i].addEventListener('change', (e) => {

                updateMapPick(
                    map_selectors[[...action_selectors].indexOf(e.target)].value,
                    e.target.value,
                    [...action_selectors].indexOf(e.target)
                )
            })
        }
    }
}

async function updateMapPick(map, action, index) {
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

constructMapPickInterface()