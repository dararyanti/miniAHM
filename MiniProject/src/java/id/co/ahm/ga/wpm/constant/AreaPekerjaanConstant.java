/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoShowAreaPekerjaan;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;

/**
 *
 * @author Irzan Maulana
 */
public class AreaPekerjaanConstant {

    public static final String FIND_NOMOR_ASSET_AREA_PEKERJAAN_BY_IKP_ID_QUERY
            = "SELECT "
            + " IKP_ID, "
            + " ASSET_NO "
            + " FROM AREA_PEKERJAAN "
            + " WHERE IKP_ID = :ikpId ";

    public final static Query FILTER_FIND_NOMOR_ASSET_AREA_PEKERJAAN_BY_IKP_ID(Query q, String ikpId) {
        q.setParameter("ikpId", ikpId);
        return q;
    }

    public static final String[] AREA_TABEL_COLUMN_NAME = {
        "ASSET_NO",
        "AREA_DETAIL",
        "IN_OUT",
        "CRITICALITY",
        "TASK_LIST"
    };

    public static final String AREA_TABEL_QUERY
            = " SELECT ASSET_NO, AREA_DETAIL, IN_OUT, CRITICALITY, TASK_LIST FROM AREA_PEKERJAAN "
            + " WHERE IKP_ID = :ikpId ";

    public final static Query FILTER_AREA_TABEL(Query q, DtoParamPaging input) {
        q.setParameter("ikpId", input.getSearch().get("ikpId"));
        return q;
    }

    public final static String ORDER_AREA_TABEL(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString().toLowerCase()) {
                case "assetNo":
                    order.append(" ASSET_NO ");
                    break;
                case "areaDetail":
                    order.append(" AREA_DETAIL ");
                    break;
                case "inOut":
                    order.append(" IN_OUT ");
                    break;
                case "criticality":
                    order.append(" CRITICALITY ");
                    break;
                case "taskList":
                    order.append(" TASK_LIST ");
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

    public final static List<VoShowAreaPekerjaan> SET_VO_AREA_TABEL(List<Map<String, Object>> list) {
        List<VoShowAreaPekerjaan> voList = new ArrayList<>();
        for (Map<String, Object> map : list) {
            VoShowAreaPekerjaan vo = new VoShowAreaPekerjaan();
            vo.setAssetNo((String) map.get("ASSET_NO"));
            vo.setAreaDetail((String) map.get("AREA_DETAIL"));
            vo.setInOut((String) map.get("IN_OUT"));
            vo.setCriticality((String) map.get("CRITICALITY"));
            vo.setTaskList((String) map.get("TASK_LIST"));
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
