package com.ksh.matzips.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Builder
@Data
@EqualsAndHashCode(of = "index")
@AllArgsConstructor
public class PlaceEntity {
    private int index;
    private String name;
    private String placeCategoryCode;
    private byte[] thumbnail;
    private String thumbnailContentType;
    private String contactFirst;
    private String contactSecond;
    private String contactThird;
    @Builder.Default
    private double latitude=0D;
    @Builder.Default
    private double longitude= 0D;
    private String addressPostal;
    private String addressPrimary;
    private String addressSecondary;
    private String description;
    private String schedule;
    private String userEmail;
    private LocalDateTime createdAt;

    public PlaceEntity() {
        this.latitude = 0D;
        this.longitude = 0D;
    }
}
