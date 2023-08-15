package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoLovSupplier;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import static java.util.Collections.list;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.hibernate.query.Query;

/**
 *
 * @author Irzan Maulana
 */
public class HeaderIkpConstant {

    public static final String[] IKP_TABLE_COLUMN_NAME = {
        "IKP_ID",
        "KAT_PEKERJAAN",
        "KAT_IZIN_KERJA",
        "TIPE_ORDER",
        "NO_PO",
        "NO_SPK",
        "DESKRIPSI_ITEM",
        "PLANT_ID",
        "NO_PENGAJUAN_PROYEK",
        "PROJECT_DETAIL",
        "START_JOB",
        "END_JOB",
        "PURCHASING_ORG",
        "NRP_ID",
        "SUPPLY_ID",
        "SUPPLY_DESC",
        "NAMA_PENGAWAS",
        "HP_PENGAWAS",
        "NAMA_LK3",
        "HP_LK3",
        "STATUS",
        "REMARK",
        "LOGIN_PATROL",
        "NAMA",
        "DEPARTEMEN",
        "SEKSI",
        "DIVISI",};

    public static final String IKP_TABLE_QUERY
            = " SELECT DISTINCT "
            + " A.IKP_ID, "
            + " A.KAT_PEKERJAAN, "
            + " A.KAT_IZIN_KERJA, "
            + " A.TIPE_ORDER, "
            + " A.NO_PO, "
            + " A.NO_SPK,  "
            + " A.DESKRIPSI_ITEM, "
            + " A.PLANT_ID, "
            + " A.NO_PENGAJUAN_PROYEK, "
            + " A.PROJECT_DETAIL, "
            + " A.START_JOB, "
            + " A.END_JOB, "
            + " A.PURCHASING_ORG, "
            + " A.NRP_ID, "
            + " A.SUPPLY_ID, "
            + " A.SUPPLY_DESC, "
            + " A.NAMA_PENGAWAS, "
            + " A.HP_PENGAWAS, "
            + " A.NAMA_LK3, "
            + " A.HP_LK3, "
            + " A.STATUS, "
            + " A.REMARK, "
            + " B.LOGIN_PATROL, "
            + " C.NAMA, "
            + " C.DEPARTEMEN, "
            + " C.SEKSI, "
            + " C.DIVISI "
            + " FROM HEADER_IKP A "
            + " LEFT JOIN AREA_PEKERJAAN B "
            + " ON A.IKP_ID = B.IKP_ID "
            + " LEFT JOIN PIC C "
            + " ON A.NRP_ID = C.NRP_ID "
            + " WHERE ((:supplierId IS NULL) "
            + "     OR A.SUPPLY_ID = :supplierId ) "
            + " AND ((:ikpId IS NULL) "
            + "     OR A.IKP_ID = :ikpId) "
            + " AND ((:nrpId IS NULL) "
            + "     OR A.NRP_ID = :nrpId) "
            + " AND A.STATUS IN (:status) "
            + " AND ((:plantId IS NULL) "
            + "     OR A.PLANT_ID = :plantId) "
            + " AND ((:tipeOrder IS NULL) "
            + "     OR A.TIPE_ORDER = :tipeOrder) "
            + " AND (((:noPo IS NULL) "
            + "     OR A.NO_PO = :noPo) "
            + " AND ((:noSpk IS NULL) "
            + "     OR A.NO_SPK = :noSpk)) "
            + " AND ((:startPeriode IS NULL "
            + "     OR :endPeriode IS NULL) "
            + "     OR (A.END_JOB BETWEEN TO_DATE(:startPeriode, 'dd-MM-yyyy') "
            + "     AND TO_DATE(:endPeriode, 'dd-MM-yyyy'))) ";

    public final static Query FILTER_TABLE_IKP(Query q, DtoParamPaging input) {
        q.setParameter("supplierId", input.getSearch().get("supplierId"));
        q.setParameter("nrpId", input.getSearch().get("nrpId"));
        q.setParameterList("status", (Collection) input.getSearch().get("status"));
        q.setParameter("plantId", input.getSearch().get("plantId"));
        q.setParameter("ikpId", input.getSearch().get("ikpId"));
        q.setParameter("tipeOrder", input.getSearch().get("tipeOrder"));
        if (input.getSearch().get("tipeOrder") != null) {
            if (input.getSearch().get("tipeOrder").toString().equals("PO")) {
                q.setParameter("noPo", input.getSearch().get("noPoSpk"));
                q.setParameter("noSpk", null);
            } else {
                q.setParameter("noPo", null);
                q.setParameter("noSpk", input.getSearch().get("noPoSpk"));
            }
        } else {
            q.setParameter("noPo", input.getSearch().get("noPoSpk"));
            q.setParameter("noSpk", input.getSearch().get("noPoSpk"));
        }
        q.setParameter("startPeriode", input.getSearch().get("startPeriode"));
        q.setParameter("endPeriode", input.getSearch().get("endPeriode"));
        return q;
    }

    public final static String ORDER_TABLE_IKP(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString().toLowerCase()) {
                case "idsupplier":
                    order.append(" A.SUPPLY_ID ");
                    break;
                case "namasupplier":
                    order.append(" A.SUPPLY_DESC ");
                    break;
                case "orderingtype":
                    order.append(" A.TIPE_ORDER ");
                    break;
                case "nomorpospk":
                    order.append(" A.NO_PO, A.NO_SPK ");
                    break;
                case "deskripsiitem":
                    order.append(" A.DESKRIPSI_ITEM ");
                    break;
                case "plantid":
                    order.append(" A.PLANT_ID ");
                    break;
                case "nomorpengajuanlk3":
                    order.append(" A.NO_PENGAJUAN_PROYEK ");
                    break;
                case "loginpatrol":
                    order.append(" B.LOGIN_PATROL ");
                    break;
                case "status":
                    order.append(" A.STATUS ");
                    break;
                case "nrppicid":
                    order.append(" A.NRP_ID ");
                    break;
                case "namadivisi":
                    order.append(" C.DIVISI ");
                    break;
                case "namadepartemen":
                    order.append(" C.DEPARTEMEN ");
                    break;
                case "namaseksi":
                    order.append(" C.SEKSI ");
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

    public final static List<VoShowTableIkp> SET_VO_SHOW_TABLE_IKP(List<Map<String, Object>> list) {
        List<VoShowTableIkp> voList = new ArrayList<>();
        for (Map<String, Object> map : list) {
            VoShowTableIkp vo = new VoShowTableIkp();
            vo.setIkpId((String) map.get("IKP_ID"));
            vo.setKategoriPekerjaan((String) map.get("KAT_PEKERJAAN"));
            vo.setKategoriIzinKerja((String) map.get("KAT_IZIN_KERJA"));
            vo.setDeskripsiItem((String) map.get("DESKRIPSI_ITEM"));
            vo.setTipeOrder((String) map.get("TIPE_ORDER"));
            if (((String) map.get("TIPE_ORDER")).equals("PO")) {
                vo.setNomorPoSpk((String) map.get("NO_PO"));
            } else {
                vo.setNomorPoSpk((String) map.get("NO_SPK"));
            }
            vo.setPlantId((String) map.get("PLANT_ID"));
            vo.setNomorPengajuanProyek((String) map.get("NO_PENGAJUAN_PROYEK"));
            vo.setNrpPic((BigDecimal) map.get("NRP_ID"));
            vo.setPurchasingOrganization((String) map.get("PURCHASING_ORG"));
            vo.setIdSupplier((String) map.get("SUPPLY_ID"));
            vo.setNamaSupplier((String) map.get("SUPPLY_DESC"));
            vo.setLoginPatrol((String) map.get("LOGIN_PATROL"));
            vo.setNamaPic((String) map.get("NAMA"));
            vo.setDepartemen((String) map.get("DEPARTEMEN"));
            vo.setSeksi((String) map.get("SEKSI"));
            vo.setDivisi((String) map.get("DIVISI"));
            switch ((String) map.get("STATUS")) {
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
            vo.setStartJob((Date) map.get("START_JOB"));
            vo.setEndJob((Date) map.get("END_JOB"));
            voList.add(vo);
        }
        return voList;
    }
    
    public static final String[] SUPPLIER_COLUMN_NAME = {
        "SUPPLY_ID",
        "SUPPLY_DESC"
    };
    
    public static final String LOV_SUPPLIER_MAINTENANCE_QUERY = 
            "SELECT SUPPLY_ID, SUPPLY_DESC FROM HEADER_IKP "
            + "WHERE (:supplyId IS NULL OR "
            + "SUPPLY_ID LIKE (CONCAT(CONCAT('%',:supplyId),'%'))) " 
            + "AND (:supplyDesc IS NULL OR "
            + "SUPPLY_DESC LIKE (CONCAT(CONCAT('%', :supplyDesc), '%'))) ";
    
    public final static Query FILTER_LOV_SUPPLIER_MAINTENANCE(Query q, DtoParamPaging input) {
        q.setParameter("supplyId", input.getSearch().get("supplyId"));
        q.setParameter("supplyDesc", input.getSearch().get("supplyDesc"));
        return q;
    }
    
    public final static String ORDER_LOV_SUPPLIER_MAINTENANCE(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString().toLowerCase()) {
                case "idsupplier":
                    order.append(" SUPPLY_ID ");
                    break;
                case "namasupplier":
                    order.append(" SUPPLY_DESC ");
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
   
   public final static List<VoLovSupplier> SET_VO_LOV_SUPPLIER_MAINTENANCE(List<Map<String, Object>> list) {
       List<VoLovSupplier> voList = new ArrayList<>();
       for (Map<String, Object> map : list) {
           VoLovSupplier vo = new VoLovSupplier();
           vo.setSupplyId((String) map.get("SUPPLY_ID"));
           vo.setSupplyDesc((String) map.get("SUPPLY_DESC"));
           voList.add(vo);
       }
       
       return voList;
   }
   
   public final static Query SET_OFFSET(Query q, DtoParamPaging input) {
        if (input != null && input.getLimit() >= 0 && input.getOffset() >= 0) {
            q.setFirstResult(input.getOffset());
            q.setMaxResults(input.getLimit());
        }
        return q;
    }

    public final static String SELECT_COUNT(String input) {
        StringBuffer sb = new StringBuffer();
        sb.append(" SELECT COUNT(*) FROM (");
        sb.append(input);
        sb.append(" )");
        String selectCount = sb.toString();
        return selectCount;
    }

}
