package com.ksh.matzips.regexes;

import lombok.experimental.UtilityClass;

@UtilityClass
public class EmailAuthRegex {
    public static final Regex email = new Regex(UserRegex.email.expression);
}
