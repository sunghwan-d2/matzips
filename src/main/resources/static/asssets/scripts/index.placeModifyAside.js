
const placeModifyAside = document.getElementById('placeModifyAside');

placeModifyAside.addressWrapper = placeModifyAside.querySelector(':scope > .address-wrapper');
placeModifyAside.form = placeModifyAside.querySelector('.form');
placeModifyAside.form.thumbnailLabel = new LabelObj(placeModifyAside.querySelector('[rel="thumbnailLabel"]'));
placeModifyAside.form.nameLabel = new LabelObj(placeModifyAside.querySelector('[rel="nameLabel"]'));
placeModifyAside.form.categoryLabel = new LabelObj(placeModifyAside.querySelector('[rel="categoryLabel"]'));
placeModifyAside.form.contactLabel = new LabelObj(placeModifyAside.querySelector('[rel="contactLabel"]'));
placeModifyAside.form.coordsLabel = new LabelObj(placeModifyAside.querySelector('[rel="coordsLabel"]'));
placeModifyAside.form.addressLabel = new LabelObj(placeModifyAside.querySelector('[rel="addressLabel"]'));
placeModifyAside.form.descriptionLabel = new LabelObj(placeModifyAside.querySelector('[rel="descriptionLabel"]'));
placeModifyAside.form.scheduleLabel = new LabelObj(placeModifyAside.querySelector('[rel="scheduleLabel"]'));
placeModifyAside.form.days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];


placeModifyAside.form['thumbnail'].onchange = () => {
    const imageEl = placeModifyAside.form.thumbnailLabel.element.querySelector('.image');
    const emptyEl = placeModifyAside.form.thumbnailLabel.element.querySelector('.empty');
    if (placeModifyAside.form['thumbnail'].files.length === 0) {
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
    fileReader.readAsDataURL(placeModifyAside.form['thumbnail'].files[0]);
}
function showPlaceModify(placeObject, onclose) {
    placeListAside.hide();
    placeAddAside.hide();
    placeModifyAside.show();
    placeModifyAside.querySelectorAll('[rel="closeButton"]').forEach(closeButton => closeButton.onclick = () => onclose());
    placeModifyAside.form.thumbnailLabel.element.querySelector('.empty').style.display = 'none';
    placeModifyAside.form.thumbnailLabel.element.querySelector('.image').style.display = 'block';
    placeModifyAside.form.thumbnailLabel.element.querySelector('.image').src = `./place/thumbnail?index=${placeObject['index']}`;
    placeModifyAside.form['index'].value = placeObject['index'];
    placeModifyAside.form['name'].value = placeObject['name'];
    placeModifyAside.form['category'].value = placeObject['placeCategoryCode'];
    placeModifyAside.form['contactFirst'].value = placeObject['contactFirst'];
    placeModifyAside.form['contactSecond'].value = placeObject['contactSecond'];
    placeModifyAside.form['contactThird'].value = placeObject['contactThird'];
    placeModifyAside.form['latitude'].value = placeObject['latitude'];
    placeModifyAside.form['longitude'].value = placeObject['longitude'];
    placeModifyAside.form['addressPostal'].value = placeObject['addressPostal'];
    placeModifyAside.form['addressPrimary'].value = placeObject['addressPrimary'];
    placeModifyAside.form['addressSecondary'].value = placeObject['addressSecondary'];
    placeModifyAside.form['description'].value = placeObject['description'];
    const scheduleObject = JSON.parse(placeObject['schedule']);
    placeModifyAside.form.days.forEach(day => {
        placeModifyAside.form[`${day}Op`].checked = scheduleObject[day]['op'];
        if (scheduleObject[day]['op']) {
            placeModifyAside.form[`${day}Open`].enable().value = scheduleObject[day]['open'];
            placeModifyAside.form[`${day}Close`].enable().value = scheduleObject[day]['close'];
        } else {
            placeModifyAside.form[`${day}Open`].disable().value = '';
            placeModifyAside.form[`${day}Close`].disable().value = '';
        }
    });
}

placeModifyAside.form.days.forEach(day => {
    const opCheckEl = placeModifyAside.form[`${day}Op`];
    const openEl = placeModifyAside.form[`${day}Open`];
    const closeEl = placeModifyAside.form[`${day}Close`];
    opCheckEl.onchange = () => {
        if (opCheckEl.checked) {
            openEl.enable();
            closeEl.enable();
        } else {
            openEl.disable().value = '';
            closeEl.disable().value = '';
        }
    };
});

placeModifyAside.addressWrapper.onclick = e => {
    if (e.currentTarget === e.target) {
        placeModifyAside.addressWrapper.hide();
    }
};

placeModifyAside.tempMarker = null;
placeModifyAside.form['addressFind'].onclick = () => {
    placeModifyAside.addressWrapper.show();
    new daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: (data) => {
            placeModifyAside.form['addressPostal'].value = data['zonecode'];
            placeModifyAside.form['addressPrimary'].value = data['address'];
            placeModifyAside.form['addressSecondary'].focus();
            placeModifyAside.form['addressSecondary'].select();
            placeModifyAside.addressWrapper.hide();

            const geocoder = new kakao.maps.services.Geocoder(); // 주소-좌표 변환계
            geocoder.addressSearch(data['address'], function (result, status) {
                if (status !== kakao.maps.services.Status.OK) {
                    return;
                }
                const coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                placeModifyAside.form['latitude'].value = coords.getLat();
                placeModifyAside.form['longitude'].value = coords.getLng();
                placeModifyAside.tempMarker?.setMap(null); // 지도에서 (기존의) 마커를 지워주는 역활.
                placeModifyAside.tempMarker = new kakao.maps.Marker({
                    map: map.instance,
                    position: coords
                });
                map.instance.setCenter(coords);
                map.instance.setLevel(2);
            });
        }
    }).embed(placeModifyAside.addressWrapper.querySelector(':scope > .dialog'));
};

placeModifyAside.form.onsubmit = e => {
    e.preventDefault();
    placeModifyAside.form.nameLabel.setValid(placeModifyAside.form['name'].tests());
    placeModifyAside.form.categoryLabel.setValid(placeModifyAside.form['category'].value !== '-1');
    placeModifyAside.form.contactLabel.setValid(
        placeModifyAside.form['contactFirst'].tests() &&
        placeModifyAside.form['contactSecond'].tests() &&
        placeModifyAside.form['contactThird'].tests());
    placeModifyAside.form.addressLabel.setValid(
        placeModifyAside.form['addressPostal'].tests() &&
        placeModifyAside.form['addressPrimary'].tests() &&
        placeModifyAside.form['addressSecondary'].tests());
    placeModifyAside.form.descriptionLabel.setValid(placeModifyAside.form['description'].tests());
    if (placeModifyAside.form.days.every(day => !placeModifyAside.form[`${day}Op`].checked)) {
        DialogObj.createSimpleOk('경고', '일주일 중 하루 이상 영업 여부에 체크해 주세요.').show();
        return;
    }
    if (placeModifyAside.form.days.filter(day => placeModifyAside.form[`${day}Op`].checked && (placeModifyAside.form[`${day}Open`].value === '' || placeModifyAside.form[`${day}Close`].value === '')).length > 0) {
        DialogObj.createSimpleOk('경고', '영업 일정을 확인해 주세요. 영업하는 날의 오픈, 마감 시간이 비어있지 않은지 확인해 주세요.').show();
        return;
    }
    if (!placeModifyAside.form.nameLabel.isValid() ||
        !placeModifyAside.form.categoryLabel.isValid() ||
        !placeModifyAside.form.contactLabel.isValid() ||
        !placeModifyAside.form.coordsLabel.isValid() ||
        !placeModifyAside.form.addressLabel.isValid() ||
        !placeModifyAside.form.descriptionLabel.isValid()) {
        return;
    }
    const schedule = {};
    placeModifyAside.form.days.forEach(day => {
        const dayObj = {};
        dayObj['op'] = placeModifyAside.form[`${day}Op`].checked;
        if (dayObj['op'] === true) {
            dayObj['open'] = placeModifyAside.form[`${day}Open`].value;
            dayObj['close'] = placeModifyAside.form[`${day}Close`].value;
        }
        schedule[day] = dayObj;
    });
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    if (placeModifyAside.form['thumbnail'].files.length > 0) {
        formData.append('_thumbnail', placeModifyAside.form['thumbnail'].files[0]);
    }
    formData.append('index', placeModifyAside.form['index'].value);
    formData.append('name', placeModifyAside.form['name'].value);
    formData.append('placeCategoryCode', placeModifyAside.form['category'].value);
    formData.append('contactFirst', placeModifyAside.form['contactFirst'].value);
    formData.append('contactSecond', placeModifyAside.form['contactSecond'].value);
    formData.append('contactThird', placeModifyAside.form['contactThird'].value);
    formData.append('latitude', placeModifyAside.form['latitude'].value);
    formData.append('longitude', placeModifyAside.form['longitude'].value);
    formData.append('addressPostal', placeModifyAside.form['addressPostal'].value);
    formData.append('addressPrimary', placeModifyAside.form['addressPrimary'].value);
    formData.append('addressSecondary', placeModifyAside.form['addressSecondary'].value);
    formData.append('description', placeModifyAside.form['description'].value);
    formData.append('schedule', JSON.stringify(schedule));
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            DialogObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '알 수 없는 이유로 맛집을 등록하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
            failure_duplicate_contact: ['경고', '이미 등록된 연락처입니다. 다시 확인해 주세요.', () => placeModifyAside.form['contactFirst'].focus()],
            success: ['알림', '맛집을 성공적으로 수정하였습니다.', () => {
                placeModifyAside.tempMarker?.setMap(null);
                placeModifyAside.hide();
                placeModifyAside.show();
                loadPlaces();
            }]
        }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open('PATCH', './place/'); // PlaceController : postIndex
    xhr.send(formData);
};
