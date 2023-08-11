package id.co.ahm.ga.wpm.util.dao.impl;

import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.util.model.MasterKaryawan;
import id.co.ahm.ga.wpm.util.vo.VoOrganization;
import java.util.List;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;
import id.co.ahm.ga.wpm.util.dao.MasterKaryawanDao;

/**
 *
 * @author Irzan Maulana
 */
@Repository("ahmmoerpMstkaryawansDao")
public class MasterKaryawanDaoImpl extends DefaultHibernateDao<MasterKaryawan, Integer>
        implements MasterKaryawanDao{
    
    private String queryStukturOrganisasiUser() {
        return "SELECT GENDAT_NRP AS NRP , "
                + "(SELECT SECTN_ID FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'SC' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1 CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM' ) SEC_ID, "
                + "(SELECT SEC_NAME FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'SC' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1 CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM' ) SEC_NAME, "
                + "(SELECT SECTN_ID FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'SD' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1 CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM' )SUBDEPT_ID, "
                + "(SELECT SEC_NAME FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'SD' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1 CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM' ) SUBDEPT_NAME, "
                + "(SELECT SECTN_ID FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'DP' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1 CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM' ) DEPT_ID, "
                + "(SELECT SEC_NAME FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'DP' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1  CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM') DEPT_NAME, "
                + "(SELECT SECTN_ID FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'DV' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1  CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM') DIV_ID, "
                + "(SELECT SEC_NAME FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'DV' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1 CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM') DIV_NAME, "
                + "(SELECT SECTN_ID FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'DR' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1 CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM') DIR_ID, "
                + "(SELECT SEC_NAME FROM FMHRD_SECTIONS @dbhrdtxn WHERE SECT_TYPE = 'DR' AND VEND_VND_CODE = 'AHM' AND SYSDATE BETWEEN BGN_EFFD AND LST_EFFD AND ROWNUM = 1 CONNECT BY PRIOR SECT_SECTN_ID = SECTN_ID AND SECT_SECTN_ID != SECTN_ID AND VEND_VND_CODE = 'AHM' START WITH SECTN_ID = CA.SECTION_ID AND VEND_VND_CODE = 'AHM') DIR_NAME "
                + "FROM FMHRD_EMPLOYMENTS @dbhrdtxn CA "
                + "WHERE GENDAT_VEND_VND_CODE = 'AHM' "
                + "AND GENDAT_NRP = :NRP ";
    }
    
    public VoOrganization getUserOrganization(int nrp) {

        StringBuilder sql = new StringBuilder();
        sql.append(queryStukturOrganisasiUser());

        Query query = getCurrentSession().createSQLQuery(sql.toString());
        query.setParameter("NRP", nrp);

        List<Object> list = query.list();
        if (!list.isEmpty()) {
            Object[] o = (Object[]) list.get(0);
            VoOrganization voOrganization = new VoOrganization();
            voOrganization.setSectionId(o[1] + "");
            voOrganization.setSectionName(o[2] + "");
            voOrganization.setSubDeptId(o[3] + "");
            voOrganization.setSubDeptName(o[4] + "");
            voOrganization.setDeptId(o[5] + "");
            voOrganization.setDeptName(o[6] + "");
            voOrganization.setDivId(o[7] + "");
            voOrganization.setDivName(o[8] + "");
            voOrganization.setDirId(o[9] + "");
            voOrganization.setDirName(o[10] + "");
            return voOrganization;
        }
        return null;
    }
    
}
