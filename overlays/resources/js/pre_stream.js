const map_selectors = document.getElementsByClassName('map-pick-map-selector');
const action_selectors = document.getElementsByClassName('map-pick-action-selector');

for(let i = 0; i<map_selectors.length; i++){
    map_selectors[i].addEventListener('change', (e) => {
        console.log(e.target.value);
        console.log(action_selectors[[...map_selectors].indexOf(e.target)].value)
        updateMapPick(e.target.value, action_selectors[[...map_selectors].indexOf(e.target)].value)
    })
}
for(let i = 0; i<action_selectors.length; i++){
    action_selectors[i].addEventListener('change', (e) => {
        console.log(e.target.value);
        console.log(map_selectors[[...action_selectors].indexOf(e.target)].value)
        updateMapPick(map_selectors[[...action_selectors].indexOf(e.target)].value, e.target.value)
    })
}
async function updateMapPick(map, action) {
    successAlertLowerBottom('Updated Map Pick')
}