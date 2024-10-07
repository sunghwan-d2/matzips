package com.ksh.matzips.controllers;

import com.ksh.matzips.entities.FavoriteEntity;
import com.ksh.matzips.entities.UserEntity;
import com.ksh.matzips.results.CommonResult;
import com.ksh.matzips.results.Result;
import com.ksh.matzips.services.FavoriteService;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/favorite")
public class FavoriteController {
    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postIndex(@SessionAttribute("user")UserEntity user,
                            @RequestParam("placeIndex") int placeIndex){
        FavoriteEntity favorite = new FavoriteEntity();
        favorite.setUserEmail(user.getEmail());
        favorite.setPlaceIndex(placeIndex);
        Result result = this.favoriteService.toggleFavorite(favorite);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        if (result == CommonResult.SUCCESS){
            responseObject.put("saved",this.favoriteService.getFavorite(user,placeIndex) != null);
        }
        return responseObject.toString();
    }
}
