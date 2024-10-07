package com.ksh.matzips.dtos;

import com.ksh.matzips.entities.PlaceReviewEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PlaceReviewDto extends PlaceReviewEntity {
    private String userNickname;
    private int totalReviewCount;
    private int totalImageCount;
    private int likeCount;
    private int dislikeCount;
    private int[] imageIndexes;
    private Boolean isLiked; // null || true || false
    private Boolean isUserLiked; // null (로그인 안 했거나, 좋지도 싫지도 않음) | true (좋아함) | false (싫어함) : 현재 로그인한 사용자가 좋아요를 했는가의 여부
}
