package com.ksh.matzips.entities;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
@EqualsAndHashCode(of = "index")
public class ReportEntity {
    private int index;
    private String userEmail;
    private int placeIndex;
    private LocalDateTime createdAt;
    private boolean isHandled;
}
