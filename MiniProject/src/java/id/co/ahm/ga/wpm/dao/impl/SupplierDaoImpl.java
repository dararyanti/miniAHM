/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.constant.SupplierConstant;
import id.co.ahm.ga.wpm.dao.SupplierDao;
import id.co.ahm.ga.wpm.model.Supplier;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.vo.VoLovSupplier;
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
@Repository("supplierDao")
public class SupplierDaoImpl extends DefaultHibernateDao<Supplier, String> implements SupplierDao {

    @Override
    public List<VoLovSupplier> getLovSupplier(DtoParamPaging input) {
        String sql = SupplierConstant.LOV_SUPPLIER_QUERY;
        sql = SupplierConstant.ORDER_LOV_SUPPLIER(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = SupplierConstant.FILTER_LOV_SUPPLIER(q, input);
        q = SupplierConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < SupplierConstant.SUPPLIER_COLUMN_NAME.length; i++) {
                map.put(SupplierConstant.SUPPLIER_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovSupplier> voList = SupplierConstant.SET_VO_LOV_SUPPLIER(list);
        return voList;
    }

    @Override
    public int getCountLovSupplier(DtoParamPaging input) {
        String countSupplier = SupplierConstant.SELECT_COUNT(SupplierConstant.LOV_SUPPLIER_QUERY);
        Query q = getCurrentSession().createSQLQuery(countSupplier);
        q = SupplierConstant.FILTER_LOV_SUPPLIER(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

}
