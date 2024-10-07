

document.body.querySelectorAll('[rel="showLoginCaller"]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    showLogin();
}));

document.body.querySelectorAll('[rel="showRegisterCaller"]').forEach(el => el.addEventListener('click', e => {
    e.preventDefault();
    showRegister();
}));

document.body.querySelectorAll('[rel="showRecoverCaller"]').forEach(el => el.addEventListener('click', e =>{
    e.preventDefault();
    showRecover();
}));







