package com.ksh.matzips.entities;

import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Builder
@Data
@EqualsAndHashCode(of = "code")
public class PlaceCategoryEntity {
    private String code;
    private String text;
}
