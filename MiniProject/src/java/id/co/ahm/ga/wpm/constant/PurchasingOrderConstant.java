/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoLovPo;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;

/**
 *
 * @author USER
 */
public class PurchasingOrderConstant {

    public static final String[] PO_COLUMN_NAME = {
        "NO_PO",
        "PO_DESC"
    };

    public static final String LOV_PO_QUERY
            = " SELECT NO_PO, PO_DESC FROM PURCHASING_ORDER "
            + " WHERE (:noPo IS NULL OR "
            + " LOWER(NO_PO) LIKE LOWER(CONCAT(CONCAT('%',:noPo),'%'))) "
            + " OR (:poDesc IS NULL OR "
            + " LOWER(PO_DESC) LIKE LOWER(CONCAT(CONCAT('%',:poDesc),'%'))) ";
    
    public final static Query FILTER_LOV_PO(Query q, DtoParamPaging input) {
        q.setParameter("noPo", input.getSearch().get("noPo"));
        q.setParameter("poDesc", input.getSearch().get("poDesc"));
        return q;
    }
    
    public final static String ORDER_LOV_PO(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString()) {
                case "noPo":
                    order.append(" NO_PO ");
                    break;
                case "poDesc":
                    order.append(" PO_DESC ");
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
    
    public final static List<VoLovPo> SET_VO_LOV_PO(List<Map<String, Object>> list) {
       List<VoLovPo> voList = new ArrayList<>();
       for (Map<String, Object> map : list) {
           VoLovPo vo = new VoLovPo();
           vo.setNoPo((String) map.get("NO_PO"));
           vo.setPoDesc((String) map.get("PO_DESC"));
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
