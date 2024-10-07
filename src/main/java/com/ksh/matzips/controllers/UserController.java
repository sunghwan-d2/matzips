package com.ksh.matzips.controllers;

import com.ksh.matzips.entities.EmailAuthEntity;
import com.ksh.matzips.entities.UserEntity;
import com.ksh.matzips.results.CommonResult;
import com.ksh.matzips.results.Result;
import com.ksh.matzips.services.UserService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import java.security.NoSuchAlgorithmException;


@Controller
@RequestMapping("/user")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }


    @RequestMapping(value = "/email",method = RequestMethod.GET,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getEmail(UserEntity user){
        Result result= this.userService.recoverEmail(user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result",result.name().toLowerCase());
        if (result == CommonResult.SUCCESS){
            responseObject.put("email",user.getEmail());
        }
        return responseObject.toString();
    }

    @RequestMapping(value="/recoverPasswordEmail", method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postEmail(EmailAuthEntity emailAuth) throws MessagingException, NoSuchAlgorithmException {
        Result result= this.userService.sendRecoverPasswordEmail(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result",result.name().toLowerCase());
        if (result == CommonResult.SUCCESS) {
            responseObject.put("salt", emailAuth.getSalt());
        }
        return responseObject.toString();
    }

    @RequestMapping(value = "/recoverPasswordEmail",method = RequestMethod.PATCH,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRecoverPasswordEmail(EmailAuthEntity emailAuth){
        Result result = this.userService.verifyEmailAuth(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result",result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/recoverPassword",method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postResetPassword(EmailAuthEntity emailAuth,
                            UserEntity user){
        Result result = this.userService.resetPassword(emailAuth,user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result",result.name().toLowerCase());
        return responseObject.toString();
    }




    @RequestMapping(value = "/",method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postIndex(EmailAuthEntity emailAuth,
                            UserEntity user){
        Result result = this.userService.register(emailAuth,user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result",result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/login", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postLogin(HttpSession session,
                            UserEntity user) {
        Result result = this.userService.login(user);
        if (result == CommonResult.SUCCESS) {
            session.setAttribute("user", user);
        }
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/registerEmail",method = RequestMethod.PATCH,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRegisterEmail(EmailAuthEntity emailAuth){
        Result result = this.userService.verifyEmailAuth(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result",result.name().toLowerCase());
        return responseObject.toString();
    }


    @RequestMapping(value = "/registerEmail",method = RequestMethod.POST,produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegisterEmail(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException, MessagingException {
        Result result = this.userService.sendRegisterEmail(emailAuth);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result",result.name().toLowerCase());

        if (result == CommonResult.SUCCESS){
            responseObject.put("salt",emailAuth.getSalt());
        }
        return responseObject.toString();
    }
}
