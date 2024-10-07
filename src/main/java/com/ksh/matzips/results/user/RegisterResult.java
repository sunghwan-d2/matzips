package com.ksh.matzips.results.user;

import com.ksh.matzips.results.Result;

public enum RegisterResult implements Result{
    FAILURE_DUPLICATE_EMAIL,
    FAILURE_DUPLICATE_NICKNAME
}
