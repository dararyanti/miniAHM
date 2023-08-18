package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.HeaderIkp;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoLovIkpId;
import id.co.ahm.ga.wpm.vo.VoLovPic;
import id.co.ahm.ga.wpm.vo.VoLovPo;
import id.co.ahm.ga.wpm.vo.VoLovSupplier;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import java.util.List;

/**
 *
 * @author Irzan Maulana
 */
public interface HeaderIkpDao extends DefaultDao<HeaderIkp, String> {

    int getCountTableIkp(DtoParamPaging input);

    public List<VoShowTableIkp> getTableIkp(DtoParamPaging input);
    
    public List<VoLovSupplier> getLovSupplierMaintenance(DtoParamPaging input);
    
    int getCountLovSupplierMaintenance(DtoParamPaging input);
    
    public List<VoLovPic> getLovPicMaintenance(DtoParamPaging input);
    
    int getCountLovPicMaintenance(DtoParamPaging input);
    
    public List<VoLovPo> getLovPoMaintenance(DtoParamPaging input);
    
    int getCountLovPoMaintenance(DtoParamPaging input);
    
    public List<String> findSequence(String plantId, String month, String year);
    
    public List<VoLovIkpId> getLovIkpId(DtoParamPaging input);
    
    int getCountLovIkpId(DtoParamPaging input);
}
