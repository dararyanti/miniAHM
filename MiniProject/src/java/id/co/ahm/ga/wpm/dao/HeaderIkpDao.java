package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.HeaderIkp;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import id.co.jxf.security.vo.VoPstUserCred;
import java.util.List;

/**
 *
 * @author Irzan Maulana
 */
public interface HeaderIkpDao extends DefaultDao<HeaderIkp, String> {

    int getCountTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred);

    public List<VoShowTableIkp> getTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred);
}