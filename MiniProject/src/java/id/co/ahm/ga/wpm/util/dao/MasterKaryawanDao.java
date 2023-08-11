package id.co.ahm.ga.wpm.util.dao;

import id.co.ahm.ga.wpm.util.model.MasterKaryawan;
import id.co.ahm.ga.wpm.util.vo.VoOrganization;

/**
 *
 * @author Irzan Maulana
 */
public interface MasterKaryawanDao extends DefaultDao<MasterKaryawan, Integer>{
    VoOrganization getUserOrganization(int nrp);
}

