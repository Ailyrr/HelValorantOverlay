async function fetch_player_status_information(){

    var res = await fetch('../get_player_stats');
    var json = await res.json();
    if(json.status){
        console.log(json);
        //create divs and set their classes
        let team_1_container = document.createElement('div');
        team_1_container.classList.add('right-team');
        let team_2_container = document.createElement('div');
        team_2_container.classList.add('left-team');
        if(!json.switch_teams){
            team_1_container.classList.add('player-list-red-team');
            team_2_container.classList.add('player-list-green-team');
        } else {
            team_1_container.classList.add('player-list-green-team');
            team_2_container.classList.add('player-list-red-team');
        }
        for(let i = 0; i<5;i++){
            if(json.team_1[`player_${i}`].player_uuid == ''){
                team_1_container.innerHTML += `<div class="player-stat-container"></div>`;
            } else {
                let ult_points = ``
                for(let n = 0; n<json.team_1[`player_${i}`].ult_points_needed; n++){
                    ult_points += `<div class="player-ult-point ${json.team_1[`player_${i}`].ult_points_gained > n ? 'full-point' : ''}"></div>`
                }
                ult_points = (json.team_1[`player_${i}`].ult_points_needed == json.team_1[`player_${i}`].ult_points_gained) ? '<span><span style="color: #000; background-color: white; padding: 2px 10px; font-weight: 600;">Ult Ready</span></span>' : ult_points;
                team_1_container.innerHTML += `
                <div class="player-stat-container">
                <div class="has-spike-indicator ${json.team_1[`player_${i}`].has_spike ? 'has-spike' : ''}">
                    <img src="../visual_assets/game_icons/spike.webp" alt="">
                </div>
                <div class="player-status">
                    <img class="player-agent" src="../visual_assets/agent_icons/${json.team_1[`player_${i}`].agent}_icon.webp" alt="">
                    <img class="player-weapon" src="../visual_assets/game_icons/${json.team_1[`player_${i}`].weapon}.webp" alt="">
                    <span class="player-credits">
                        ${json.team_1[`player_${i}`].credits}
                        <img src="../visual_assets/game_icons/credits.webp" alt="">
                    </span>
                </div>
                <div class="player-health">
                    <div style="width: ${json.team_1[`player_${i}`].health}%;" class="player-health-bar"></div>
                </div>
                <div class="player-name">
                    <span class="player-name-container">${json.team_1[`player_${i}`].username}</span>
                    <div class="player-ult-point-container">
                        ${ult_points}
                    </div>
                    <span class="player-health-count">
                        <div class="player-shield-outline ${json.team_1[`player_${i}`].shield == 0 ? 'shield-down' : ''}">
                            <div class="player-shield-count">
                            ${json.team_1[`player_${i}`].shield}
                            </div>
                        </div>
                        <span class="player-health-count-number">${json.team_1[`player_${i}`].health}</span>
                    </span>               
                </div>
            </div>`
            }
            
        }
        for(let i = 0; i<5;i++){
            if(json.team_2[`player_${i}`].player_uuid == ''){
                team_1_container.innerHTML += `<div class="player-stat-container"></div>`;
            } else {
                let ult_points = ``
                for(let n = 0; n<json.team_2[`player_${i}`].ult_points_needed; n++){
                    ult_points += `<div class="player-ult-point ${json.team_2[`player_${i}`].ult_points_gained > n ? 'full-point' : ''}"></div>`
                }
                ult_points = (json.team_2[`player_${i}`].ult_points_needed == json.team_2[`player_${i}`].ult_points_gained) ? '<span style="color: #000; background-color: white; padding: 2px 10px; font-weight: 600;">Ult Ready</span>' : ult_points;
                team_2_container.innerHTML += `
                <div class="player-stat-container">
                <div class="has-spike-indicator ${json.team_2[`player_${i}`].has_spike ? 'has-spike' : ''}">
                    <img src="../visual_assets/game_icons/spike.webp" alt="">
                </div>
                <div class="player-status">
                    <img class="player-agent" src="../visual_assets/agent_icons/${json.team_2[`player_${i}`].agent}_icon.webp" alt="">
                    <img class="player-weapon" src="../visual_assets/game_icons/${json.team_2[`player_${i}`].weapon}.webp" alt="">
                    <span class="player-credits">
                        ${json.team_2[`player_${i}`].credits}
                        <img src="../visual_assets/game_icons/credits.webp" alt="">
                    </span>
                </div>
                <div class="player-health">
                    <div style="width: ${json.team_2[`player_${i}`].health}%;" class="player-health-bar"></div>
                </div>
                <div class="player-name">
                    <span class="player-name-container">${json.team_2[`player_${i}`].username}</span>
                    <div class="player-ult-point-container">
                        ${ult_points}
                    </div>
                    <span class="player-health-count">
                        <div class="player-shield-outline ${json.team_2[`player_${i}`].shield == 0 ? 'shield-down' : ''}">
                            <div class="player-shield-count">
                            ${json.team_2[`player_${i}`].shield}
                            </div>
                        </div>
                        <span class="player-health-count-number">${json.team_2[`player_${i}`].health}</span>
                    </span>               
                </div>
            </div>`
            }
        }
        document.body.innerHTML = ``
        document.body.appendChild(team_1_container);
        document.body.appendChild(team_2_container);
    } else {
        console.log('Error fetching data.')
    }
    setTimeout(() => {
        fetch_player_status_information();
    }, 1000)
}


fetch_player_status_information()


