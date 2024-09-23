package com.ksh.matzips.regexes;

import lombok.experimental.UtilityClass;

@UtilityClass
public class PlaceRegex {
    public static final Regex name = new Regex("^([\\da-zA-Z가-힣\\- ]{1,50})$");
    public static final Regex _name = name;
    public static final Regex contactFirst = new Regex("^(\\d{3,4})$");
    public static final Regex contactSecond = new Regex("^(\\d{3,4})$");
    public static final Regex contactThird = new Regex("^(\\d{4})$");
    public static final Regex addressPostal = new Regex("^(\\d{5})$");
    public static final Regex addressPrimary = new Regex("^([\\da-zA-Z가-힣()\\- ]{10,100})$");
    public static final Regex addressSecondary = new Regex("^([\\da-zA-Z가-힣()\\- ]{0,100})$");
    public static final Regex description = new Regex("^([\\S\\s]{0,10000})$");
}