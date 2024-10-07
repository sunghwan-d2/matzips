function deletePlace(index){
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('index', index);
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
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '알 수 없는 이유로 맛집을 삭제하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],
            success: ['알림', '맛집을 성공적으로 삭제하였습니다.', () => {
                loadPlaces();
            }]
        }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }

    xhr.open('DELETE', './place/'); //PlaceController.deleteIndex
    xhr.send(formData);
    loading.show();
}