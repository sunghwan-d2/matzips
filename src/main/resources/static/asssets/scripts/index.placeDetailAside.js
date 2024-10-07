const placeDetailAside = document.getElementById('placeDetailAside');

function showPlaceDetailAside(index) {
    loadReviews(index);

    const thumbnailImage = placeDetailAside.querySelector('[rel="thumbnailImage"]');
    thumbnailImage.src = `./place/thumbnail?index=${index}`;

    const nameText = placeDetailAside.querySelector('[rel="nameText"]'); // 맛집 이름
    const categoryText = placeDetailAside.querySelector('[rel="categoryText"]'); // 구분(한식..)
    const ratingText = placeDetailAside.querySelector('[rel="ratingText"]');// 별점
    const reviewCountText = placeDetailAside.querySelector('[rel="reviewCountText"]'); // 리뷰개수
    const addressText = placeDetailAside.querySelector('[rel="addressText"]'); // 주소
    const scheduleText = placeDetailAside.querySelector('[rel="scheduleText"]'); // 영업( 휴무일 | 영업일)
    const contactText = placeDetailAside.querySelector('[rel="contactText"]'); // 연락처 앵커태그
    const descriptionText = placeDetailAside.querySelector('[rel="descriptionText"]'); // 설명
    const saveButton = placeDetailAside.querySelector('[rel="saveButton"]');
    // 로그인 안 했을때는 alert('저장 기능 구현하기'); 실행하고 로그인 안 했을 때에는 로그인해달라는 DialogObj 띄우기
    const modifyButton = placeDetailAside.querySelector('[rel="modifyButton"]');
    // 로그인 했고 작성자와 로그인한 사람이 동일하거나 관리자일 때 보여주기
    const deleteButton = placeDetailAside.querySelector('[rel="deleteButton"]');
    // 로그인 했고 작성자와 로그인한 사람이 동일하거나 관리자일 때 보여주기
    const reportButton = placeDetailAside.querySelector('[rel="reportButton"]');
    // 로그인 했을 때는 alert('신고 기능 구현하기'); 실행하고 로그인 안 했을 때에는 로그인 해달라는 DialogObj 띄우기


    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            DialogObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다.').show();
            return;
        }
        const placeObject = JSON.parse(xhr.responseText);
        const scheduleObject = JSON.parse(placeObject['schedule']);
        const day = placeObject['day']; // 'mon', 'tue' ..
        const op = scheduleObject[day]['op']; //true | false
        const open = scheduleObject[day]['open']; //00:00 | undefined
        const close = scheduleObject[day]['close']; //00:00 | undefined
        nameText.innerText = placeObject['name'];
        categoryText.innerText = placeObject['category'];
        ratingText.innerText = placeObject['rating'];
        reviewCountText.innerText = placeObject['reviewCount'];
        addressText.innerText = `${placeObject['addressPrimary']} ${placeObject['addressSecondary']}`;
        scheduleText.innerText = op === true ? `영업일 (${open} ~ ${close})` : '휴무일';
        contactText.href = `tel:${placeObject['contactFirst']}-${placeObject['contactSecond']}-${placeObject['contactThird']}`;
        contactText.innerText = `${placeObject['contactFirst']}-${placeObject['contactSecond']}-${placeObject['contactThird']}`;
        descriptionText.innerText = placeObject['description'];
        if (placeObject['saved'] === true) {
            saveButton.classList.add('saved');
        } else {
            saveButton.classList.remove('saved');
        }
        saveButton.onclick = () => {
            if (placeObject['signed'] !== true) {
                DialogObj.createSimpleOk('경고', '로그인 후 이용할 수 있는 기능입니다.').show();
                return;
            }
            const xhr = new XMLHttpRequest();
            const formData = new FormData();
            formData.append('placeIndex', placeObject['index']);
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== XMLHttpRequest.DONE) {
                    return;
                }
                if (xhr.status < 200 || xhr.status >= 300) {
                    DialogObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하셨습니다.')
                    return;
                }
                const responseObject = JSON.parse(xhr.responseText);
                if (responseObject.result === 'success') {
                    if (responseObject['saved'] === true) {
                        saveButton.classList.add('saved');
                        saveButton.style.color = 'green';

                    } else {
                        saveButton.classList.remove('saved');
                    }
                }
            }

            xhr.open('POST', './favorite/'); // FavoriteController.postIndex
            xhr.send(formData);
        }
        modifyButton.onclick = () => {
            if (placeObject['signed'] !== true) {
                DialogObj.createSimpleOk('경고', '로그인 후 이용할 수 있는 기능입니다.').show();
                return;
            }
            if (placeObject['mine'] !== true) {
                DialogObj.createSimpleOk('경고', '본인이 등록한 맛집만 수정할 수 있습니다.').show();
                return;
            }
            showPlaceModify(placeObject, () => {
                placeModifyAside.hide();
                placeDetailAside.show();
            });
            placeDetailAside.hide();
        };
        deleteButton.onclick = () => {
            if (placeObject['signed'] !== true) {
                DialogObj.createSimpleOk('경고', '로그인 후 이용할 수 있는 기능입니다.').show();
                return;
            }
            if (placeObject['mine'] !== true) {
                DialogObj.createSimpleOk('경고', '본인이 등록한 맛집만 삭제할 수 있습니다.').show();
                return;
            }
            new DialogObj({
                title: '삭제',
                content: '정말로 선택한 맛집을 삭제할까요? 삭제하신 맛집은 복원이 어렵습니다.',
                button: [
                    DialogObj.createButton('취소', (instance) => instance.hide()),
                    DialogObj.createButton('삭제', (instance) => {
                        instance.hide();
                        deletePlace(placeObject['index']);
                        placeDetailAside.hide();
                        placeListAside.show();
                    })
                ]
            }).show();
        };
        reportButton.onclick = () => {
            if (placeObject['signed'] !== true) {
                DialogObj.createSimpleOk('경고', '로그인 후 이용할 수 있는 기능입니다.').show();
                return;
            }
            if (placeObject['mine'] === true) {
                DialogObj.createSimpleOk('경고', '본인이 등록한 맛집을 신고할 수 없습니다.').show();
                return;
            }
            new DialogObj({
                title: '신고',
                content: '정말로 해당 맛집을 신고 할까요?',
                buttons: [
                    DialogObj.createButton('취소', (instance) => instance.hide()),
                    DialogObj.createButton('신고', (instance) => {
                        instance.hide();
                        const xhr = new XMLHttpRequest();
                        const formData = new FormData();
                        formData.append('placeIndex', placeObject['index']);
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState !== XMLHttpRequest.DONE) {
                                return;
                            }
                            if (xhr.status < 200 || xhr.status >= 300) {
                                DialogObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하셨습니다.').show();
                                return;
                            }
                            const responseObject = JSON.parse(xhr.responseText);
                            const [dTitle, dContent, dOnclick] = {
                                failure: ['경고', '알 수 없는 이유로 리뷰 신고에 실패 하였습니다. 잠시 후 다시 시도해 주세요.'],
                                failure_duplicate: ['경고', '이미 신고한 맛집 입니다. 관리자 확인 후 필요에 따라 적절한 조치가 이루어 질 예정이오니 기다려 주시기 바랍니다.'],
                                success: ['알림', '리뷰를 성공적으로 신고 하였습니다. 관리자 확인 후 필요에 따라 적절한 조치가 이루어 질 예정이며 결과에 대한 통보는 별도로 드리고 있지 않은점 양해바랍니다.']
                            }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요'];
                            DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
                        }
                        xhr.open('POST', './report/');
                        xhr.send(formData);
                        // loading.show();
                    })
                ]
            }).show();
        }

        placeListAside.hide();
        placeDetailAside.show();
    }

    xhr.open('GET', `./place/?index=${index}`);
    xhr.send();
    // loading.show();
    placeDetailAside.reviewForm['placeIndex'].value = index;
}

placeDetailAside.querySelector('[rel="closeButton"]').onclick = () => {
    placeDetailAside.hide();
    placeListAside.show();
}

placeDetailAside.reviewForm = placeDetailAside.querySelector(':scope > .review-form');
placeDetailAside.reviewForm.imageArray = [];

placeDetailAside.reviewForm['imageDeleteButton'].onclick = () => {
    const imageContainer = placeDetailAside.reviewForm.querySelector('[rel="imageContainer"]');
    const imageWrappers = Array.from(imageContainer.querySelectorAll(':scope > .image-wrapper'));
    if (imageWrappers.length === 0) {
        DialogObj.createSimpleOk('경고', '삭제할 이미지가 없습니다.').show();
        return;
    }
    if (imageWrappers.every(imageWrapper => !imageWrapper.querySelector(':scope > [type="checkbox"]').checked)) {
        DialogObj.createSimpleOk('경고', '삭제할 이미지를 선택해 주세요').show();
        return;
    }
    for (let i = 0; i < imageWrappers.length - 1; i--) {
        if (imageWrappers[i].querySelector(':scope > [type = "checkbox"]').checked) {
            placeDetailAside.reviewForm.imageArray.splice(i, 1);
            imageWrappers[i].remove();
        }
    }
};

placeDetailAside.reviewForm['imageClearButton'].onclick = () => {
    placeDetailAside.reviewForm.querySelector('[rel="imageContainer"]').innerHTML = '<span class="empty">첨부 이미지가 없습니다.</span>';
    placeDetailAside.reviewForm['images'].values = null;
    placeDetailAside.reviewForm.imageArray = [];
}

placeDetailAside.reviewForm['imageAddButton'].onclick = () => {
    placeDetailAside.reviewForm['images'].click();
};

placeDetailAside.reviewForm['images'].onchange = () => {
    if (placeDetailAside.reviewForm['images'].files.length === 0) {
        return;
    }
    const imageContainer = placeDetailAside.reviewForm.querySelector('[rel="imageContainer"]');
    for (const file of placeDetailAside.reviewForm['images'].files) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const imageWrapper = new DOMParser().parseFromString(`
            <label class="image-wrapper">
                    <input hidden type="checkbox">
                <img alt="" class="image" src="">
                </label>`, 'text/html').querySelector('.image-wrapper');
            imageWrapper.querySelector('.image').src = fileReader.result;
            imageContainer.append(imageWrapper);
        };
        fileReader.readAsDataURL(file);
        placeDetailAside.reviewForm.imageArray.push(file);
    }
    imageContainer.querySelector(':scope > .empty').style.display = 'none';
};


placeDetailAside.reviewForm.contentLabel = new LabelObj(placeDetailAside.reviewForm.querySelector(':scope > [rel="contentLabel"]'));
placeDetailAside.reviewForm.onsubmit = e => {
    e.preventDefault();
    placeDetailAside.reviewForm.contentLabel.setValid(placeDetailAside.reviewForm['content'].tests());
    if (!placeDetailAside.reviewForm.contentLabel.isValid()) {
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('placeIndex', placeDetailAside.reviewForm['placeIndex'].value);
    formData.append('rating', placeDetailAside.reviewForm['rating'].value);
    formData.append('content', placeDetailAside.reviewForm['content'].value);
    for (const image of placeDetailAside.reviewForm.imageArray) {
        formData.append('_images', image);
    }
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
            failure: ['경고', '알 수 없는 이유로 리뷰 작성에 실패하였습니다. 잠시 후 다시 시도해 주세요'],
            success: ['알림', '리뷰를 작성해 주셔서 감사합니다.', () => loadReviews()]
        }[responseObject.result] || ['경고', '서버가 예상치 못한 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        DialogObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }

    xhr.open('POST', './placeReview/'); //PlaceReviewController.postIndex
    xhr.send(formData);
    // loading.show();

};


const loadReviews = (placeIndex) => {
    const reviewsEl = placeDetailAside.querySelector(':scope > .reviews')
    reviewsEl.innerHTML = '';
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            return;
        }
        const reviewArray = JSON.parse(xhr.responseText);
        for (const reviewObject of reviewArray) {
            const reviewEl = new DOMParser().parseFromString(`
        <li class="item">
          <span class="user-wrapper">
              <span class="nickname" rel="nicknameText">${reviewObject['userNickname']}</span>
              <span class="summary">
                  <span class="rating-wrapper">
                        <span class="score">${'<i class="icon fa-solid fa-star"></i>'.repeat(reviewObject['rating'])}</span>
                        <span class="rest">${'<i class="icon fa-solid fa-star"></i>'.repeat(5 - reviewObject['rating'])}</span>
                  </span>
                  <span class="caption">리뷰</span>
                  <span class="value" rel="totalReviewCountText">${reviewObject['totalReviewCount']}</span>
                  <span class="caption">사진</span>
                  <span class="value" rel="totalImageCountText">${reviewObject['totalImageCount']}</span>
              </span>
          </span>
          <span class="image-container js-flickity" data-flickity='{ "cellAlign": "left", "contain": true, "pageDots": false, "wrapAround": true }'></span>
          <span class="content" rel="contentText">${reviewObject['content']}</span>
          <span class="datetime" rel="dateTimeText">${reviewObject['createdAt']}</span>
          <span class="like-container">
              <button class="button like" rel="likeButton">
                  <i class="icon fa-solid fa-caret-up"></i>
                  <span class="count">${reviewObject['likeCount']}</span>
              </button>
              <button class="button dislike" rel="dislikeButton">
                  <i class="icon fa-solid fa-caret-down"></i>
                  <span class="count">${reviewObject['dislikeCount']}</span>
              </button>
          </span>
        </li>`, 'text/html').querySelector('li.item');
            const likeButton = reviewEl.querySelector('[rel = "likeButton"]');
            const dislikeButton = reviewEl.querySelector('[rel="dislikeButton"]');
            [likeButton, dislikeButton].forEach(button => button.onclick = () => {
                const xhr = new XMLHttpRequest();
                const formData = new FormData();
                formData.append('placeReviewIndex', reviewObject['index']);
                formData.append('liked', button.classList.contains('like'));
                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== XMLHttpRequest.DONE) {
                        return;
                    }
                    if (xhr.status < 200 || xhr.status >= 300) {
                        DialogObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다.').show();
                        return;
                    }
                    const responseObject = JSON.parse(xhr.responseText);
                    if (responseObject.result === 'success') {
                        likeButton.classList.remove('selected');
                        dislikeButton.classList.remove('selected');
                        if (typeof responseObject['liked'] === 'boolean') {
                            (responseObject['liked'] === true ? likeButton : dislikeButton).classList.add('selected');
                        }
                    }
                }
                xhr.open('POST', './placeReview/like'); // PlaceReviewController.postLike
                xhr.send(formData);
            });


            const imageContainerEl = reviewEl.querySelector(':scope > .image-container');
            for (const imageIndex of reviewObject['imageIndexes']) {
                const imageEl = document.createElement('img');
                imageEl.setAttribute('alt', '');
                imageEl.setAttribute('class', 'image');
                imageEl.setAttribute('src', `./placeReview/image?index=${imageIndex}`);
                imageContainerEl.append(imageEl);
            }
            reviewsEl.append(reviewEl);
        }
        reviewsEl.querySelectorAll(':scope > .item > .image-container').forEach(imageContainer => {
            new Flickity(imageContainer, {
                cellAlign: 'left',
                contain: true,
                pageDots: false,
                wrapAround: true
            });
        });
    }
    xhr.open('GET', `./placeReview/?placeIndex=${placeIndex}`); // PlaceReviewController.getIndex
    xhr.send(formData);
}