function errorAlertLowerBottom(message){
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert-lower-bottom', 'error-alert', 'horizontal-flex', 'gap-10');
    alertDiv.innerHTML = `
    <i class="fa-solid fa-circle-exclamation"></i>
    <span>${message}</span>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        const target = document.querySelector('.alert-lower-bottom');
        target.classList.add('alert-lower-bottom-fade-out');
        setTimeout(() => {
            const target = document.querySelector('.alert-lower-bottom');
            target.parentNode.removeChild(target);
        }, 300)
    }, 4000)
}
function successAlertLowerBottom(message){
    const alertDiv = document.createElement('div');
    alertDiv.classList.add('alert-lower-bottom', 'success-alert', 'horizontal-flex', 'gap-10');
    alertDiv.innerHTML = `
    <i class="fa-solid fa-circle-check"></i>
    <span>${message}</span>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        const target = document.querySelector('.alert-lower-bottom');
        target.classList.add('alert-lower-bottom-fade-out');
        setTimeout(() => {
            const target = document.querySelector('.alert-lower-bottom');
            target.parentNode.removeChild(target);
        }, 300)
    }, 4000)
}