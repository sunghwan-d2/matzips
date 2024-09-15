package com.ksh.matzips.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Builder
@Data
@AllArgsConstructor
public class PlaceReviewImageEntity {
    @Builder.Default
    private int index = 0;
    @Builder.Default
    private int placeReviewIndex = 0;
    private byte[] data;
    private String name;
    private String contentType;

    public PlaceReviewImageEntity() {
        this.index = 0;
        this.placeReviewIndex = 0;
    }
}
