package id.co.ahm.ga.wpm.service;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import id.co.jxf.security.vo.VoPstUserCred;

/**
 *
 * @author Irzan Maulana
 */
public interface Wpm001Service {
    
    DtoResponse getTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred);
    
}
