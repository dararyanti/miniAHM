package id.co.ahm.ga.wpm.service;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import id.co.jxf.security.vo.VoPstUserCred;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Irzan Maulana
 */
public interface ServiceIkp {

    DtoResponse getTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred);

    DtoResponse deleteIkp(String ikpId, VoPstUserCred voPstUserCred);

    DtoResponse getAreaProjectTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred);

    List<VoShowTableIkp> exportToExcelIkp(Map<String, Object> params, VoPstUserCred voPstUserCred);

    VoShowTableIkp downloadIkp(Map<String, Object> params, VoPstUserCred voPstUserCred) throws Exception;

}
