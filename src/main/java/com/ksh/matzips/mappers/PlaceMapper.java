package com.ksh.matzips.mappers;

import com.ksh.matzips.dtos.PlaceDto;
import com.ksh.matzips.dtos.PlaceReviewDto;
import com.ksh.matzips.entities.PlaceEntity;
import com.ksh.matzips.entities.PlaceReviewEntity;
import com.ksh.matzips.entities.PlaceReviewImageEntity;
import com.ksh.matzips.entities.PlaceReviewLikeEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface PlaceMapper {

    int deletePlaceByIndex(@Param("index") int index);

    int deletePlaceReviewLike(@Param("placeReviewIndex") int placeReviewIndex,
                              @Param("userEmail") String userEmail);

    int insertPlace(PlaceEntity place);

    int insertPlaceReview(PlaceReviewEntity placeReview);

    int insertPlaceReviewImage(PlaceReviewImageEntity placeReviewImage);

    int insertPlaceReviewLike(PlaceReviewLikeEntity placeReviewLike);

    PlaceEntity selectPlaceByIndex(@Param("index") int index);

    PlaceDto selectPlaceDtoByIndex(@Param("index") int index);

    PlaceEntity selectPlaceByContact(@Param("contactFirst") String contactFirst,
                                     @Param("contactSecond") String contactSecond,
                                     @Param("contactThird") String contactThird);


    PlaceDto[] selectPlaceByCoords(@Param("minLat") double minLat,
                                   @Param("minLng") double minLng,
                                   @Param("maxLat") double maxLat,
                                   @Param("maxLng") double maxLng);

    PlaceReviewDto[] selectPlaceReviewsByPlaceIndex(@Param("userEmail") String userEmail
            , @Param("placeIndex") int placeIndex);


    PlaceReviewImageEntity selectPlaceReviewImageByIndex(@Param("index") int index);

    PlaceReviewImageEntity[] selectPlaceReviewImagesByPlaceReviewIndex(@Param("placeReviewIndex") int placeReviewIndex);

    PlaceReviewDto selectPlaceReviewByIndex(@Param("index") int index);

    PlaceReviewLikeEntity selectPlaceReviewLike(@Param("placeReviewIndex") int placeReviewIndex,
                                                @Param("userEmail") String userEmail);

    int updatePlace(PlaceEntity place);

    int updatePlaceReviewLike(PlaceReviewLikeEntity placeReviewLike);

}
