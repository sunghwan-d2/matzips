package com.ksh.matzips.entities;

import lombok.*;

@Getter
@Setter
@EqualsAndHashCode(of = {"placeReviewIndex","userEmail"})
@AllArgsConstructor
@NoArgsConstructor
public class PlaceReviewLikeEntity {
    private int placeReviewIndex;
    private String userEmail;
    private boolean isLiked;
}
