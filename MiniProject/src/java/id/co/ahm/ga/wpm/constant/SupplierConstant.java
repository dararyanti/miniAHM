/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoLovSupplier;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;

/**
 *
 * @author USER
 */
public class SupplierConstant {
    
    public static final String[] SUPPLIER_COLUMN_NAME = {
        "SUPPLY_ID",
        "SUPPLY_DESC"
    };
    
    public static final String LOV_SUPPLIER_QUERY = 
            "SELECT SUPPLY_ID, SUPPLY_DESC FROM SUPPLIER "
            + "WHERE (:supplyId IS NULL OR "
            + "LOWER(SUPPLY_ID) LIKE LOWER(CONCAT(CONCAT('%',:supplyId),'%'))) " 
            + "OR (:supplyDesc IS NULL OR "
            + "LOWER(SUPPLY_DESC) LIKE LOWER(CONCAT(CONCAT('%', :supplyDesc), '%'))) ";
    
    public final static Query FILTER_LOV_SUPPLIER(Query q, DtoParamPaging input) {
        q.setParameter("supplyId", input.getSearch().get("supplyId"));
        q.setParameter("supplyDesc", input.getSearch().get("supplyDesc"));
        return q;
    }
    
    public final static String ORDER_LOV_SUPPLIER(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString()) {
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
   
   public final static List<VoLovSupplier> SET_VO_LOV_SUPPLIER(List<Map<String, Object>> list) {
       List<VoLovSupplier> voList = new ArrayList<>();
       for (Map<String, Object> map : list) {
           VoLovSupplier vo = new VoLovSupplier();
           vo.setSupplyId((String) map.get("SUPPLY_ID"));
           vo.setSupplyDesc((String) map.get("SUPPLY_DESC"));
           voList.add(vo);
       }
       
       return voList;
   }
}
