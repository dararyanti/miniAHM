/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoLovTaskList;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;

/**
 *
 * @author USER
 */
public class TaskListConstant {

    public static final String[] TASK_LIST_COLUMN_NAME = {
        "KODE_TASK_LIST",
        "TITLE_TASK_LIST"
    };

    public static final String LOV_TASK_LIST_QUERY
            = " SELECT KODE_TASK_LIST, TITLE_TASK_LIST FROM TASK_LIST "
            + " WHERE (NO_ASSET = :noAsset) "
            + " AND ((:kode IS NULL OR "
            + " LOWER(KODE_TASK_LIST) LIKE LOWER(CONCAT(CONCAT('%',:kode),'%'))) "
            + " OR (:title IS NULL OR "
            + " LOWER(TITLE_TASK_LIST) LIKE LOWER(CONCAT(CONCAT('%',:title),'%')))) ";
    
    public final static Query FILTER_LOV_TASK_LIST(Query q, DtoParamPaging input) {
        q.setParameter("noAsset", input.getSearch().get("noAsset"));
        q.setParameter("kode", input.getSearch().get("kode"));
        q.setParameter("title", input.getSearch().get("title"));
        return q;
    }
    
    public final static String ORDER_LOV_TASK_LIST(String sql, DtoParamPaging input) {
        StringBuilder order = new StringBuilder();
        StringBuilder sqlString = new StringBuilder();
        sqlString.append(sql);
        if (input.getSort() != null) {
            order.append(" ORDER BY ");
            switch (input.getSort().toString().toLowerCase()) {
                case "kode":
                    order.append(" KODE_TASK_LIST ");
                    break;
                case "title":
                    order.append(" TITLE_TASK_LIST ");
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
    
    public final static List<VoLovTaskList> SET_VO_LOV_TASK_LIST(List<Map<String, Object>> list) {
       List<VoLovTaskList> voList = new ArrayList<>();
       for (Map<String, Object> map : list) {
           VoLovTaskList vo = new VoLovTaskList();
           vo.setKodeTaskList((String) map.get("KODE_TASK_LIST"));
           vo.setTitleTaskList((String) map.get("TITLE_TASK_LIST"));
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
