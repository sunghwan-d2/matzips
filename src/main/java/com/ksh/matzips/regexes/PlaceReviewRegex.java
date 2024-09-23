package com.ksh.matzips.regexes;

import lombok.experimental.UtilityClass;

@UtilityClass
public class PlaceReviewRegex {
    public static final Regex content = new Regex("^([\\s\\S]{10,10000})$");
}