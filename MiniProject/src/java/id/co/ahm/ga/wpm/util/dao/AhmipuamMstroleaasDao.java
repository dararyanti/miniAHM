package id.co.ahm.ga.wpm.util.dao;

import id.co.ahm.ga.wpm.util.model.AhmipuamMstroleaas;
import id.co.ahm.ga.wpm.util.vo.VoRole;
import java.util.List;

/**
 *
 * @author Irzan Maulana
 */
public interface AhmipuamMstroleaasDao extends DefaultDao<AhmipuamMstroleaas, Long> {

    List<VoRole> getCustomRolesByApplication(String menuCode, String username);

    List<VoRole> getRolesByApplication(String menuCode, String username);

    List<VoRole> getRolesByService(String url, String username);

}
