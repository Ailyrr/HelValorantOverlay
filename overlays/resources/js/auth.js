const pw_input = document.getElementById('pw-input') || false;
const pw_btn = document.getElementById('pw-submit') || false;
const logout_btn = document.getElementById('logout-btn') || false;

if(pw_btn){
    pw_btn.addEventListener('click', async (e) => {
        e.preventDefault();
        let DATA = new FormData();
        DATA.append('pw', pw_input.value);
        console.log(pw_input.value)

        const DATA_PACKET = {
            method: 'POST',
            body: DATA
        };
        //Start Upload
        const res = await fetch('../authenticate', DATA_PACKET);
        const json = await res.json();
        console.log(json)
        if(res.status === 200){
            successAlertLowerBottom(json.message);
            setTimeout(() =>{
                location.href = '../admin';
            }, 1000)
        } else {
            errorAlertLowerBottom(json.message)
        }
    })
}
if(logout_btn){
    logout_btn.addEventListener('click', async (e) => {
        try {
            const res = await fetch('../deauthenticate', { method: 'POST' });
            const json = await res.json();
            console.log(json.message);

            if (res.status === 200) {
                // Optionally redirect to a login page or homepage
                window.location.href = '../auth';
            }
        } catch (err) {
            console.error('Error during logout', err);
        }
    })
}