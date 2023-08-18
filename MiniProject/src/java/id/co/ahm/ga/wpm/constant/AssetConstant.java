/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoLovAsset;
import id.co.ahm.ga.wpm.vo.VoLovPic;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;

/**
 *
 * @author USER
 */
public class AssetConstant {

    public static final String[] ASSET_COLUMN_NAME = {
        "NO_ASSET",
        "DESC_ASSET"
    };

    public static final String LOV_ASSET_QUERY
            = " SELECT NO_ASSET, DESC_ASSET FROM ASSET "
            + " WHERE (:plantVar = PLANT_VAR) "
            + " AND ((:noAsset IS NULL OR "
            + " LOWER(NO_ASSET) LIKE LOWER(CONCAT(CONCAT('%',:noAsset),'%')))"
            + " OR (:descAsset IS NULL OR "
            + " LOWER(DESC_ASSET) LIKE LOWER(CONCAT(CONCAT('%',:descAsset),'%')))) ";
    
    public final static Query FILTER_LOV_ASSET(Query q, DtoParamPaging input) {
        q.setParameter("plantVar", input.getSearch().get("plantVar"));
        q.setParameter("noAsset", input.getSearch().get("noAsset"));
        q.setParameter("descAsset", input.getSearch().get("descAsset"));
        return q;
    }
    
    public final static String ORDER_LOV_ASSET(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString()) {
                case "noAsset":
                    order.append(" NO_ASSET ");
                    break;
                case "descAsset":
                    order.append(" DESC_ASSET ");
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
    
    public final static List<VoLovAsset> SET_VO_LOV_ASSET(List<Map<String, Object>> list) {
       List<VoLovAsset> voList = new ArrayList<>();
       for (Map<String, Object> map : list) {
           VoLovAsset vo = new VoLovAsset();
           vo.setNoAsset((String) map.get("NO_ASSET"));
           vo.setDescAsset((String) map.get("DESC_ASSET"));
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
