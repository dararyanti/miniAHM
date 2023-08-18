/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoLovPlant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;

/**
 *
 * @author USER
 */
public class PlantConstant {

    public static final String[] PLANT_COLUMN_NAME = {
        "PLANT_VAR",
        "PLANT_DESC"
    };

    public static final String LOV_PLANT_QUERY
            = " SELECT PLANT_VAR, PLANT_DESC FROM PLANT "
            + " WHERE (:plantVar IS NULL OR "
            + " LOWER(PLANT_VAR) LIKE LOWER(CONCAT(CONCAT('%',:plantVar),'%'))) "
            + " OR (:plantDesc IS NULL OR "
            + " LOWER(PLANT_DESC) LIKE LOWER(CONCAT(CONCAT('%',:plantDesc),'%'))) ";
    
    public final static Query FILTER_LOV_PLANT(Query q, DtoParamPaging input) {
        q.setParameter("plantVar", input.getSearch().get("plantVar"));
        q.setParameter("plantDesc", input.getSearch().get("plantDesc"));
        return q;
    }
    
    public final static String ORDER_LOV_PLANT(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString()) {
                case "plantVar":
                    order.append(" PLANT_VAR ");
                    break;
                case "plantDesc":
                    order.append(" PLANT_DESC ");
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
    
    public final static List<VoLovPlant> SET_VO_LOV_PLANT(List<Map<String, Object>> list) {
       List<VoLovPlant> voList = new ArrayList<>();
       for (Map<String, Object> map : list) {
           VoLovPlant vo = new VoLovPlant();
           vo.setPlantVar((String) map.get("PLANT_VAR"));
           vo.setPlantDesc((String) map.get("PLANT_DESC"));
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
