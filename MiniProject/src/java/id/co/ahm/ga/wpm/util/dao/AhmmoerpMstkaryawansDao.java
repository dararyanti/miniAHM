package id.co.ahm.ga.wpm.util.dao;

import id.co.ahm.ga.wpm.util.model.AhmmoerpMstkaryawans;
import id.co.ahm.ga.wpm.util.vo.VoOrganization;

/**
 *
 * @author Irzan Maulana
 */
public interface AhmmoerpMstkaryawansDao extends DefaultDao<AhmmoerpMstkaryawans, Integer>{
    VoOrganization getUserOrganization(int nrp);
}

