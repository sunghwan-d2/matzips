package com.ksh.matzips.mappers;

import com.ksh.matzips.entities.FavoriteEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FavoriteMapper {
    int deleteFavorite(@Param("userEmail") String userEmail,
                       @Param("placeIndex") int placeIndex);

    int insertFavorite(FavoriteEntity favorite);

    FavoriteEntity selectFavorite(@Param("userEmail") String userEmail,
                                  @Param("placeIndex") int placeIndex);

}
