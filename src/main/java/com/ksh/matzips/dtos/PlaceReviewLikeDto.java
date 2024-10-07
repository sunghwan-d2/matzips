package com.ksh.matzips.dtos;

import com.ksh.matzips.entities.PlaceReviewEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlaceReviewLikeDto extends PlaceReviewEntity {
    private int afterLikeCount;
    private int afterDislikeCount;
}
