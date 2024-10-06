async function fetch_data(route){
    const map_picks_query = await fetch(route);
    const map_picks_json = await map_picks_query.json();
    if(map_picks_json){
        console.log(map_picks_json)
        return map_picks_json
    } else {
        return false
    }
}
class mapPickInterface {
    constructor(json) {
        this.amount_of_maps = json.picks.length; //fixed to a maximum of 7 maps as in VCT (changing this may required changes to the code)
        this.teams = json.teams;
        this.picks = json.picks;
    }
    //Creates the empty map pick cards with none of the picks shown
    createBasicLayout() {
        let return_html_string = document.createElement('div');
        return_html_string.classList.add('map-pick-container');
        for(let i=0; i<this.amount_of_maps;i++){
            if(i == this.amount_of_maps - 1){
                return_html_string.innerHTML += `<div class="map-pick-card card-no-${i}" style="animation-delay: ${100 + i*100}ms;">
                    <div class="map-pick-side">
                        DECIDER
                    </div>
                    <div class="map-pick-image">

                    </div>
                </div>`
            } else {
                if(this.picks[i][1] == "ban"){
                    return_html_string.innerHTML += `
                    <div class="map-pick-card card-no-${i}" style="animation-delay: ${100 + i*100}ms;">
                        <div class="map-pick-side">
                            ${this.teams[i%2]} VETO MAP
                        </div>
                        <div class="map-pick-image">
        
                        </div>
                    </div>`    
                } else {
                    return_html_string.innerHTML += `
                    <div class="map-pick-card card-no-${i}" style="animation-delay: ${100 + i*100}ms;">
                        <div class="map-pick-side">
                            ${this.teams[i%2]} MAP PICK
                        </div>
                        <div class="map-pick-image">
        
                        </div>
                    </div>`  
                }
            }
        }
        return return_html_string;
    }
    //allows the user to show the picked map at each step individually.
    showMapAtIndex(index){
        if(index > this.amount_of_maps){
            return false;
        }
        const target_card = document.getElementsByClassName(`card-no-${index}`)[0].getElementsByClassName('map-pick-image')[0];
        let map_image_div = document.createElement('div');
        map_image_div.classList.add('map-image', `map-${this.picks[index][0]}`);
        let map_image_cover = document.createElement('div');
        map_image_cover.classList.add('map-image-cover');
        map_image_div.appendChild(map_image_cover);
        target_card.appendChild(map_image_div);
        return true
    }
    //allows the user to show the selected action (ban / attack pick / defense pick) at each step individually.
    showMapActionAtIndex(index){
        if(index > this.amount_of_maps){
            return false;
        }
        const target_card = document.getElementsByClassName(`card-no-${index}`)[0].getElementsByClassName('map-pick-image')[0];
        let map_action_card = document.createElement('div');
        if(this.picks[index][1] == 'ban'){
            map_action_card.classList.add('map-banned-card');
            let icon = document.createElement('i');
            icon.classList.add('fa-solid', 'fa-xmark', 'fa-4x');
            map_action_card.appendChild(icon);
            target_card.appendChild(map_action_card);
            return true
        } else {
            map_action_card.classList.add('map-picked-by-side');
            let cover = document.createElement('div');
            cover.classList.add('map-picked-by-side-cover');
            let text = document.createElement('span');
            text.innerText = `${this.teams[index >= 6 ? index%2 : (index + 1)%2]} PICKS ${(this.picks[index][1] == 'attack') ? "ATTACK" : "DEFENSE"}`
            map_action_card.appendChild(cover);
            map_action_card.appendChild(text);
            target_card.appendChild(map_action_card);
            return true
        }
    }
    updateTile(index){
        if(index > this.amount_of_maps){
            return false;
        }
        this.showMapAtIndex(index)
        setTimeout(() => {
            this.showMapActionAtIndex(index);
            return true
        }, 700)
    }
    startAutoUpdateAtIndex(index){
        if(index < this.amount_of_maps){
            this.updateTile(index)
            setTimeout(() => {
                this.startAutoUpdateAtIndex(index + 1);
            }, 1550)
        } else {
            return 0
        }
    }
    hideCards(){
        for(let i = 0; i<this.amount_of_maps; i++){
            let target = document.getElementsByClassName(`card-no-${i}`)[0];
            target.classList.add(`animation-delay-${i * 100}`, 'slide-down-animation');
        }
    }
}
/*
Create server fetching to gather data from server
*/

async function init() {
    const map_picks_json = await fetch_data('../get_map_picks');
    const interface = new mapPickInterface(map_picks_json);

    const adding_div = document.getElementById('map-pick-adding-div');
    adding_div.appendChild(interface.createBasicLayout());
    setTimeout(() => {
        interface.startAutoUpdateAtIndex(0);
    }, 3000);
}

init()