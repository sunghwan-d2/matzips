package com.ksh.matzips.services;

import com.ksh.matzips.dtos.PlaceDto;
import com.ksh.matzips.entities.PlaceEntity;
import com.ksh.matzips.entities.UserEntity;
import com.ksh.matzips.mappers.PlaceMapper;
import com.ksh.matzips.regexes.PlaceRegex;
import com.ksh.matzips.results.CommonResult;
import com.ksh.matzips.results.Result;
import com.ksh.matzips.results.place.AddPlaceResult;
import com.ksh.matzips.results.place.ModifyPlaceResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PlaceService {
    private final PlaceMapper placeMapper;

    @Autowired
    public PlaceService(PlaceMapper placeMapper) {
        this.placeMapper = placeMapper;
    }

    public Result addPlace(UserEntity user, PlaceEntity place) {
        if (place == null ||
                !PlaceRegex.name.tests(place.getName()) ||
                !PlaceRegex.contactFirst.tests(place.getContactFirst()) ||
                !PlaceRegex.contactSecond.tests(place.getContactSecond()) ||
                !PlaceRegex.contactThird.tests(place.getContactThird()) ||
                !PlaceRegex.addressPostal.tests(place.getAddressPostal()) ||
                !PlaceRegex.addressPrimary.tests(place.getAddressPrimary()) ||
                !PlaceRegex.addressSecondary.tests(place.getAddressSecondary()) ||
                !PlaceRegex.description.tests(place.getDescription())) {
            return CommonResult.FAILURE;
        }
        if (this.placeMapper.selectPlaceByContact(
                place.getContactFirst(),
                place.getContactSecond(),
                place.getContactThird()) != null) {
            return AddPlaceResult.FAILURE_DUPLICATE_CONTACT;
        }
        place.setUserEmail(user.getEmail());
        place.setCreatedAt(LocalDateTime.now());
        return this.placeMapper.insertPlace(place) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    public Result deletePlace(UserEntity user, int index) {
        if (user == null || index < 1) {
            return CommonResult.FAILURE;
        }
        PlaceEntity dbPlace = this.placeMapper.selectPlaceByIndex(index);
        if (dbPlace == null || (!user.isAdmin() && !dbPlace.getUserEmail().equals(user.getEmail()))) {
            // 로그인한 사람이 관리자도 아니고 작성자가 로그인한 사람이 아니라면
            return CommonResult.FAILURE;
        }
        return this.placeMapper.deletePlaceByIndex(index) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    public Result modifyPlace(UserEntity user, PlaceEntity place) {
        if (place == null ||
                !PlaceRegex.name.tests(place.getName()) ||
                !PlaceRegex.contactFirst.tests(place.getContactFirst()) ||
                !PlaceRegex.contactSecond.tests(place.getContactSecond()) ||
                !PlaceRegex.contactThird.tests(place.getContactThird()) ||
                !PlaceRegex.addressPostal.tests(place.getAddressPostal()) ||
                !PlaceRegex.addressPrimary.tests(place.getAddressPrimary()) ||
                !PlaceRegex.addressSecondary.tests(place.getAddressSecondary()) ||
                !PlaceRegex.description.tests(place.getDescription())) {
            return CommonResult.FAILURE;
        }
        PlaceEntity dbPlace = this.placeMapper.selectPlaceByIndex(place.getIndex());
        if (dbPlace == null) {
            return CommonResult.FAILURE;
        }
        if (!user.isAdmin() && !dbPlace.getUserEmail().equals(user.getEmail())) {
            return CommonResult.FAILURE;
        }
        PlaceEntity dbPlaceByContact = this.placeMapper.selectPlaceByContact(
                place.getContactFirst(),
                place.getContactSecond(),
                place.getContactThird());
        if (dbPlaceByContact != null && dbPlace.getIndex() != dbPlaceByContact.getIndex()) {
            return ModifyPlaceResult.FAILURE_DUPLICATE_CONTACT;
        }
        if (place.getThumbnail() == null) {
            place.setThumbnail(dbPlace.getThumbnail());
            place.setThumbnailContentType(dbPlace.getThumbnailContentType());
        }
        place.setUserEmail(dbPlace.getUserEmail());
        place.setCreatedAt(dbPlace.getCreatedAt());
        return this.placeMapper.updatePlace(place) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    public PlaceEntity getPlace(int index) {
        return this.placeMapper.selectPlaceByIndex(index);
    }

    public PlaceDto getPlaceDto(int index) {
        if (index < 1) return null;
        return this.placeMapper.selectPlaceDtoByIndex(index);
    }

    public PlaceDto[] getPlacesByCoords(double minLat, double minLng, double maxLat, double maxLng) {
        return this.placeMapper.selectPlaceByCoords(minLat, minLng, maxLat, maxLng);

    }
}
