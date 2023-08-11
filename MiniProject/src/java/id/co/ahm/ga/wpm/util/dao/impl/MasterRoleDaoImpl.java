package id.co.ahm.ga.wpm.util.dao.impl;

import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.util.model.MasterRole;
import id.co.ahm.ga.wpm.util.vo.VoRole;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;
import id.co.ahm.ga.wpm.util.dao.MasterRoleDao;

/**
 *
 * @author Irzan Maulana
 */
@Repository("ahmipuamMstroleaasDao")
public class MasterRoleDaoImpl extends DefaultHibernateDao<MasterRole, Long>
        implements MasterRoleDao {

    @Override
    public List<VoRole> getCustomRolesByApplication(String menuCode, String username) {
        List<VoRole> result = new ArrayList<>();

        String sql = "SELECT VACTALLOWED FROM AHMIPUAM_MSTROLEAAS "
                + "WHERE VENABLEFLAG = 'Y' "
                + "AND IROLEACCSID IN (SELECT IINTERNALID FROM AHMIPUAM_MSTROLEACCS "
                + "WHERE VENABLEFLAG = 'Y' "
                + "AND IMENUINTID = (SELECT IINTERNALID FROM AHMIPUAM_MSTMENUS "
                + "WHERE VMENUCODE = :BINDMENUCODE) "
                + "AND IROLEINTID IN (SELECT IROLEINTID "
                + "FROM AHMIPUAM_MSTUSERRLS "
                + "WHERE VUSERNAME = :BINDUSERNAME)) ";
//        String sql = "SELECT DISTINCT(VACTALLOWED) "
//                + "FROM ahmipuam_mstroleaas  "
//                + "WHERE IROLEACCSID IN (  "
//                + "SELECT rlacs.iinternalid "
//                + "FROM ahmipuam_mstuserrls usrrl , "
//                + "ahmipuam_mstroles rl , "
//                + "ahmipuam_mstroleaccs rlacs , "
//                + "ahmipuam_mstmenus mn "
//                + "WHERE usrrl.iroleintid = rl.iinternalid "
//                + "AND rl.venableflag     = 'Y' "
//                + "AND usrrl.vusername    = :BINDUSERNAME "
//                + "AND rlacs.venableflag  = 'Y' "
//                + "AND rlacs.iroleintid   = rl.iinternalid "
//                + "AND rlacs.iroleintid   = usrrl.iroleintid "
//                + "AND mn.venableflag     = 'Y' "
//                + "AND mn.iinternalid     = rlacs.imenuintid "
//                + "AND mn.vdeviceflag = 'J' "
//                + "AND mn.vmenucode = :BINDMENUCODE )";

        SQLQuery sqlQuery = getCurrentSession().createSQLQuery(sql);
        sqlQuery.setString("BINDUSERNAME", username);
        sqlQuery.setString("BINDMENUCODE", menuCode);

        List<String> tempList = sqlQuery.list();
        if (tempList != null) {
            VoRole voRole;
            for (String temp : tempList) {
                voRole = new VoRole();
                voRole.setCustomrole((String) temp);

                result.add(voRole);
            }
        }

        return result;
    }

    @Override
    public List<VoRole> getRolesByApplication(String menuCode, String username) {
        List<VoRole> result = new ArrayList<>();

        String sql = "SELECT ROL.VROLENAME, ROL.VROLEDESC "
                + "FROM AHMIPUAM_MSTROLEACCS RAC, AHMIPUAM_MSTMENUS MEN, AHMIPUAM_MSTROLES ROL "
                + "WHERE RAC.VENABLEFLAG = 'Y' "
                + "AND RAC.IMENUINTID = MEN.IINTERNALID "
                + "AND MEN.VMENUCODE = :BINDMENUCODE "
                + "AND MEN.VENABLEFLAG = 'Y' "
                + "AND RAC.IROLEINTID = ROL.IINTERNALID "
                + "AND ROL.VENABLEFLAG = 'Y' "
                + "AND RAC.IROLEINTID IN (SELECT IROLEINTID "
                + "FROM AHMIPUAM_MSTUSERRLS "
                + "WHERE VUSERNAME = :BINDUSERNAME) ";

        SQLQuery sqlQuery = getCurrentSession().createSQLQuery(sql);
        sqlQuery.setString("BINDMENUCODE", menuCode);
        sqlQuery.setString("BINDUSERNAME", username);

        List<Object[]> tempList = sqlQuery.list();
        if (tempList != null) {
            VoRole voRole;
            for (Object[] obj : tempList) {
                voRole = new VoRole();
                voRole.setRolename((String) obj[0]);
                voRole.setRoledesc((String) obj[1]);

                result.add(voRole);
            }
        }

        return result;
    }

    @Override
    public List<VoRole> getRolesByService(String url, String username) {
        List<VoRole> result = new ArrayList<>();

        String sql = "SELECT SVC.VSVCNAME, ROL.VROLENAME, ROL.VROLEDESC "
                + "FROM AHMIPUAM_MSTRLSVCS RSV, AHMIPUAM_MSTSERVICES SVC, AHMIPUAM_MSTROLES ROL "
                + "WHERE RSV.MSRVC_VIDSERVICE = SVC.VID "
                + "AND RSV.DBEGINEFF <= SYSDATE "
                + "AND RSV.DENDEFF >= SYSDATE "
                + "AND SVC.VURL = :BINDURL "
                + "AND RSV.MROLE_IIDROLE = ROL.IINTERNALID "
                + "AND ROL.VENABLEFLAG = 'Y' "
                + "AND RSV.MROLE_IIDROLE IN (SELECT IROLEINTID "
                + "FROM AHMIPUAM_MSTUSERRLS "
                + "WHERE VUSERNAME = :BINDUSERNAME) ";

        SQLQuery sqlQuery = getCurrentSession().createSQLQuery(sql);
        sqlQuery.setString("BINDURL", url);
        sqlQuery.setString("BINDUSERNAME", username);

        List<Object[]> tempList = sqlQuery.list();
        if (tempList != null) {
            VoRole voRole;
            for (Object[] obj : tempList) {
                voRole = new VoRole();
                voRole.setServicename((String) obj[0]);
                voRole.setRolename((String) obj[1]);
                voRole.setRoledesc((String) obj[2]);

                result.add(voRole);
            }
        }

        return result;
    }

}

