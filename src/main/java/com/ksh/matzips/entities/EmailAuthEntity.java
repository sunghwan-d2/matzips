package com.ksh.matzips.entities;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDateTime;

@Builder
@Data
@EqualsAndHashCode(of = {"email","code","salt"})
@AllArgsConstructor
public class EmailAuthEntity {
    private String email;
    private String code;
    private String salt;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    @Builder.Default
    private boolean isExpired;
    @Builder.Default
    private boolean isVerified;
    @Builder.Default
    private boolean isUsed;

    public EmailAuthEntity() {
        this.isExpired =false;
        this.isVerified =false;
        this.isUsed = false;
    }

}
