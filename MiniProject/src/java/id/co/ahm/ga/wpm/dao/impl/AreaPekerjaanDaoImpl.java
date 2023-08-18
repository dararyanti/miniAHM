package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.constant.AreaPekerjaanConstant;
import id.co.ahm.ga.wpm.model.AreaPekerjaan;
import id.co.ahm.ga.wpm.model.AreaPekerjaanPk;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import org.springframework.stereotype.Repository;
import id.co.ahm.ga.wpm.dao.AreaPekerjaanDao;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoShowAreaPekerjaan;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;
/**
 *
 * @author Irzan Maulana
 */
@Repository("areaPekerjaanDao")
public class AreaPekerjaanDaoImpl extends DefaultHibernateDao<AreaPekerjaan, AreaPekerjaanPk> implements AreaPekerjaanDao {
    
    @Override
    public List<Object[]> findNomorAssetAreaPekerjaanByIkpId(String ikpId) {

        String sql = AreaPekerjaanConstant.FIND_NOMOR_ASSET_AREA_PEKERJAAN_BY_IKP_ID_QUERY;

        Query query = getCurrentSession().createSQLQuery(sql);
        query = AreaPekerjaanConstant.FILTER_FIND_NOMOR_ASSET_AREA_PEKERJAAN_BY_IKP_ID(query, ikpId);

        return query.list();

    }

    @Override
    public List<VoShowAreaPekerjaan> getTabelArea(DtoParamPaging input) {
        String sql = AreaPekerjaanConstant.AREA_TABEL_QUERY;
        sql = AreaPekerjaanConstant.ORDER_AREA_TABEL(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = AreaPekerjaanConstant.FILTER_AREA_TABEL(q, input);
        q = AreaPekerjaanConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < AreaPekerjaanConstant.AREA_TABEL_COLUMN_NAME.length; i++) {
                map.put(AreaPekerjaanConstant.AREA_TABEL_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoShowAreaPekerjaan> voList = AreaPekerjaanConstant.SET_VO_AREA_TABEL(list);
        return voList;
    }

    @Override
    public int getCountTabelArea(DtoParamPaging input) {
        String count = AreaPekerjaanConstant.SELECT_COUNT(AreaPekerjaanConstant.AREA_TABEL_QUERY);
        Query q = getCurrentSession().createSQLQuery(count);
        q = AreaPekerjaanConstant.FILTER_AREA_TABEL(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

}