/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.constant.PlantConstant;
import id.co.ahm.ga.wpm.dao.PlantDao;
import id.co.ahm.ga.wpm.model.Plant;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.vo.VoLovPlant;
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
@Repository("plantDao")
public class PlantDaoImpl extends DefaultHibernateDao<Plant, String> implements PlantDao {

    @Override
    public List<VoLovPlant> getLovPlant(DtoParamPaging input) {
        String sql = PlantConstant.LOV_PLANT_QUERY;
        sql = PlantConstant.ORDER_LOV_PLANT(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = PlantConstant.FILTER_LOV_PLANT(q, input);
        q = PlantConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < PlantConstant.PLANT_COLUMN_NAME.length; i++) {
                map.put(PlantConstant.PLANT_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovPlant> voList = PlantConstant.SET_VO_LOV_PLANT(list);
        return voList;
    }

    @Override
    public int getCountLovPlant(DtoParamPaging input) {
        String count = PlantConstant.SELECT_COUNT(PlantConstant.LOV_PLANT_QUERY);
        Query q = getCurrentSession().createSQLQuery(count);
        q = PlantConstant.FILTER_LOV_PLANT(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

}
