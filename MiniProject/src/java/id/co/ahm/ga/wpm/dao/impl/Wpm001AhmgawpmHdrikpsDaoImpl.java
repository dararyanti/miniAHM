package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.dao.Wpm001AhmgawpmHdrikpsDao;
import id.co.ahm.ga.wpm.model.HeaderIkp;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.Wpm001VoShowTableIkp;
import id.co.jxf.security.vo.VoPstUserCred;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.query.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author Irzan Maulana
 */
@Repository("wpm001AhmgawpmHdrikpsDao")
public class Wpm001AhmgawpmHdrikpsDaoImpl extends DefaultHibernateDao<HeaderIkp, String> implements Wpm001AhmgawpmHdrikpsDao {

    @Override
    public int getCountTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred) {
        String countIkp = selectCount(queryTableIkp());
        Query q = filterTableIkp(countIkp, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

    @Override
    public List<Wpm001VoShowTableIkp> getTableIkp(DtoParamPaging input, VoPstUserCred voPstUserCred) {
        String sql = queryTableIkp();
        sql = orderTableIkp(sql, input);
        Query q = filterTableIkp(sql, input);
        q = setOffset(q, input);
        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < row.length; i++) {
                map.put(columnNames[i], row[i]);
            }
            list.add(map);
        }
        List<Wpm001VoShowTableIkp> voList = new ArrayList<>();
        for (Map<String, Object> map : list) {
            Wpm001VoShowTableIkp vo = new Wpm001VoShowTableIkp();
            vo.setVikpid((String) map.get("VIKPID"));
            vo.setKategoriPekerjaan((String) map.get("VWOCTGR"));
            vo.setKategoriIzinKerja((String) map.get("VWOPERMIT"));
            vo.setDeskripsiItem((String) map.get("VITEMDESC"));
            vo.setOrderingType((String) map.get("VORDERTYPE"));
            if (((String) map.get("VORDERTYPE")).equals("PO")) {
                vo.setNomorPo((String) map.get("VODRTYPNUM"));
            } else {
                vo.setNomorPo((String) map.get("VNOSPK"));
            }
            vo.setPlantId((String) map.get("VPLANTID"));
            vo.setNomorPengajuanLk3((String) map.get("VPROJSUB"));
            vo.setNrpPic((BigDecimal) map.get("VPICNRPID"));
            vo.setPurcashingOrganization((String) map.get("VPURCHORG"));
            vo.setIdSupplier((String) map.get("VSUPPLYID"));
            vo.setNamaSupplier((String) map.get("VSUPPLDESC"));
            vo.setLoginPatrol((String) map.get("VLGINPATROL"));
            vo.setNomorPengajuanLk3((String) map.get("VPROJSUB"));
            vo.setNamaPic((String) map.get("VNAMA"));
            vo.setDepartemenPic((String) map.get("VNAMADEPARTEMEN"));
            vo.setSeksiPic((String) map.get("VNAMASEKSI"));
            vo.setDivisiPic((String) map.get("VNAMADIVISI"));
            switch ((String) map.get("VSTATUS")) {
                case "00-IKP":
                    vo.setStatus("IKP Created");
                    break;
                case "01-IKP":
                    vo.setStatus("IKP Requested by Kontraktor");
                    break;
                case "02-IKP":
                    vo.setStatus("IKP Upload EHS Requirement by Project Owner");
                    break;
                case "03-IKP":
                    vo.setStatus("IKP Waiting for Approval by Dept Head");
                    break;
                case "04-IKP":
                    vo.setStatus("IKP Waiting for Approval by EHS Officer");
                    break;
                case "05-IKP":
                    vo.setStatus("IKP Waiting Revision by Kontraktor");
                    break;
                case "06-IKP":
                    vo.setStatus("IKP Approved");
                    break;
                case "07-IKP":
                    vo.setStatus("IKP Rejected");
                    break;
            }
            voList.add(vo);
        }
        return voList;
    }

    private String selectCount(String input) {
        StringBuffer sb = new StringBuffer();
        sb.append(" SELECT COUNT(*) FROM (");
        sb.append(input);
        sb.append(" )");
        String selectCount = sb.toString();
        return selectCount;
    }

    private Query setOffset(Query q, DtoParamPaging input) {
        if (input != null && input.getLimit() >= 0 && input.getOffset() >= 0) {
            q.setFirstResult(input.getOffset());
            q.setMaxResults(input.getLimit());
        }
        return q;
    }

    String[] columnNames = {
        "VWOCTGR", "VWOPERMIT", "VORDERTYPE", "VODRTYPNUM", "VNOSPK",
        "VITEMDESC", "VPLANTID", "VPROJSUB", "VPROJDTL", "VIKPID",
        "VPURCHORG", "VLGINPATROL", "VPICNRPID", "VSUPPLYID", "VSUPPLDESC", "VSTATUS",
        "VNAMADEPARTEMEN", "VNAMASEKSI", "VNAMADIVISI",  "VNAMA"
    };

    private String queryTableIkp() {
        String sql = " SELECT DISTINCT A.VWOCTGR, A.VWOPERMIT, A.VORDERTYPE, A.VODRTYPNUM, A.VNOSPK, A.VITEMDESC, A.VPLANTID,A.VPROJSUB, "
                + " A.VPROJDTL, A.VIKPID, A.VPURCHORG, B.VLGINPATROL, A.VPICNRPID, A.VSUPPLYID, A.VSUPPLDESC, A.VSTATUS, "
                + " C.VNAMADEPARTEMEN, C.VNAMASEKSI, C.VNAMADIVISI, C.VNAMA"
                + " FROM AHMGAWPM_HDRIKPS A LEFT JOIN AHMGAWPM_DTLIKPAREAS B ON A.VIKPID = B.VIKPID "
                + " LEFT JOIN AHMGAWPM_TBLPIC C ON A.VPICNRPID = C.VNRP "
                + " WHERE ((:idSupplier IS NULL) OR A.VSUPPLYID = :idSupplier ) "
                + " AND ((:vikpid IS NULL) OR (LOWER(A.VIKPID) LIKE LOWER(CONCAT(CONCAT('%',:vikpid),'%')))) "
                + " AND ((:nrpPic IS NULL) OR A.VPICNRPID = :nrpPic) "
                + " AND A.VSTATUS IN (:status) "
                + " AND ((:plantId IS NULL) OR A.VPLANTID = :plantId) "
                + " AND ((:orderingType IS NULL) OR A.VORDERTYPE = :orderingType) "
                + " AND (((:nomorPo IS NULL) OR A.VODRTYPNUM = :nomorPo) "
                + " AND ((:nomorSpk IS NULL) OR A.VNOSPK = :nomorSpk)) "
                + " AND ((:startPeriode IS NULL OR :endPeriode IS NULL) OR (A.DCREA BETWEEN TO_DATE(:startPeriode, 'dd-MM-yyyy') AND TO_DATE(:endPeriode, 'dd-MM-yyyy'))) ";
        return sql;
    }

    private Query filterTableIkp(String sql, DtoParamPaging input) {
        Query q = getCurrentSession().createSQLQuery(sql);
        q.setParameter("idSupplier", input.getSearch().get("idSupplier"));
        q.setParameter("nrpPic", input.getSearch().get("nrpPic"));
        q.setParameterList("status", (Collection) input.getSearch().get("status"));
        q.setParameter("plantId", input.getSearch().get("plantId"));
        q.setParameter("vikpid", input.getSearch().get("vikpid"));
        q.setParameter("orderingType", input.getSearch().get("orderingType"));
        if (input.getSearch().get("orderingType") != null) {
            if (input.getSearch().get("orderingType").toString().equals("PO")) {
                q.setParameter("nomorPo", input.getSearch().get("nomorPoSpk"));
                q.setParameter("nomorSpk", null);
            } else {
                q.setParameter("nomorPo", null);
                q.setParameter("nomorSpk", input.getSearch().get("nomorPoSpk"));
            }
        } else {
            q.setParameter("nomorPo", input.getSearch().get("nomorPoSpk"));
            q.setParameter("nomorSpk", input.getSearch().get("nomorPoSpk"));
        }
        q.setParameter("startPeriode", input.getSearch().get("startPeriode"));
        q.setParameter("endPeriode", input.getSearch().get("endPeriode"));
        return q;
    }

    private String orderTableIkp(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString().toLowerCase()) {
                case "idsupplier":
                    order.append(" A.VSUPPLYID ");
                    break;
                case "namasupplier":
                    order.append(" A.VSUPPLDESC ");
                    break;
                case "orderingtype":
                    order.append(" A.VORDERTYPE ");
                    break;
                case "nomorpospk":
                    order.append(" A.VODRTYPNUM, A.VNOSPK ");
                    break;
                case "deskripsiitem":
                    order.append(" A.VITEMDESC ");
                    break;
                case "plantid":
                    order.append(" A.VPLANTID ");
                    break;
                case "nomorpengajuanlk3":
                    order.append(" A.VPROJSUB ");
                    break;
                case "loginpatrol":
                    order.append(" B.VLGINPATROL ");
                    break;
                case "status":
                    order.append(" A.VSTATUS ");
                    break;
                case "nrppicid":
                    order.append(" A.VPICNRPID ");
                    break;
                case "namadivisi":
                    order.append(" C.VNAMADIVISI ");
                    break;
                case "namadepartemen":
                    order.append(" C.VNAMADEPARTEMEN ");
                    break;
                case "namaseksi":
                    order.append(" C.VNAMASEKSI ");
                    break;
                default:
                    return sqlString.toString();
            }
            if (input.getOrder().toString().equals("asc")) {
                order.append(" ASC ");
            } else {
                order.append(" DESC ");
            }
            sqlString.append(order);
        }
        return sqlString.toString();
    }

}
