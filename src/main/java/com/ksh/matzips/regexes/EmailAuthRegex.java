package com.ksh.matzips.regexes;

import lombok.experimental.UtilityClass;

@UtilityClass
public class EmailAuthRegex {
    public static final Regex email = new Regex(UserRegex.email.expression);
    public static final Regex code = new Regex("^(\\d{6})$");
    public static final Regex salt = new Regex("^([\\da-f]{128})$");
}
