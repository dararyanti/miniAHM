package id.co.ahm.ga.wpm.service.impl;

import id.co.ahm.ga.wpm.util.DtoHelper;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import id.co.ahm.ga.wpm.util.StatusMsgEnum;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import id.co.jxf.security.vo.VoPstUserCred;
import java.util.List;
import javax.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import id.co.ahm.ga.wpm.dao.AreaPekerjaanDao;
import id.co.ahm.ga.wpm.dao.HeaderIkpDao;
import org.springframework.stereotype.Service;
import id.co.ahm.ga.wpm.service.ServiceIkp;
import java.util.ArrayList;

/**
 *
 * @author Irzan Maulana
 */
@Service(value = "serviceIkp")
@Transactional
public class ServiceIkpImpl implements ServiceIkp {

    @Autowired
    @Qualifier(value = "headerIkpDao")
    private HeaderIkpDao headerIkpDao;

    @Autowired
    @Qualifier(value = "AreaPekerjaanDao")
    private AreaPekerjaanDao areaPekerjaanDao;

    @Override
    public DtoResponse getTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred) {
        int total = headerIkpDao.getCountTableIkp(input, voPstUserCred);
        List<VoShowTableIkp> result = headerIkpDao.getTableIkp(input, voPstUserCred);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse getAreaProjectTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred) {
        int total = headerIkpDao.getCountTableIkp(input, voPstUserCred);
        List<VoShowTableIkp> result = headerIkpDao.getTableIkp(input, voPstUserCred);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

}
