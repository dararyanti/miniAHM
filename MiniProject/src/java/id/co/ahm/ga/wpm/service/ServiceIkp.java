package id.co.ahm.ga.wpm.service;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import id.co.ahm.ga.wpm.vo.VoCreateUpdateAreaPekerjaan;
import id.co.ahm.ga.wpm.vo.VoSaveIkp;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Irzan Maulana
 */
public interface ServiceIkp {

    DtoResponse getTableIkp(DtoParamPaging input);

    DtoResponse deleteIkp(String ikpId);

    DtoResponse getAreaProjectTableIkp(DtoParamPaging input);

    List<VoShowTableIkp> exportToExcelIkp(Map<String, Object> params);

    VoShowTableIkp downloadIkp(Map<String, Object> params) throws Exception;
    
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
    
    DtoResponse deleteArea(String ikpId, String assetNo);

}
