const placeAddAside = document.getElementById('placeAddAside');

placeAddAside.addressWrapper = placeAddAside.querySelector(':scope > .address_wrapper');
placeAddAside.form = placeAddAside.querySelector('.form');
placeAddAside.form.thumbnailLabel = new LabelObj(placeAddAside.querySelector('[rel="thumbnailLabel"]'));
placeAddAside.form.nameLabel = new LabelObj(placeAddAside.querySelector('[rel="nameLabel"]'));
placeAddAside.form.categoryLabel = new LabelObj(placeAddAside.querySelector('[rel="categoryLabel"]'));
placeAddAside.form.contactLabel = new LabelObj(placeAddAside.querySelector('[rel="contactLabel"]'));
placeAddAside.form.coordsLabel = new LabelObj(placeAddAside.querySelector('[rel="coordsLabel"]'));
placeAddAside.form.addressLabel = new LabelObj(placeAddAside.querySelector('[rel="addressLabel"]'));
placeAddAside.form.descriptionLabel = new LabelObj(placeAddAside.querySelector('[rel="descriptionLabel"]'));
placeAddAside.form.scheduleLabel = new LabelObj(placeAddAside.querySelector('[rel="scheduleLabel"]'));


placeAddAside.querySelector('[rel="closeButton"]').onclick = () => {
    placeAddAside.tempMarker?.setMap(null);         // 마커 사라짐.
    placeAddAside.hide();
    placeListAside.show();
};

placeAddAside.addressWrapper.onclick = e => {
    if (e.currentTarget === e.target) {
        placeAddAside.addressWrapper.hide();
    }
}

placeAddAside.form['thumbnail'].onchange = () => {
    const imageEl = placeAddAside.form.thumbnailLabel.element.querySelector('.image');
    const emptyEl = placeAddAside.form.thumbnailLabel.element.querySelector('.empty');
    if (placeAddAside.form['thumbnail'].files.length === 0) {
        imageEl.style.display = 'none';
        emptyEl.style.display = 'flex';
        return;
    }
    const fileReader = new FileReader();
    fileReader.onload = () => {
        imageEl.setAttribute('src', fileReader.result);
        imageEl.style.display = 'block';
        emptyEl.style.display = 'none';
    };
    fileReader.readAsDataURL(placeAddAside.form['thumbnail'].files[0]);
}

placeAddAside.tempMarker = null;
placeAddAside.form['addressFind'].onclick = () => {
    placeAddAside.addressWrapper.show();
    new daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: function (data) {

            placeAddAside.form['addressPostal'].value = data['zonecode'];
            placeAddAside.form['addressPrimary'].value = data['address'];
            placeAddAside.form['addressSecondary'].focus();
            placeAddAside.addressWrapper.hide();

            const geocoder = new kakao.maps.services.Geocoder();// 주소- 좌표 변환계
            geocoder.addressSearch(data['address'], function (result, status) {
                if (status !== kakao.maps.services.Status.OK){
                    return;
                }
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                placeAddAside.form['latitude'].value = coords.getLat();
                placeAddAside.form['longitude'].value = coords.getLng();        // 위치 좌표 값 대입
                placeAddAside.tempMarker?.setMap(null);
                placeAddAside.tempMarker = new kakao.maps.Marker({
                    map:map.instance,
                    position: coords
                });         // 마커 생성
                map.instance.setCenter(coords);
            });
        }
    }).embed(placeAddAside.addressWrapper.querySelector(':scope > .dialog'));
};

// 1. addressWrapper 밑에 있는 dialog 선택
// 2. <1>에 다음 주소찾기 띄우기
// 3. <2>에서 주소 선택 시 placeAddAside.form['addressPostal'] 및 placeAddAside.form['addressPrimary'] 값 채우기
// 4. addressWrapper hide() 하기


placeAddAside.form.days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
placeAddAside.form.days.forEach(day => {
    const opCheckEl = placeAddAside.form[`${day}Op`];
    const openEl = placeAddAside.form[`${day}Open`];
    const closeEl = placeAddAside.form[`${day}Close`];
    opCheckEl.onchange = () => {
        if (opCheckEl.checked) {
            openEl.enable();
            closeEl.enable();
        } else {
            openEl.disable();
            closeEl.disable();
        }
    };
});

placeAddAside.form.onsubmit = e => {
    e.preventDefault();
    placeAddAside.form.thumbnailLabel.setValid(placeAddAside.form['thumbnail'].files.length > 0);
    placeAddAside.form.nameLabel.setValid(placeAddAside.form['name'].tests());
    placeAddAside.form.categoryLabel.setValid(placeAddAside.form['category'].value !== '-1');
    placeAddAside.form.contactLabel.setValid(
        placeAddAside.form['contactFirst'].tests() &&
        placeAddAside.form['contactSecond'].tests() &&
        placeAddAside.form['contactThird'].tests());
    placeAddAside.form.coordsLabel.setValid(
        placeAddAside.form['latitude'].value !== '' &&
        placeAddAside.form['longitude'].value !== '');
    placeAddAside.form.addressLabel.setValid(
        placeAddAside.form['addressPostal'].tests() &&
        placeAddAside.form['addressPrimary'].tests() &&
        placeAddAside.form['addressSecondary'].tests());
    placeAddAside.form.descriptionLabel.setValid(placeAddAside.form['description'].tests());
    if (placeAddAside.form.days.every(day => !placeAddAside.form[`${day}Op`].checked)) {
        DialogObj.createSimpleOk('경고', '일주일 중 하루 이상 영업 여부에 체크해 주세요.').show();
        return;
    }
    if (placeAddAside.form.days.filter(day => placeAddAside.form[`${day}Op`].checked && (placeAddAside.form[`${day}Open`].value === '' || placeAddAside.form[`${day}Close`].value === '')).length > 0) {
        DialogObj.createSimpleOk('경고', '영업 일정을 확인해 주세요. 영업하는 날의 오픈, 마감 시간이 비어있지 않은지 확인해 주세요.').show();
        return;
    }
    if (!placeAddAside.form.thumbnailLabel.isValid() ||
        !placeAddAside.form.nameLabel.isValid() ||
        !placeAddAside.form.categoryLabel.isValid() ||
        !placeAddAside.form.contactLabel.isValid() ||
        !placeAddAside.form.coordsLabel.isValid() ||
        !placeAddAside.form.addressLabel.isValid() ||
        !placeAddAside.form.descriptionLabel.isValid()) {
        return;
    }
    const schedule = {};
    placeAddAside.form.days.forEach(day => {
        const dayObj = {};
        dayObj['op'] = placeAddAside.form[`${day}Op`].checked;
        if (dayObj['op'] === true) {
            dayObj['open'] = placeAddAside.form[`${day}Open`].value;
            dayObj['close'] = placeAddAside.form[`${day}Close`].value;
        }
        schedule[day] = dayObj;
    });
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('_thumbnail', placeAddAside.form['thumbnail'].files[0]);
    formData.append('name', placeAddAside.form['name'].value);
    formData.append('placeCategoryCode', placeAddAside.form['category'].value);
    formData.append('contactFirst', placeAddAside.form['contactFirst'].value);
    formData.append('contactSecond', placeAddAside.form['contactSecond'].value);
    formData.append('contactThird', placeAddAside.form['contactThird'].value);
    formData.append('latitude', placeAddAside.form['latitude'].value);
    formData.append('longitude', placeAddAside.form['longitude'].value);
    formData.append('addressPostal', placeAddAside.form['addressPostal'].value);
    formData.append('addressPrimary', placeAddAside.form['addressPrimary'].value);
    formData.append('addressSecondary', placeAddAside.form['addressSecondary'].value);
    formData.append('description', placeAddAside.form['description'].value);
    formData.append('schedule', JSON.stringify(schedule));
    xhr.onreadystatechange = function () {
        if(xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            DialogObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '알 수 없는 이유로 맛집을 등록하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
            failure_duplicate_contact: ['경고', '이미 등록된 연락처입니다. 다시 확인해 주세요.', () => placeAddAside.form['contactFirst'].focus()],
            success: ['알림', '맛집을 성공적으로 등록하였습니다.', () => {
                placeAddAside.tempMarker?.setMap(null);
                placeAddAside.hide();
                placeListAside.show();
            }]
        }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open('POST',`./place/`); //placeController : postIndex
    xhr.send(formData);
};




