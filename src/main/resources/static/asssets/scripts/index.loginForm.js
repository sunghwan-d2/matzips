const loginForm = document.getElementById('loginForm');

const showLogin = () => {
    registerForm.hide();
    recoverDialog.hide();
    loginForm['email'].value = '';
    loginForm['email'].focus();
    loginForm['password'].value = '';
    loginForm.show();
    cover.show(() => {
        loginForm.hide();
        cover.hide();
    });
};

loginForm.emailLabelObj = new LabelObj(loginForm.querySelector('[rel="emailLabel"]'));
loginForm.passwordLabelObj = new LabelObj(loginForm.querySelector('[rel="passwordLabel"]'));

loginForm.onsubmit = (e) => {
    e.preventDefault();
    loginForm.emailLabelObj.setValid(loginForm['email'].tests());
    loginForm.passwordLabelObj.setValid(loginForm['password'].tests());
    if (!loginForm.emailLabelObj.isValid() || !loginForm.passwordLabelObj.isValid()) return;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', loginForm['email'].value);
    formData.append('password', loginForm['password'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            DialogObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        if (responseObject.result === 'success') {
            location.reload();
            return;
        }
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '이메일 혹은 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.', () => loginForm['email'].focus()],
            failure_suspended: ['경고', '해당 계정은 현재 일시적으로 이용이 중지된 상태입니다.']
        }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open('POST', './user/login');
    xhr.send(formData);
    loading.show();
    // loginForm 양식 요소가 가지고 있는 email 값과 password 값에 대해 정규화 한다.
    // 정규화에 문제가 없었을 경우 loginForm 양식 요소가 가지고 있는 email 값과 password 값을 [GET] ./user/ 주소로 전송한다.
    // 로그인 결과 명세 :
    // [CommonResult] failure : 이메일 혹은 비밀번호가 틀려서 실패(혹은 탈퇴)
    // [CommonResult] success : 로그인 성공
    // [LoginResult] failure_suspended : 이용이 중지 중인 계정이라 실패. 관련된 Dialog 띄우기

    // <백>
    // 로그인 성공시 HttpSession 객체에 "user"라는 이름으로 로그인 한 사용자의 정보를 모두 담고 있는 UserEntity 객체 추가.(로그인 기억)
    // 로그인 시 요청과 함께 넘어온 (평균) 비밀번호와 DB에 저장되어 있는 암호화된 비밀번호는 아래 메서드로 비교한다
    // BCrypt.checkpw(평문, 암호문) : boolean


};