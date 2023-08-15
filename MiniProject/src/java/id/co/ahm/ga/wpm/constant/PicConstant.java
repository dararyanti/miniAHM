/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoLovPic;
import id.co.ahm.ga.wpm.vo.VoLovSupplier;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.hibernate.query.Query;

/**
 *
 * @author USER
 */
public class PicConstant {
    
    public static final String[] PIC_COLUMN_NAME = {
        "NRP_ID",
        "NAMA",
        "DEPARTEMEN",
        "SEKSI",
        "DIVISI"
    };
    
    public static final String LOV_PIC_QUERY =
            " SELECT NRP_ID, NAMA FROM PIC "
            + " WHERE (:nrpId IS NULL OR "
            + " NRP_ID LIKE (CONCAT(CONCAT('%',:nrpId),'%'))) "
            + " AND (:nama IS NULL "
            + " OR NAMA LIKE (CONCAT(CONCAT('%',:nama),'%'))) ";
    
    public final static Query FILTER_LOV_PIC(Query q, DtoParamPaging input) {
        q.setParameter("nrpId", input.getSearch().get("nrpId"));
        q.setParameter("nama", input.getSearch().get("nama"));
        return q;
    }
    
    public final static String ORDER_LOV_PIC(String sql, DtoParamPaging input) {
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
   
   public final static List<VoLovPic> SET_VO_LOV_SUPPLIER(List<Map<String, Object>> list) {
       List<VoLovPic> voList = new ArrayList<>();
       for (Map<String, Object> map : list) {
           VoLovPic vo = new VoLovPic();
           vo.setNrpId((String) map.get("NRP_ID"));
           vo.setNama((String) map.get("NAMA"));
           voList.add(vo);
       }
       
       return voList;
   }
    
}
