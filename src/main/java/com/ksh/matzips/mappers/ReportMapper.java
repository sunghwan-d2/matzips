package com.ksh.matzips.mappers;

import com.ksh.matzips.entities.ReportEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReportMapper {
    int insertReport(ReportEntity report);

    ReportEntity selectReportByUserEmailAndPlaceIndex(
            @Param("userEmail") String userEmail,
            @Param("placeIndex") int placeIndex);
}
