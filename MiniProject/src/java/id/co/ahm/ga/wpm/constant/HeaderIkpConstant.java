package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoLovIkpId;
import id.co.ahm.ga.wpm.vo.VoLovPic;
import id.co.ahm.ga.wpm.vo.VoLovPo;
import id.co.ahm.ga.wpm.vo.VoLovSupplier;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;

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
            switch (input.getSort().toString()) {
                case "idSupplier":
                    order.append(" A.SUPPLY_ID ");
                    break;
                case "namaSupplier":
                    order.append(" A.SUPPLY_DESC ");
                    break;
                case "tipeOrder":
                    order.append(" A.TIPE_ORDER ");
                    break;
                case "nomorPoSpk":
                    order.append(" A.NO_PO, A.NO_SPK ");
                    break;
                case "deskripsiItem":
                    order.append(" A.DESKRIPSI_ITEM ");
                    break;
                case "plantId":
                    order.append(" A.PLANT_ID ");
                    break;
                case "nomorPengajuanProyek":
                    order.append(" A.NO_PENGAJUAN_PROYEK ");
                    break;
                case "loginPatrol":
                    order.append(" B.LOGIN_PATROL ");
                    break;
                case "status":
                    order.append(" A.STATUS ");
                    break;
                case "nrpId":
                    order.append(" A.NRP_ID ");
                    break;
                case "divisi":
                    order.append(" C.DIVISI ");
                    break;
                case "departemen":
                    order.append(" C.DEPARTEMEN ");
                    break;
                case "seksi":
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

    public static final String LOV_SUPPLIER_MAINTENANCE_QUERY
            = "SELECT SUPPLY_ID, SUPPLY_DESC FROM HEADER_IKP "
            + "WHERE (:supplyId IS NULL OR "
            + "LOWER(SUPPLY_ID) LIKE LOWER(CONCAT(CONCAT('%',:supplyId),'%'))) "
            + "OR (:supplyDesc IS NULL OR "
            + "LOWER(SUPPLY_DESC) LIKE LOWER(CONCAT(CONCAT('%', :supplyDesc), '%'))) ";

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

    public static final String[] PIC_COLUMN_NAME = {
        "NRP_ID",
        "NAMA"
    };

    public static final String LOV_PIC_MAINTENANCE_QUERY
            = " SELECT B.NRP_ID, B.NAMA "
            + " FROM HEADER_IKP A JOIN PIC B "
            + " ON A.NRP_ID = B.NRP_ID "
            + " WHERE (:nrpId IS NULL OR "
            + " LOWER(B.NRP_ID) LIKE LOWER(CONCAT(CONCAT('%',:nrpId),'%'))) "
            + " OR (:nama IS NULL OR "
            + " LOWER(B.NAMA) LIKE LOWER(CONCAT(CONCAT('%',:nama),'%'))) ";

    public final static Query FILTER_LOV_PIC_MAINTENANCE(Query q, DtoParamPaging input) {
        q.setParameter("nrpId", input.getSearch().get("nrpId"));
        q.setParameter("nama", input.getSearch().get("nama"));
        return q;
    }

    public final static String ORDER_LOV_PIC_MAINTENANCE(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString().toLowerCase()) {
                case "nrpId":
                    order.append(" NRP_ID ");
                    break;
                case "nama":
                    order.append(" NAMA ");
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

    public final static List<VoLovPic> SET_VO_LOV_PIC_MAINTENANCE(List<Map<String, Object>> list) {
        List<VoLovPic> voList = new ArrayList<>();
        for (Map<String, Object> map : list) {
            VoLovPic vo = new VoLovPic();
            vo.setNrpId((String) map.get("NRP_ID"));
            vo.setNama((String) map.get("NAMA"));
            voList.add(vo);
        }

        return voList;
    }

    public static final String[] PO_COLUMN_NAME = {
        "NO_PO",
        "PO_DESC"
    };

    public static final String LOV_PO_MAINTENANCE_QUERY
            = " SELECT B.NO_PO, B.PO_DESC "
            + " FROM HEADER_IKP A JOIN PURCHASING_ORDER B "
            + " ON A.NO_PO = B.NO_PO"
            + " WHERE (:noPo IS NULL OR "
            + " LOWER(B.NO_PO) LIKE LOWER(CONCAT(CONCAT('%',:noPo),'%'))) "
            + " OR (:poDesc IS NULL OR "
            + " LOWER(B.PO_DESC) LIKE LOWER(CONCAT(CONCAT('%',:poDesc),'%'))) ";

    public final static Query FILTER_LOV_PO_MAINTENANCE(Query q, DtoParamPaging input) {
        q.setParameter("noPo", input.getSearch().get("noPo"));
        q.setParameter("poDesc", input.getSearch().get("poDesc"));
        return q;
    }

    public final static String ORDER_LOV_PO_MAINTENANCE(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString().toLowerCase()) {
                case "noPo":
                    order.append(" B.NO_PO ");
                    break;
                case "poDesc":
                    order.append(" B.PO_DESC ");
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

    public final static List<VoLovPo> SET_VO_LOV_PO_MAINTENANCE(List<Map<String, Object>> list) {
        List<VoLovPo> voList = new ArrayList<>();
        for (Map<String, Object> map : list) {
            VoLovPo vo = new VoLovPo();
            vo.setNoPo((String) map.get("NO_PO"));
            vo.setPoDesc((String) map.get("PO_DESC"));
            voList.add(vo);
        }

        return voList;
    }
    
    public static final String[] LOV_IKP_ID_COLUMN = {
        "IKP_ID",
        "PROJECT_DETAIL"
    };

    public static final String LOV_IKP_ID_QUERY
            = " SELECT IKP_ID, PROJECT_DETAIL FROM HEADER_IKP "
            + " WHERE (:ikpId IS NULL OR "
            + " LOWER(IKP_ID) LIKE LOWER(CONCAT(CONCAT('%',:ikpId),'%'))) "
            + " OR (:projectDetail IS NULL OR "
            + " LOWER(PROJECT_DETAIL) LIKE LOWER(CONCAT(CONCAT('%',:projectDetail),'%'))) ";

    public final static Query FILTER_LOV_IKP_ID(Query q, DtoParamPaging input) {
        q.setParameter("ikpId", input.getSearch().get("ikpId"));
        q.setParameter("projectDetail", input.getSearch().get("projectDetail"));
        return q;
    }

    public final static String ORDER_LOV_IKP_ID(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString().toLowerCase()) {
                case "ikpId":
                    order.append(" IKP_ID ");
                    break;
                case "projectDetail":
                    order.append(" PROJECT_DETAIL");
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

    public final static List<VoLovIkpId> SET_VO_LOV_IKP_ID(List<Map<String, Object>> list) {
        List<VoLovIkpId> voList = new ArrayList<>();
        for (Map<String, Object> map : list) {
            VoLovIkpId vo = new VoLovIkpId();
            vo.setIkpId((String) map.get("IKP_ID"));
            vo.setProjectDetail((String) map.get("PROJECT_DETAIL"));
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
