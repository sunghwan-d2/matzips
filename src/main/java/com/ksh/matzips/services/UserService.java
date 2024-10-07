package com.ksh.matzips.services;

import com.ksh.matzips.entities.EmailAuthEntity;
import com.ksh.matzips.entities.UserEntity;
import com.ksh.matzips.mappers.UserMapper;
import com.ksh.matzips.misc.MailSender;
import com.ksh.matzips.regexes.EmailAuthRegex;
import com.ksh.matzips.regexes.UserRegex;
import com.ksh.matzips.results.CommonResult;
import com.ksh.matzips.results.Result;
import com.ksh.matzips.results.user.LoginResult;
import com.ksh.matzips.results.user.RegisterResult;
import com.ksh.matzips.results.user.SendRegisterEmailResult;
import com.ksh.matzips.results.user.VerifyRegisterEmailResult;
import jakarta.mail.MessagingException;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.token.Sha512DigestUtils;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class UserService {
    private static void prepareEmailAuth(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException {
        emailAuth.setCode(RandomStringUtils.randomNumeric(6));
        emailAuth.setSalt(Sha512DigestUtils.shaHex(String.format("%s%s%f%f",
                emailAuth.getEmail(),
                emailAuth.getCode(),
                SecureRandom.getInstanceStrong().nextDouble(),
                SecureRandom.getInstanceStrong().nextDouble())));
        emailAuth.setCreatedAt(LocalDateTime.now());
        emailAuth.setExpiresAt(LocalDateTime.now().plusMinutes(5));
        emailAuth.setExpired(false);
        emailAuth.setVerified(false);
        emailAuth.setUsed(false);
    }
    private final UserMapper userMapper;
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;



    @Autowired
    public UserService(UserMapper userMapper, JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.userMapper = userMapper;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }



    public Result recoverEmail(UserEntity user) {
        if (user == null || !UserRegex.nickname.tests(user.getNickname())) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.userMapper.selectUserByNickname(user.getNickname());
        if (dbUser == null || dbUser.isDeleted()) {
            return CommonResult.FAILURE;
        }
        user.setEmail(dbUser.getEmail());
        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result sendRecoverPasswordEmail(EmailAuthEntity emailAuth) throws MessagingException, NoSuchAlgorithmException {
        if (emailAuth == null || !EmailAuthRegex.email.tests(emailAuth.getEmail())) {
            return CommonResult.FAILURE;
        }
        if (this.userMapper.selectUserByEmail(emailAuth.getEmail()) == null) {
            return CommonResult.FAILURE;
        }
       prepareEmailAuth(emailAuth);
        if (this.userMapper.insertEmailAuth(emailAuth) != 1) {
            return CommonResult.FAILURE;
        }
        Context context = new Context();
        context.setVariable("code", emailAuth.getCode());
        new MailSender(this.mailSender)
                .setFrom("ghktkf789@gmail.com")
                .setSubject("[맛집] 비밀번호 재설정 인증번호")
                .setText(this.templateEngine.process("user/recoverPasswordEmail", context), true)
                .setTo(emailAuth.getEmail())
                .send();
        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result resetPassword(EmailAuthEntity emailAuth,
                                UserEntity user){
        if (emailAuth == null || user == null ||
                !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
                !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
                !EmailAuthRegex.salt.tests(emailAuth.getSalt()) ||
            !UserRegex.password.tests(user.getPassword())){
            return CommonResult.FAILURE;
        }
        EmailAuthEntity dbEmailAuth = this.userMapper.selectUserByEmailCodeSalt(
                emailAuth.getEmail(),
                emailAuth.getCode(),
                emailAuth.getSalt());
        if (dbEmailAuth == null ||
            !dbEmailAuth.isVerified() || dbEmailAuth.isUsed()){
            return CommonResult.FAILURE;
        }
        UserEntity dbUser = this.userMapper.selectUserByEmail(emailAuth.getEmail());
        if (dbUser == null || dbUser.isDeleted()){
            return CommonResult.FAILURE;
        }
        dbEmailAuth.setUsed(true);
        this.userMapper.updateEmailAuth(dbEmailAuth);
        dbUser.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        this.userMapper.updateUser(dbUser);
        return CommonResult.SUCCESS;
    }


    public Result login(UserEntity user){
        if (user == null ||
        !UserRegex.email.tests(user.getEmail()) ||
        !UserRegex.password.tests(user.getPassword())){
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.userMapper.selectUserByEmail(user.getEmail());

        if (dbUser == null){
            return CommonResult.FAILURE;
        }
        if (!BCrypt.checkpw(user.getPassword(), dbUser.getPassword())) {
            return CommonResult.FAILURE;
        }
        if (dbUser.isDeleted()) {
            return CommonResult.FAILURE;
        }
        if (dbUser.isSuspended()) {
            return LoginResult.FAILURE_SUSPENDED;
        }
        user.setPassword(dbUser.getPassword());
        user.setNickname(dbUser.getNickname());
        user.setCreatedAt(dbUser.getCreatedAt());
        user.setAdmin(dbUser.isAdmin());
        user.setDeleted(dbUser.isDeleted());
        user.setSuspended(dbUser.isSuspended());
        return CommonResult.SUCCESS;

    }

    @Transactional
    public Result register(EmailAuthEntity emailAuth, UserEntity user) {
        if (emailAuth == null || user == null ||
                !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
                !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
                !EmailAuthRegex.salt.tests(emailAuth.getSalt()) ||
                !UserRegex.email.tests(user.getEmail()) ||
                !UserRegex.password.tests(user.getPassword()) ||
                !UserRegex.nickname.tests(user.getNickname())) {
            return CommonResult.FAILURE;
        }
        EmailAuthEntity dbEmailAuth = this.userMapper.selectUserByEmailCodeSalt(
                emailAuth.getEmail(),
                emailAuth.getCode(),
                emailAuth.getSalt());
        if (dbEmailAuth == null ||
                dbEmailAuth.isExpired() ||
                !dbEmailAuth.isVerified() ||
                dbEmailAuth.isUsed()) {
            return CommonResult.FAILURE;
        }
        if (this.userMapper.selectUserByEmail(user.getEmail()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_EMAIL;
        }
        if (this.userMapper.selectUserByNickname(user.getNickname()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_NICKNAME;
        }
        dbEmailAuth.setUsed(true);
        this.userMapper.updateEmailAuth(dbEmailAuth);
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setAdmin(false);
        user.setDeleted(false);
        user.setSuspended(false);
        return this.userMapper.insertUser(user) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    @Transactional
    public Result sendRegisterEmail(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException, MessagingException {
        if (emailAuth == null || !EmailAuthRegex.email.tests(emailAuth.getEmail())) {
            return CommonResult.FAILURE;
        }
        if (this.userMapper.selectUserByEmail(emailAuth.getEmail()) != null) {
            return SendRegisterEmailResult.FAILURE_DUPLICATE_EMAIL;
        }
        prepareEmailAuth(emailAuth);
        if (this.userMapper.insertEmailAuth(emailAuth) != 1) {
            return CommonResult.FAILURE;
        }
        Context context = new Context();
        context.setVariable("code", emailAuth.getCode());
        new MailSender(this.mailSender)
                .setFrom("ghktkf789@gmail.com")
                .setSubject("[맛집] 회원가입 인증번호")
                .setText(this.templateEngine.process("user/registerEmail", context), true)
                .setTo(emailAuth.getEmail())
                .send();
        return CommonResult.SUCCESS;
    }

    public Result verifyEmailAuth(EmailAuthEntity emailAuth) {
        if (emailAuth == null ||
                !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
                !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
                !EmailAuthRegex.salt.tests(emailAuth.getSalt())) {
            return CommonResult.FAILURE;
        }
        EmailAuthEntity dbEmailAuth = this.userMapper.selectUserByEmailCodeSalt(
                emailAuth.getEmail(),
                emailAuth.getCode(),
                emailAuth.getSalt());
        if (dbEmailAuth == null) {
            return CommonResult.FAILURE;
        }
        if (dbEmailAuth.getExpiresAt().isBefore(LocalDateTime.now()) ||
                dbEmailAuth.isExpired() ||
                dbEmailAuth.isVerified() ||
                dbEmailAuth.isUsed()) {
            return VerifyRegisterEmailResult.FAILURE_EXPIRED;
        }
        dbEmailAuth.setVerified(true);
        return this.userMapper.updateEmailAuth(dbEmailAuth) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }
}
