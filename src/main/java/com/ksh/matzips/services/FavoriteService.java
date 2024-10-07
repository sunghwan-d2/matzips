package com.ksh.matzips.services;


import com.ksh.matzips.entities.FavoriteEntity;
import com.ksh.matzips.entities.UserEntity;
import com.ksh.matzips.mappers.FavoriteMapper;
import com.ksh.matzips.results.CommonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FavoriteService {
    private final FavoriteMapper favoriteMapper;

    @Autowired
    public FavoriteService(FavoriteMapper favoriteMapper) {
        this.favoriteMapper = favoriteMapper;
    }

    public FavoriteEntity getFavorite(UserEntity user, int placeIndex) {
        return this.favoriteMapper.selectFavorite(user.getEmail(), placeIndex);
        // 전달 받은 user 와 placeIndex로 FavoriteEntity를 들려주는 간단한 메서드
        // 얘가 필요한건 js에 responseObject['saved'] 때문이다. (사용자가 최종적으로 얘를 저장했는가의 여부 확인)
    }

    public CommonResult toggleFavorite(FavoriteEntity favorite) {
        int affectedRows = 0;
        if (this.favoriteMapper.selectFavorite(favorite.getUserEmail(), favorite.getPlaceIndex()) == null) {
            affectedRows = this.favoriteMapper.insertFavorite(favorite);
        } else {
            affectedRows = this.favoriteMapper.deleteFavorite(favorite.getUserEmail(),favorite.getPlaceIndex());
        }
        return affectedRows > 0 ? CommonResult.SUCCESS : CommonResult.FAILURE;
        //전달 받은 favorite이 가진 유저 이메일 및 맛집 인덱스로 FavoriteEntity SELECT 시 , 있으면 DELETE 하고 , 없으면 INSERT 하는 간단한 메서드를 작성.
        // 해당 행위 결과 영향을 받은 레코드가 0보다 크면 SUCCESS, 아니면 FAILURE
    }
}
