package com.ksh.matzips.dtos;

import com.ksh.matzips.entities.PlaceEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
public class PlaceDto extends PlaceEntity {
    public static final String[] days = {"mon", "tue", "wed", "thu", "fri", "sat", "sun"};

    private String day = days[LocalDateTime.now().getDayOfWeek().getValue() - 1];
    private String category;
    private boolean isMine; // 로그인을 했고, 로그인한 사람과 해당 맛집 객체의 작성자가 같다면 true
    private boolean isSigned; // 로그인을 했는가?
    private boolean isSaved; // 저장 여부(로그인 안 했다면 무조건 false)
    private double rating; // 평균 평점
    private int reviewCount; // 리뷰 개수
}
