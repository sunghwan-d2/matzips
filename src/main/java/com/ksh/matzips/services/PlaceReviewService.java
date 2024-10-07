package com.ksh.matzips.services;

import com.ksh.matzips.dtos.PlaceReviewDto;
import com.ksh.matzips.entities.PlaceReviewEntity;
import com.ksh.matzips.entities.PlaceReviewImageEntity;
import com.ksh.matzips.entities.PlaceReviewLikeEntity;
import com.ksh.matzips.entities.UserEntity;
import com.ksh.matzips.mappers.PlaceMapper;
import com.ksh.matzips.regexes.PlaceReviewRegex;
import com.ksh.matzips.regexes.UserRegex;
import com.ksh.matzips.results.CommonResult;
import com.ksh.matzips.results.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PlaceReviewService {
    private final PlaceMapper placeMapper;

    @Autowired
    public PlaceReviewService(PlaceMapper placeMapper) {
        this.placeMapper = placeMapper;
    }

    @Transactional
    public Result addReview(UserEntity user, PlaceReviewEntity placeReview, PlaceReviewImageEntity[] placeReviewImages) {
        if (user == null || !PlaceReviewRegex.content.tests(placeReview.getContent())) {
            return CommonResult.FAILURE;
        }

        placeReview.setUserEmail(user.getEmail());
        placeReview.setCreatedAt(LocalDateTime.now());
        placeReview.setModifiedAt(null);
        this.placeMapper.insertPlaceReview(placeReview); //placeReview insert 하기
        for (PlaceReviewImageEntity placeReviewImage : placeReviewImages) {
            placeReviewImage.setPlaceReviewIndex(placeReview.getIndex()); //usegeneratedkey 로 인덱스값 받아오기
            this.placeMapper.insertPlaceReviewImage(placeReviewImage);
        }
        return CommonResult.SUCCESS;

    }

    public PlaceReviewDto getReview(int index) {
        return this.placeMapper.selectPlaceReviewByIndex(index);
    }

    public PlaceReviewDto[] getReviews(UserEntity user, int placeIndex) {

        PlaceReviewDto[] placeReviews = this.placeMapper.selectPlaceReviewsByPlaceIndex(user == null ? "" : user.getEmail(), placeIndex);
        for (PlaceReviewDto placeReview : placeReviews) {
            PlaceReviewImageEntity[] placeReviewImages = this.placeMapper.selectPlaceReviewImagesByPlaceReviewIndex(placeReview.getIndex());
            int[] indexes = new int[placeReviewImages.length];
            for (int i = 0; i < placeReviewImages.length; i++) {
                indexes[i] = placeReviewImages[i].getIndex();
            }
            placeReview.setImageIndexes(indexes);
        }
        return placeReviews;
    }

    public PlaceReviewImageEntity getReviewImage(int index) {
        return this.placeMapper.selectPlaceReviewImageByIndex(index);
    }
    public Result alterReviewLike(UserEntity user, PlaceReviewLikeEntity reviewLike) {
        // 전달 받은 회원(user)의 전달 받은 리뷰에 대한 좋아요, 싫어요 혹은 중립 상태를 삽입/수정/삭제하는 메서드.
        if (user == null || !UserRegex.email.tests(user.getEmail())) {
            return CommonResult.FAILURE;
        }
        PlaceReviewLikeEntity dbReviewLike = this.placeMapper.selectPlaceReviewLike(reviewLike.getPlaceReviewIndex(), user.getEmail());
        reviewLike.setUserEmail(user.getEmail());
        if (dbReviewLike == null) {
            // reviewLike가 가지고 있는 기본키로 PlaceReviewLikeEntity를 다시 SELECT하였을 때 null이 반환된다는 것은 기존에 해당 회원이 해당 리뷰에 대한 아무런 의견을 가지지 않았음(중립)을 의미한다. 그럼으로, 이러한 경우에는 좋아요든 싫어요든 전달 받은 reviewLike를 새로 INSERT해주면 됨.
            // 리뷰에 대해서 사용자가 좋아요/싫어요를 한 적이 없다(취소를 했거나) : INSERT
            return this.placeMapper.insertPlaceReviewLike(reviewLike) > 0
                    ? CommonResult.SUCCESS
                    : CommonResult.FAILURE;
        }
        // 단, 위에서 SELECT한 PlaceReviewLikeEntity 객체가 null이 아닐 경우, 해당 회원은 기존에 해당 리뷰에 대한 의견을 가지고 있었다는 의미임으로(그것이 좋아요든 싫어요든)아래 절차를 따른다.
        if (reviewLike.isLiked() == dbReviewLike.isLiked()) { // true == true | false == false
            // - 기존에 좋아요였고, 새로운 데이터도 좋아요라면 : 좋아요를 취소하고 있는 상황임으로 DELETE 한다.
            // - 기존에 싫어요였고, 새로운 데이터도 싫어요라면 : 싫어요를 취소하고 있는 상황임으로 DELETE 한다.
            return this.placeMapper.deletePlaceReviewLike(reviewLike.getPlaceReviewIndex(), user.getEmail()) > 0
                    ? CommonResult.SUCCESS
                    : CommonResult.FAILURE;
        }
        // - 기존에 좋아요였고, 새로운 데이터가 싫어요라면 : 좋아요에서 싫어요로 갈아타고 있는 상황임으로 UPDATE 한다.
        // - 기존에 싫어요였고, 새로운 데이터가 좋아요라면 : 싫어요에서 좋아요로 갈아타고 있는 상황임으로 UPDATE 한다.
        // - CommonResult.SUCCESS를 반환한다.
        return this.placeMapper.updatePlaceReviewLike(reviewLike) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }
    public Boolean isLiked(UserEntity user, int placeReviewIndex) {
        if (user == null || !UserRegex.email.tests(user.getEmail())) return null;
        PlaceReviewLikeEntity reviewLike = this.placeMapper.selectPlaceReviewLike(placeReviewIndex, user.getEmail());
        return reviewLike == null ? null : reviewLike.isLiked();
    }
}







