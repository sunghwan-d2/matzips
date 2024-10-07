package com.ksh.matzips.misc;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

public class MailSender {
    private final JavaMailSender mailSender;
    private final MimeMessage mimeMessage;
    private final MimeMessageHelper mimeMessageHelper;

    public MailSender(JavaMailSender mailSender) throws MessagingException {
        this(mailSender, false);
    }

    public MailSender(JavaMailSender mailSender, boolean isMultipart) throws MessagingException {
        this.mailSender = mailSender;
        this.mimeMessage = mailSender.createMimeMessage();
        this.mimeMessageHelper = new MimeMessageHelper(this.mimeMessage, isMultipart);
    }

    public void send() {
        this.mailSender.send(this.mimeMessage);
    }

    public MailSender setFrom(String from) throws MessagingException {
        this.mimeMessageHelper.setFrom(from);
        return this;
    }

    public MailSender setSubject(String subject) throws MessagingException {
        this.mimeMessageHelper.setSubject(subject);
        return this;
    }

    public MailSender setText(String text) throws MessagingException {
        return this.setText(text, false);
    }

    public MailSender setText(String text, boolean html) throws MessagingException {
        this.mimeMessageHelper.setText(text, html);
        return this;
    }

    public MailSender setTo(String to) throws MessagingException {
        this.mimeMessageHelper.setTo(to);
        return this;
    }
}
