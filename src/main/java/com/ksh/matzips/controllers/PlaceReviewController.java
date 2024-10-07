package com.ksh.matzips.controllers;

import com.ksh.matzips.dtos.PlaceReviewDto;
import com.ksh.matzips.entities.PlaceReviewEntity;
import com.ksh.matzips.entities.PlaceReviewImageEntity;
import com.ksh.matzips.entities.PlaceReviewLikeEntity;
import com.ksh.matzips.entities.UserEntity;
import com.ksh.matzips.results.CommonResult;
import com.ksh.matzips.results.Result;
import com.ksh.matzips.services.PlaceReviewService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping("/placeReview")
public class PlaceReviewController {
    private final PlaceReviewService placeReviewService;

    @Autowired
    public PlaceReviewController(PlaceReviewService placeReviewService) {
        this.placeReviewService = placeReviewService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public PlaceReviewDto[] getIndex(@SessionAttribute(value = "user", required = false) UserEntity user,
                                     @RequestParam("placeIndex") int placeIndex) {
        return this.placeReviewService.getReviews(user,placeIndex);
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postIndex(@SessionAttribute("user") UserEntity user,
                            @RequestParam("_images") MultipartFile[] images,
                            PlaceReviewEntity placeReview) throws IOException {
        PlaceReviewImageEntity[] placeReviewImages = new PlaceReviewImageEntity[images.length];
        for (int i = 0; i < images.length; i++) {
            placeReviewImages[i] = PlaceReviewImageEntity.builder()
                    .data(images[i].getBytes())
                    .name(images[i].getOriginalFilename())
                    .contentType(images[i].getContentType())
                    .build();
        }
        Result result = this.placeReviewService.addReview(user, placeReview, placeReviewImages);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/image", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<byte[]> getImage(@RequestParam("index") int index) {
        PlaceReviewImageEntity image = this.placeReviewService.getReviewImage(index);
        if (image == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getContentType()))
                .contentLength(image.getData().length)
                .body(image.getData());
    }

    @RequestMapping(value = "/like", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postLike(@SessionAttribute("user") UserEntity user,
                           PlaceReviewLikeEntity reviewLike) {
        Result result = this.placeReviewService.alterReviewLike(user, reviewLike);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == CommonResult.SUCCESS) {
            Boolean liked = this.placeReviewService.isLiked(user, reviewLike.getPlaceReviewIndex());
            if (liked != null) {
                responseObject.put("liked", liked.booleanValue());
            }
        }
        return responseObject.toString();
    }
}

