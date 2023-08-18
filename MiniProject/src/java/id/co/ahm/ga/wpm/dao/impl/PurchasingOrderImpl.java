/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.constant.PurchasingOrderConstant;
import id.co.ahm.ga.wpm.dao.PurchasingOrderDao;
import id.co.ahm.ga.wpm.model.PurchasingOrder;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.vo.VoLovPo;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;

/**
 *
 * @author USER
 */
@Repository("purchasingOrderDao")
public class PurchasingOrderImpl extends DefaultHibernateDao<PurchasingOrder, String> implements PurchasingOrderDao {

    @Override
    public List<VoLovPo> getLovPo(DtoParamPaging input) {
        String sql = PurchasingOrderConstant.LOV_PO_QUERY;
        sql = PurchasingOrderConstant.ORDER_LOV_PO(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = PurchasingOrderConstant.FILTER_LOV_PO(q, input);
        q = PurchasingOrderConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < PurchasingOrderConstant.PO_COLUMN_NAME.length; i++) {
                map.put(PurchasingOrderConstant.PO_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovPo> voList = PurchasingOrderConstant.SET_VO_LOV_PO(list);
        return voList;
    }

    @Override
    public int getCountLovPo(DtoParamPaging input) {
        String count = PurchasingOrderConstant.SELECT_COUNT(PurchasingOrderConstant.LOV_PO_QUERY);
        Query q = getCurrentSession().createSQLQuery(count);
        q = PurchasingOrderConstant.FILTER_LOV_PO(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

}
