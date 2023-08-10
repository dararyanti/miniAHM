package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.AhmgawpmHdrikps;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.Wpm001VoShowTableIkp;
import id.co.jxf.security.vo.VoPstUserCred;
import java.util.List;

/**
 *
 * @author Irzan Maulana
 */
public interface Wpm001AhmgawpmHdrikpsDao extends DefaultDao<AhmgawpmHdrikps, String> {

    int getCountTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred);

    public List<Wpm001VoShowTableIkp> getTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred);
}
