package com.ksh.matzips.controllers;

import com.ksh.matzips.dtos.PlaceDto;
import com.ksh.matzips.entities.PlaceEntity;
import com.ksh.matzips.entities.UserEntity;
import com.ksh.matzips.results.CommonResult;
import com.ksh.matzips.results.Result;
import com.ksh.matzips.services.FavoriteService;
import com.ksh.matzips.services.PlaceService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@Controller
@RequestMapping("/place")
public class PlaceController {
    private final PlaceService placeService;
    private final FavoriteService favoriteService;

    @Autowired
    public PlaceController(PlaceService placeService, FavoriteService favoriteService) {
        this.placeService = placeService;
        this.favoriteService = favoriteService;
    }

    @RequestMapping(value = "/", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String PatchIndex(@SessionAttribute(value = "user") UserEntity user,
                             @RequestParam(value = "_thumbnail", required = false) MultipartFile thumbnail,
                             PlaceEntity place) throws IOException {
        if (thumbnail == null) {
            place.setThumbnail(null);
        } else {
            place.setThumbnail(thumbnail.getBytes());
            place.setThumbnailContentType(thumbnail.getContentType());
        }
        Result result = this.placeService.modifyPlace(user, place);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();

    }

    @RequestMapping(value = "/", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String deleteIndex(@SessionAttribute(value = "user", required = false) UserEntity user,
                              @RequestParam(value = "index") int index) {
        Result result = this.placeService.deletePlace(user, index);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public PlaceDto getIndex(@SessionAttribute(value = "user",required = false)UserEntity user,
                             @RequestParam("index") int index) {
        PlaceDto place = this.placeService.getPlaceDto(index);
        place.setSigned(user != null);
        place.setMine(user != null);
        place.setMine(user != null && user.getEmail().equals(place.getUserEmail()));
        place.setSaved(user != null && this.favoriteService.getFavorite(user,index) !=null);
        return place;
    }


    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postIndex(@SessionAttribute("user") UserEntity user,
                            @RequestParam("_thumbnail") MultipartFile thumbnail,
                            PlaceEntity place) throws IOException {
        place.setThumbnail(thumbnail.getBytes());
        place.setThumbnailContentType(thumbnail.getContentType());
        Result result = this.placeService.addPlace(user, place);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == CommonResult.SUCCESS) {
            responseObject.put("index", place.getIndex());
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "/byCoords", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public PlaceDto[] getByCoords(@SessionAttribute(value = "user", required = false) UserEntity user,
                                  @RequestParam("minLat") double minLat,
                                  @RequestParam("minLng") double minLng,
                                  @RequestParam("maxLat") double maxLat,
                                  @RequestParam("maxLng") double maxLng) {
        PlaceDto[] places = this.placeService.getPlacesByCoords(minLat, minLng, maxLat, maxLng);

//        Arrays.stream(places).forEach(place -> place.setMine(user != null && user.getEmail().equals(place.getUserEmail())));

        for (PlaceDto place : places) {
            place.setMine(user != null && user.getEmail().equals(place.getUserEmail()));
            place.setSigned(user != null);
        }
        return places;
    }

    @RequestMapping(value = "/thumbnail", method = RequestMethod.GET)
    public ResponseEntity<byte[]> getThumbnail(@RequestParam("index") int index) {
        PlaceEntity place = this.placeService.getPlace(index);
        if (place == null) {
            return ResponseEntity.notFound().build(); // 404
        }
        return ResponseEntity
                .ok()
                .contentType(MediaType.parseMediaType(place.getThumbnailContentType()))
                .contentLength(place.getThumbnail().length)
                .body(place.getThumbnail());
    }


}

//        System.out.println("파일 이름 : " + thumbnail.getOriginalFilename());
//        System.out.println("파일 크기 : " + thumbnail.getSize());
//        System.out.println("파일 타입 : " + thumbnail.getContentType());
