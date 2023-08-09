package id.co.ahm.ga.wpm.service.impl;

import id.co.ahm.ga.wpm.dao.Wpm001AhmgawpmHdrikpsDao;
import id.co.ahm.ga.wpm.service.Wpm001Service;
import id.co.ahm.ga.wpm.util.DtoHelper;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import id.co.ahm.ga.wpm.util.StatusMsgEnum;
import id.co.ahm.ga.wpm.vo.Wpm001VoShowTableIkp;
import id.co.jxf.security.vo.VoPstUserCred;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

/**
 *
 * @author Irzan Maulana
 */
@Service(value = "wpm001Service")
@Transactional
public class Wpm001ServiceImpl implements Wpm001Service {

    @Autowired
    @Qualifier(value = "wpm001AhmgawpmHdrikpsDao")
    private Wpm001AhmgawpmHdrikpsDao wpm001AhmgawpmHdrikpsDao;

    @Override
    public DtoResponse getTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred) {
        int total = wpm001AhmgawpmHdrikpsDao.getCountTableIkp(input, voPstUserCred);
        List<Wpm001VoShowTableIkp> result = wpm001AhmgawpmHdrikpsDao.getTableIkp(input, voPstUserCred);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

}
