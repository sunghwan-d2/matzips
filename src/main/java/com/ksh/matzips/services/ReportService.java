package com.ksh.matzips.services;

import com.ksh.matzips.entities.ReportEntity;
import com.ksh.matzips.mappers.ReportMapper;
import com.ksh.matzips.regexes.UserRegex;
import com.ksh.matzips.results.CommonResult;
import com.ksh.matzips.results.Result;
import com.ksh.matzips.results.report.PutReportResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReportService {
    private final ReportMapper reportMapper;

    @Autowired
    public ReportService(ReportMapper reportMapper) {
        this.reportMapper = reportMapper;
    }

    public Result putReport(ReportEntity report){
        if (report == null || !UserRegex.email.tests(report.getUserEmail())){
            return CommonResult.FAILURE;
        }
        if (this.reportMapper.selectReportByUserEmailAndPlaceIndex(report.getUserEmail(), report.getPlaceIndex()) != null ){
            return PutReportResult.FAILURE_DUPLICATE;
        }
        // ReportEntity를 INSERT하는 메서드. 단, 전달 받은 report 가 가지는 userEmail 과 placeIndex로 ReportEntity 로 SELECT 한 결과가 NULL 이 아니면 PutReportResult.FAILURE_DUPLICATE을 반환한다. (이미 본인이 신고한 맛집이므로)
        return this.reportMapper.insertReport(report)>0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }
}
