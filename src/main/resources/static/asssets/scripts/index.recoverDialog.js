const recoverDialog=document.getElementById('recoverDialog');

const showRecover = () => {
    loginForm.hide();
    recoverDialog.emailRecoverForm['nickname'].value='';
    recoverDialog.passwordRecoverForm['emailSalt'].value='';
    recoverDialog.passwordRecoverForm['email'].enable().value='';
    recoverDialog.passwordRecoverForm['email'].enable();
    recoverDialog.passwordRecoverForm['emailSend'].enable();
    recoverDialog.passwordRecoverForm['emailCode'].disable().value='';
    recoverDialog.passwordRecoverForm['emailVerify'].disable();
    recoverDialog.passwordRecoverForm['password'].disable().value='';
    recoverDialog.passwordRecoverForm['passwordCheck'].disable().value='';
    recoverDialog.querySelector('[name="recoverType"][value="email"]').checked = true;
    recoverDialog.show();
    cover.show(() => {
        recoverDialog.hide();
        cover.hide();
    });
};

    recoverDialog.emailRecoverForm = recoverDialog.querySelector('[rel="emailRecoverForm"]');
    recoverDialog.emailRecoverForm.nicknameLabel = new LabelObj(recoverDialog.emailRecoverForm.querySelector('[rel="nicknameLabel"]'));
    recoverDialog.passwordRecoverForm = recoverDialog.querySelector('[rel="passwordRecoverForm"]');
    recoverDialog.passwordRecoverForm.emailLabel = new LabelObj(recoverDialog.passwordRecoverForm.querySelector('[rel="emailLabel"]'));
    recoverDialog.passwordRecoverForm.passwordLabel = new LabelObj(recoverDialog.passwordRecoverForm.querySelector('[rel="passwordLabel"]'));

recoverDialog.querySelector('[rel="cancelButton"]').addEventListener('click',() => showLogin());

recoverDialog.emailRecoverForm.onsubmit = (e) => {
    e.preventDefault();
    recoverDialog.emailRecoverForm.nicknameLabel.setValid(recoverDialog.emailRecoverForm['nickname'].tests());
    if (!recoverDialog.emailRecoverForm.nicknameLabel.isValid()){
        return;
    }
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE){
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            DialogObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '해당 닉네임을 회원 정보를 찾을 수 없습니다. 다시 확인해 주세요.', () => loginForm['email'].focus()],
            success: ['알림', `해당 닉네임으로 찾은 회원의 이메일은 <b>${responseObject['email']}</b>입니다. 확인을 클릭하면 로그인 페이지로 돌아갑니다.`, () => showLogin()]
        }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }

    xhr.open('GET', `./user/email?nickname=${recoverDialog.emailRecoverForm['nickname'].value}`); // UserController : getEmail
    xhr.send();
    loading.show();
};

recoverDialog.passwordRecoverForm['emailSend'].onclick = () => {
    recoverDialog.passwordRecoverForm.emailLabel.setValid(recoverDialog.passwordRecoverForm['email'].tests());
    if (!recoverDialog.passwordRecoverForm.emailLabel.isValid()){
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email',recoverDialog.passwordRecoverForm['email'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE){
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            DialogObj.createSimpleOk('오류','요청을 전송하는 도중 오류가 발생하였습니다.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '입력하신 이메일을 사용하는 회원을 찾지 못하였습니다.', () => recoverDialog.passwordRecoverForm['email'].focus()],
            success: ['알림', '입력하신 이메일로 인증번호를 전송하였습니다. 인증번호는 5분간만 유효하니 유의해 주세요.',() => {
                recoverDialog.passwordRecoverForm['emailSalt'].value= responseObject.salt;
                recoverDialog.passwordRecoverForm['email'].disable();
                recoverDialog.passwordRecoverForm['emailSend'].disable();
                recoverDialog.passwordRecoverForm['emailCode'].enable();
                recoverDialog.passwordRecoverForm['emailCode'].focus();
                recoverDialog.passwordRecoverForm['emailVerify'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }

    xhr.open('POST', './user/recoverPasswordEmail');
    xhr.send(formData);
    loading.show();

};

recoverDialog.passwordRecoverForm['emailVerify'].onclick = () => {
    recoverDialog.passwordRecoverForm.emailLabel.setValid(recoverDialog.passwordRecoverForm['emailCode'].tests());
    if (!recoverDialog.passwordRecoverForm.emailLabel.isValid()){
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email',recoverDialog.passwordRecoverForm['email'].value);
    formData.append('code',recoverDialog.passwordRecoverForm['emailCode'].value);
    formData.append('salt',recoverDialog.passwordRecoverForm['emailSalt'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE){
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            DialogObj.createSimpleOk('오류','요청을 전송하는 도중 오류가 발생하였습니다.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '인증번호가 올바르지 않습니다. 다시 확인해 주세요.', () => recoverDialog.passwordRecoverForm['emailCode'].focus()],
            failure_expired:['경고','인증 정보가 만료되었습니다. 다시 시도해 주세요.',() => {
                recoverDialog.passwordRecoverForm['emailSalt'].value='';
                recoverDialog.passwordRecoverForm['email'].enable().focus();
                recoverDialog.passwordRecoverForm['emailSend'].enable();
                recoverDialog.passwordRecoverForm['emailCode'].disable().value='';
                recoverDialog.passwordRecoverForm['emailVerify'].disable();
            }],
            success: ['알림', '입력하신 이메일 인증이 성공적으로 완료되었습니다. 새로운 비밀번호를 입력해 주세요.',() => {
                recoverDialog.passwordRecoverForm['emailCode'].disable();
                recoverDialog.passwordRecoverForm['emailVerify'].disable();
                recoverDialog.passwordRecoverForm['password'].enable().focus();
                recoverDialog.passwordRecoverForm['passwordCheck'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open('PATCH', './user/recoverPasswordEmail');
    xhr.send(formData);

};

recoverDialog.passwordRecoverForm.onsubmit = (e) =>{
    e.preventDefault();
    recoverDialog.passwordRecoverForm.passwordLabel.setValid(recoverDialog.passwordRecoverForm['password'].value);
    if (recoverDialog.passwordRecoverForm['emailSend'].isEnabled() || recoverDialog.passwordRecoverForm['emailVerify'].isEnabled()){
        DialogObj.createSimpleOk('경고','이메일 인증을 완료해 주세요.').show();
        return;
    }
    if (recoverDialog.passwordRecoverForm['passwordCheck'].value === ''){
        DialogObj.createSimpleOk('경고','비밀번호를 한 번 더 입력해 주세요.',()=>recoverDialog.passwordRecoverForm['passwordCheck'].focus()).show();
        return;
    }
    if (recoverDialog.passwordRecoverForm['password'].value !== recoverDialog.passwordRecoverForm['passwordCheck'].value){
        DialogObj.createSimpleOk('경고','재입력한 비밀번호가 일치하지 않습니다.',()=>recoverDialog.passwordRecoverForm['passwordCheck'].focus()).show();
        return;
    }
    if (!recoverDialog.passwordRecoverForm.passwordLabel.isValid()){
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email',recoverDialog.passwordRecoverForm['email'].value);
    formData.append('code',recoverDialog.passwordRecoverForm['emailCode'].value);
    formData.append('salt',recoverDialog.passwordRecoverForm['emailSalt'].value);
    formData.append('password',recoverDialog.passwordRecoverForm['password'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE){
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            DialogObj.createSimpleOk('오류','요청을 전송하는 도중 오류가 발생하였습니다.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] ={
            failure: ['경고', '알 수 없는 이유로 비밀번호 변경에 실패하였습니다. 잠시 후 다시 시도해 주세요.'],
            success: ['알림', '비밀번호가 변경되었습니다. 확인 버튼을 클릭하면 로그인 화면으로 이동합니다.' ,()=>showLogin()]
        }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open('POST', './user/recoverPassword');
    xhr.send(formData);
    loading.show();
};


