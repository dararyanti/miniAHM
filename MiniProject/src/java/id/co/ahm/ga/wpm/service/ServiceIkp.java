package id.co.ahm.ga.wpm.service;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import id.co.ahm.ga.wpm.vo.VoCreateUpdateAreaPekerjaan;
import id.co.ahm.ga.wpm.vo.VoCreateUpdateIkp;
import id.co.ahm.ga.wpm.vo.VoSaveIkp;
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
    
    DtoResponse getLovSupplier(DtoParamPaging input);
    
    DtoResponse getLovPic(DtoParamPaging input);
    
    DtoResponse getLovPlant(DtoParamPaging input);
    
    DtoResponse getLovPo(DtoParamPaging input);
    
    DtoResponse getLovAsset(DtoParamPaging input);
    
    DtoResponse getLovTaskList(DtoParamPaging input);
    
    DtoResponse getLovIkpId(DtoParamPaging input);
    
    DtoResponse saveIkp(VoSaveIkp vo) throws Exception;
    
    DtoResponse getTabelArea(DtoParamPaging input);
    
    DtoResponse saveArea(VoCreateUpdateAreaPekerjaan vo);
    
    DtoResponse deleteArea(String ikpId, VoPstUserCred voPstUserCred);

}
