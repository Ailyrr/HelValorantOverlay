async function fetch_player_status_information(){

    var res = await fetch('../get_player_stats');
    var json = await res.json();
    if(json.status){
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
            if(json.team_1[`player_${i}`].is_registered == false){ //Check if player is being updated
                team_1_container.innerHTML += `<div class="player-stat-container"></div>`;
            } else if(json.team_1[`player_${i}`].health == 0 || json.team_1[`player_${i}`].is_dead == true){ //Check if player is dead
                team_1_container.innerHTML += `<div class="player-stat-container player-dead">
                    <div class="has-spike-indicator">
                        <img src="../visual_assets/game_icons/spike.webp" alt="">
                    </div>
                    <div class="player-status">
                        <img class="player-agent" src="../visual_assets/agent_icons/${json.team_1[`player_${i}`].agent}/${json.team_1[`player_${i}`].agent}_icon.webp" alt="">

                        <span class="player-credits">

                        </span>
                    </div>
                    <div class="player-health">
                        <div style="width: 0%;" class="player-health-bar"></div>
                    </div>
                    <div class="player-name">
                        <span class="player-name-container">${json.team_1[`player_${i}`].username}</span>
                        <div class="player-ult-point-container">

                        </div>
                        <span class="player-health-count">

                            <span class="player-health-count-number"></span>
                        </span>               
                    </div>
                </div>`;
            } else {
                let ult_points = ``
                for(let n = 0; n<json.team_1[`player_${i}`].ult_points_needed; n++){
                    ult_points += `<img class="player-ult-point ${json.team_1[`player_${i}`].ult_points_gained > n ? 'full-point' : ''}" src="../visual_assets/diamond-solid.svg">`;
                }
                let ult_ready = `
                    <div class="player-ult-indicator-container">
                        <img class="border" src="../visual_assets/ultimage-charged-border.svg">
                        <img class="ult-icon" src="../visual_assets/agent_icons/${json.team_1[`player_${i}`].agent}/ability_x.webp">
                    </div>`
                ult_points = (json.team_1[`player_${i}`].ult_points_needed == json.team_1[`player_${i}`].ult_points_gained) ? ult_ready : ult_points;
                team_1_container.innerHTML += `
                <div class="player-stat-container">
                <div class="has-spike-indicator ${json.team_1[`player_${i}`].has_spike ? 'has-spike' : ''}">
                    <img src="../visual_assets/game_icons/spike.webp" alt="">
                </div>
                <div class="player-status">
                    <img class="player-agent" src="../visual_assets/agent_icons/${json.team_1[`player_${i}`].agent}/${json.team_1[`player_${i}`].agent}_icon.webp" alt="">
                    <img class="player-ability ${json.team_1[`player_${i}`].c_util ? 'ability-available' : ''}" src="../visual_assets/agent_icons/${json.team_1[`player_${i}`].agent}/ability_c.webp">
                    <img class="player-ability ${json.team_1[`player_${i}`].q_util ? 'ability-available' : ''}" src="../visual_assets/agent_icons/${json.team_1[`player_${i}`].agent}/ability_q.webp">
                    <img class="player-ability ${json.team_1[`player_${i}`].e_util ? 'ability-available' : ''}" src="../visual_assets/agent_icons/${json.team_1[`player_${i}`].agent}/ability_e.webp">
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
                            ${json.team_1[`player_${i}`].shield == 0 ? 0 : (json.team_2[`player_${i}`].shield == 1 ? 25 : 50)}
                            </div>
                        </div>
                        <span class="player-health-count-number">${json.team_1[`player_${i}`].health}</span>
                    </span>               
                </div>
            </div>`
            }
            
        }
        for(let i = 0; i<5;i++){
            if(json.team_2[`player_${i}`].is_registered == false){ //Check if this player is being updated
                team_2_container.innerHTML += `<div class="player-stat-container"></div>`;
            } else if(json.team_2[`player_${i}`].health == 0 || json.team_2[`player_${i}`].is_dead == true){ // Check if player is dead to show dead 
                team_2_container.innerHTML += `<div class="player-stat-container player-dead">
                    <div class="has-spike-indicator">
                        <img src="../visual_assets/game_icons/spike.webp" alt="">
                    </div>
                    <div class="player-status">
                        <img class="player-agent" src="../visual_assets/agent_icons/${json.team_2[`player_${i}`].agent}/${json.team_2[`player_${i}`].agent}_icon.webp" alt="">

                        <span class="player-credits">

                        </span>
                    </div>
                    <div class="player-health">
                        <div style="width: 0%;" class="player-health-bar"></div>
                    </div>
                    <div class="player-name">
                        <span class="player-name-container">${json.team_2[`player_${i}`].username}</span>
                        <div class="player-ult-point-container">

                        </div>
                        <span class="player-health-count">

                            <span class="player-health-count-number"></span>
                        </span>               
                    </div>
                </div>`;
            } else {
                let ult_points = ``
                for(let n = 0; n<json.team_2[`player_${i}`].ult_points_needed; n++){
                    ult_points += `<img class="player-ult-point ${json.team_2[`player_${i}`].ult_points_gained > n ? 'full-point' : ''}" src="../visual_assets/diamond-solid.svg">`;
                }
                let ult_ready = `
                <div class="player-ult-indicator-container">
                    <img class="border" src="../visual_assets/ultimage-charged-border.svg">
                    <img class="ult-icon" src="../visual_assets/agent_icons/${json.team_2[`player_${i}`].agent}/ability_x.webp">
                </div>`
                ult_points = (json.team_2[`player_${i}`].ult_points_needed == json.team_2[`player_${i}`].ult_points_gained) ? ult_ready : ult_points;
                team_2_container.innerHTML += `
                <div class="player-stat-container">
                <div class="has-spike-indicator ${json.team_2[`player_${i}`].has_spike ? 'has-spike' : ''}">
                    <img src="../visual_assets/game_icons/spike.webp" alt="">
                </div>
                <div class="player-status">
                    <img class="player-agent" src="../visual_assets/agent_icons/${json.team_2[`player_${i}`].agent}/${json.team_2[`player_${i}`].agent}_icon.webp" alt="">
                    <img class="player-ability ${json.team_2[`player_${i}`].c_util ? 'ability-available' : ''}" src="../visual_assets/agent_icons/${json.team_2[`player_${i}`].agent}/ability_c.webp">
                    <img class="player-ability ${json.team_2[`player_${i}`].q_util ? 'ability-available' : ''}" src="../visual_assets/agent_icons/${json.team_2[`player_${i}`].agent}/ability_q.webp">
                    <img class="player-ability ${json.team_2[`player_${i}`].e_util ? 'ability-available' : ''}" src="../visual_assets/agent_icons/${json.team_2[`player_${i}`].agent}/ability_e.webp">
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
                            ${json.team_1[`player_${i}`].shield == 0 ? 0 : (json.team_2[`player_${i}`].shield == 1 ? 25 : 50)}
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
    setTimeout( async () => {
        fetch_player_status_information();
    }, 500)
}

fetch_player_status_information();
