package id.co.ahm.ga.wpm.util;

import id.co.ahm.ga.wpm.util.vo.VoOrganization;
import id.co.ahm.ga.wpm.util.vo.VoRole;
import id.co.jxf.security.vo.VoPstUserCred;
import java.util.List;

/**
 *
 * @author Irzan Maulana
 */
public interface UserUtilsService {

    VoPstUserCred getUserCred(String token);

    List<VoRole> getCustomRolesByApplication(String menuCode, String token);

    List<VoRole> getRolesByApplication(String menuCode, String token);

    List<VoRole> getRolesByService(String url, String token);
    
    VoOrganization getOrganization(int nrp);

}
