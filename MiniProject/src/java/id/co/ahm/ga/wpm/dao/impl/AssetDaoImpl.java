/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.constant.AssetConstant;
import id.co.ahm.ga.wpm.dao.AssetDao;
import id.co.ahm.ga.wpm.model.Asset;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.vo.VoLovAsset;
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
@Repository("assetDao")
public class AssetDaoImpl extends DefaultHibernateDao<Asset, String> implements AssetDao {

    @Override
    public List<VoLovAsset> getLovAsset(DtoParamPaging input) {
        String sql = AssetConstant.LOV_ASSET_QUERY;
        sql = AssetConstant.ORDER_LOV_ASSET(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = AssetConstant.FILTER_LOV_ASSET(q, input);
        q = AssetConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < AssetConstant.ASSET_COLUMN_NAME.length; i++) {
                map.put(AssetConstant.ASSET_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovAsset> voList = AssetConstant.SET_VO_LOV_ASSET(list);
        return voList;
    }

    @Override
    public int getCountLovAsset(DtoParamPaging input) {
        String count = AssetConstant.SELECT_COUNT(AssetConstant.LOV_ASSET_QUERY);
        Query q = getCurrentSession().createSQLQuery(count);
        q = AssetConstant.FILTER_LOV_ASSET(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

}
