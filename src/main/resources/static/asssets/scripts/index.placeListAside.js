// const placeListAside = document.getElementById('placeListAside');
//
// function loadPlaces() {
//     const bounds = map.instance.getBounds();
//     const swLatLng = bounds.getSouthWest(); // 남서쪽 좌표 정보
//     const neLatLng = bounds.getNorthEast(); // 북동쪽 좌표 정보
//     console.log(`남서 위경도 : ${swLatLng.getLat()} / ${swLatLng.getLng()}`); // 작은거
//     console.log(`북동 위경도 : ${neLatLng.getLat()} / ${neLatLng.getLng()}`); // 큰거
//
//     const xhr = new XMLHttpRequest();
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState !== XMLHttpRequest.DONE) {
//             return;
//         }
//         if (xhr.status < 200 || xhr.status >= 300) {
//             return;
//         }
//         const responseArray = JSON.parse(xhr.responseText);
//         const listEl = placeListAside.querySelector(':scope > .list');
//         listEl.innerHTML = '';
//         if (responseArray.length === 0) {
//             const emptyItemEl = new DOMParser().parseFromString(`
//                 <li class="item empty">현재 위치에서 표시할 맛집이 없어요.<br><br>위치를 옮기거나 나만의 맛집을 등록해 보세요.</li>`, 'text/html').querySelector('li');
//             listEl.append(emptyItemEl);
//             return;
//         }
//         // 현재 위치에서 표시할 맛집이 한 개 이상
//         for (const placeObject of responseArray) {
//             const itemEl = new DOMParser().parseFromString(`
//                 <li class="item">
//                     <img alt="" class="image" src="./place/thumbnail?index=${placeObject['index']}">
//                     <div class="spec">
//                         <span class="name-wrapper">
//                             <span class="name">${placeObject['name']}</span>
//                             <span class="category">${placeObject['placeCategoryCode']}</span>
//                         </span>
//                         <span class="address">${placeObject['addressPrimary']}</span>
//                             <span class="misc">
//                             <span class="time">여기 영업 시간 (선택)</span>
//                             <span class="review">
//                                 <span class="text">리뷰</span>
//                                 <span class="count">0</span> <!-- 리뷰는 노터치 -->
//                             </span>
//                         </span>
//                         <span class="button-container">
//                             <button class="button" name="modify" type="button">수정</button>
//                             <button class="button" name="delete" type="button">삭제</button>
//                             <button class="button" name="report" type="button">신고</button>
//                         </span>
//                     </div>
//                 </li>`, 'text/html').querySelector('li');
//             listEl.append(itemEl);
//         }
//     }
//     xhr.open('GET', `./place/byCoords?minLat=${swLatLng.getLat()}&minLng=${swLatLng.getLng()}&maxLat=${neLatLng.getLat()}&maxLng=${neLatLng.getLng()}`);
//     xhr.send();
// }
//
// placeListAside.querySelector('[rel="placeAddButton"]').onclick = () => {
//     placeListAside.hide();
//     placeAddAside.form.reset();
//     placeAddAside.form.thumbnailLabel.element.querySelector('.image').style.display = 'none';
//     placeAddAside.form.thumbnailLabel.element.querySelector('.empty').style.display = 'flex';
//     placeAddAside.form.days.forEach(day => {
//         placeAddAside.form[`${day}Open`].enable();
//         placeAddAside.form[`${day}Close`].enable();
//     });
//     placeAddAside.scrollTo(0, 0);
//     placeAddAside.show();
// };

const placeListAside = document.getElementById('placeListAside');

function loadPlaces() {
    const bounds = map.instance.getBounds();
    const swLatLng = bounds.getSouthWest();
    const neLatLng = bounds.getNorthEast();
    // console.log(`남서 위경도 : ${swLatLng.getLat()} / ${swLatLng.getLng()}`);
    // console.log(`북동 위경도 : ${neLatLng.getLat()} / ${neLatLng.getLng()}`);

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {

            return;
        }
        const responseArray = JSON.parse(xhr.responseText);
        const listEl = placeListAside.querySelector(':scope > .list');
        listEl.innerHTML = '';
        if (responseArray.length === 0) {
            const emptyItemEl = new DOMParser().parseFromString(`
            <li class="item empty">현재 위치에서 표시할 맛집이 없어요.<br><br>위치를 옮기거나 나만의 맛집을 등록해 보세요.</li>`, 'text/html').querySelector('li'); // 현재 위치에서 표시할 맛집이 없음
            listEl.append(emptyItemEl);
            return;
        }
        // 현재 위치에서 표시할 맛집이 한 개 이상
        for (const placeObject of responseArray) {
            const marker = new kakao.maps.Marker({
                map: map.instance,
                position: new kakao.maps.LatLng(placeObject['latitude'],placeObject['longitude'])
            });

            const scheduleObject = JSON.parse(placeObject['schedule']);
            const day = placeObject['day']; // 'mon', 'tue' ..
            const op = scheduleObject[day]['op']; //true | false
            const open = scheduleObject[day]['open']; //00:00 | undefined
            const close = scheduleObject[day]['close']; //00:00 | undefined
            const mine = placeObject['mine'];
            const signed = placeObject['signed'];
            const itemEl = new DOMParser().parseFromString(`
            <li class="item">
            <img alt="" class="image" src="./place/thumbnail?index=${placeObject['index']}&rnd=${Math.random()}">
            <div class="spec">
                <span class="name-wrapper">
                    <span class="name">${placeObject['name']}</span>
                    <span class="category">${placeObject['category']}</span>
                </span>
                <span class="address">${placeObject['addressPrimary']}</span>
                <span class="misc">
                    <span class="time">${op ? `영업일 (${open}~ ${close})` : '휴무일'} </span>
                    <span class="review">
                        <span class="text">${placeObject['reviewCount']}</span>
                        <span class="count">0</span>
                    </span>
                </span>
                <span class="button-container">
                    ${mine === true ? '<button class="button" name="modify" type="button">수정</button>' : ''}
                    ${mine === true ? '<button class="button" name="delete" type="button">삭제</button>' : ''}
                    <button class="button" name="report" type="button">신고</button>
                </span>
            </div>
        </li>`, "text/html").querySelector('li');
            itemEl.onclick = (e) => {
                if (e.target.classList.contains('button')){
                    return;
                }
                map.instance.setCenter(new kakao.maps.LatLng(placeObject['latitude'],placeObject['longitude']));
                map.instance.setLevel(2);
                showPlaceDetailAside(placeObject['index']);
            };
            if (mine === true) {
                const modifyButton = itemEl.querySelector('[name="modify"]');
                modifyButton.onclick = () => {
                    showPlaceModify(placeObject, () => {
                        placeModifyAside.hide();
                        placeListAside.show();
                    });
                }
                const deleteButton = itemEl.querySelector('[name="delete"]');
                deleteButton.onclick = () => {
                    new DialogObj({
                        title: '삭제',
                        content: '정말로 선택한 맛집을 삭제할까요? 삭제하신 맛집은 복원이 어렵습니다.',
                        button:[
                            DialogObj.createButton('취소', (instance) => instance.hide()),
                            DialogObj.createButton('삭제', (instance) => {
                                instance.hide();
                                deletePlace(placeObject['index']);
                            })
                        ]
                    }).show();
                };
            }
            const reportButton = itemEl.querySelector('[name="report"]');
            reportButton.onclick = () => {
                if (!signed) {
                    DialogObj.createSimpleOk('경고', '로그인 후 사용할 수 있는 기능입니다.').show();
                    return;
                }
                if (mine) {
                    DialogObj.createSimpleOk('경고', '본인이 등록한 맛집은 신고할 수 없습니다.').show();
                    return;
                }
                alert('신고 ~~')
            };
            listEl.append(itemEl);
        }
    }


    xhr.open('GET', `./place/byCoords?minLat=${swLatLng.getLat()}&minLng=${swLatLng.getLng()}&maxLat=${neLatLng.getLat()}&maxLng=${neLatLng.getLng()}`);
    xhr.send();
}

placeListAside.querySelector('[rel= "placeAddButton"]').onclick = () => {
    placeListAside.hide();
    placeAddAside.form.reset();
    placeAddAside.form.thumbnailLabel.element.querySelector('.image').style.display = 'none';
    placeAddAside.form.thumbnailLabel.element.querySelector('.empty').style.display = 'flex';
    placeAddAside.form.days.forEach(day => {
        placeAddAside.form[`${day}Open`].enable();
        placeAddAside.form[`${day}Close`].enable();
    });
    placeAddAside.scrollTo(0, 0);
    placeAddAside.show();

};