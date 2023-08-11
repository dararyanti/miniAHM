package id.co.ahm.ga.wpm.util.dao;

import id.co.ahm.ga.wpm.util.model.MasterRole;
import id.co.ahm.ga.wpm.util.vo.VoRole;
import java.util.List;

/**
 *
 * @author Irzan Maulana
 */
public interface MasterRoleDao extends DefaultDao<MasterRole, Long> {

    List<VoRole> getCustomRolesByApplication(String menuCode, String username);

    List<VoRole> getRolesByApplication(String menuCode, String username);

    List<VoRole> getRolesByService(String url, String username);

}
