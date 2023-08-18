package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.AreaPekerjaan;
import id.co.ahm.ga.wpm.model.AreaPekerjaanPk;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.vo.VoShowAreaPekerjaan;
import java.util.List;

/**
 *
 * @author Irzan Maulana
 */
public interface AreaPekerjaanDao extends DefaultDao<AreaPekerjaan, AreaPekerjaanPk> {
    
    public List<Object[]> findNomorAssetAreaPekerjaanByIkpId(String ikpId);
    
    public List<VoShowAreaPekerjaan> getTabelArea(DtoParamPaging input);
    
    int getCountTabelArea(DtoParamPaging input);
    
}
