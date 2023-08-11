package id.co.ahm.ga.wpm.service;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import id.co.jxf.security.vo.VoPstUserCred;

/**
 *
 * @author Irzan Maulana
 */
public interface ServiceIkp {

    DtoResponse getTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred);

    DtoResponse getAreaProjectTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred);

}