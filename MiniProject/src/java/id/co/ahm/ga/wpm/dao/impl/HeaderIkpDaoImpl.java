package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.constant.HeaderIkpConstant;
import id.co.ahm.ga.wpm.model.HeaderIkp;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.hibernate.Query;
import org.springframework.stereotype.Repository;
import id.co.ahm.ga.wpm.dao.HeaderIkpDao;
import id.co.ahm.ga.wpm.vo.VoLovIkpId;
import id.co.ahm.ga.wpm.vo.VoLovPic;
import id.co.ahm.ga.wpm.vo.VoLovPo;
import id.co.ahm.ga.wpm.vo.VoLovSupplier;

/**
 *
 * @author Irzan Maulana
 */
@Repository("headerIkpDao")
public class HeaderIkpDaoImpl extends DefaultHibernateDao<HeaderIkp, String> implements HeaderIkpDao {

    @Override
    public int getCountTableIkp(DtoParamPaging input) {
        String countIkp = HeaderIkpConstant.SELECT_COUNT(HeaderIkpConstant.IKP_TABLE_QUERY);
        Query q = getCurrentSession().createSQLQuery(countIkp);
        q = HeaderIkpConstant.FILTER_TABLE_IKP(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

    @Override
    public List<VoShowTableIkp> getTableIkp(DtoParamPaging input) {
        String sql = HeaderIkpConstant.IKP_TABLE_QUERY;
        sql = HeaderIkpConstant.ORDER_TABLE_IKP(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = HeaderIkpConstant.FILTER_TABLE_IKP(q, input);
        q = HeaderIkpConstant.SET_OFFSET(q, input);
        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < HeaderIkpConstant.IKP_TABLE_COLUMN_NAME.length; i++) {
                map.put(HeaderIkpConstant.IKP_TABLE_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoShowTableIkp> voList = HeaderIkpConstant.SET_VO_SHOW_TABLE_IKP(list);
        return voList;
    }

    @Override
    public List<VoLovSupplier> getLovSupplierMaintenance(DtoParamPaging input) {
        String sql = HeaderIkpConstant.LOV_SUPPLIER_MAINTENANCE_QUERY;
        sql = HeaderIkpConstant.ORDER_LOV_SUPPLIER_MAINTENANCE(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = HeaderIkpConstant.FILTER_LOV_SUPPLIER_MAINTENANCE(q, input);
        q = HeaderIkpConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < HeaderIkpConstant.SUPPLIER_COLUMN_NAME.length; i++) {
                map.put(HeaderIkpConstant.SUPPLIER_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovSupplier> voList = HeaderIkpConstant.SET_VO_LOV_SUPPLIER_MAINTENANCE(list);
        return voList;
    }

    @Override
    public int getCountLovSupplierMaintenance(DtoParamPaging input) {
        String countSupplier = HeaderIkpConstant.SELECT_COUNT(HeaderIkpConstant.LOV_SUPPLIER_MAINTENANCE_QUERY);
        Query q = getCurrentSession().createSQLQuery(countSupplier);
        q = HeaderIkpConstant.FILTER_LOV_SUPPLIER_MAINTENANCE(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

    @Override
    public List<VoLovPic> getLovPicMaintenance(DtoParamPaging input) {
        String sql = HeaderIkpConstant.LOV_PIC_MAINTENANCE_QUERY;
        sql = HeaderIkpConstant.ORDER_LOV_PIC_MAINTENANCE(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = HeaderIkpConstant.FILTER_LOV_PIC_MAINTENANCE(q, input);
        q = HeaderIkpConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < HeaderIkpConstant.PIC_COLUMN_NAME.length; i++) {
                map.put(HeaderIkpConstant.PIC_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovPic> voList = HeaderIkpConstant.SET_VO_LOV_PIC_MAINTENANCE(list);
        return voList;
    }

    @Override
    public int getCountLovPicMaintenance(DtoParamPaging input) {
        String count = HeaderIkpConstant.SELECT_COUNT(HeaderIkpConstant.LOV_PIC_MAINTENANCE_QUERY);
        Query q = getCurrentSession().createSQLQuery(count);
        q = HeaderIkpConstant.FILTER_LOV_SUPPLIER_MAINTENANCE(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

    @Override
    public List<VoLovPo> getLovPoMaintenance(DtoParamPaging input) {
        String sql = HeaderIkpConstant.LOV_PO_MAINTENANCE_QUERY;
        sql = HeaderIkpConstant.ORDER_LOV_PO_MAINTENANCE(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = HeaderIkpConstant.FILTER_LOV_PO_MAINTENANCE(q, input);
        q = HeaderIkpConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < HeaderIkpConstant.PO_COLUMN_NAME.length; i++) {
                map.put(HeaderIkpConstant.PO_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovPo> voList = HeaderIkpConstant.SET_VO_LOV_PO_MAINTENANCE(list);
        return voList;
    }

    @Override
    public int getCountLovPoMaintenance(DtoParamPaging input) {
        String count = HeaderIkpConstant.SELECT_COUNT(HeaderIkpConstant.LOV_PO_MAINTENANCE_QUERY);
        Query q = getCurrentSession().createSQLQuery(count);
        q = HeaderIkpConstant.FILTER_LOV_PO_MAINTENANCE(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

    @Override
    public List<String> findSequence(String plantId, String month, String year) {
        StringBuilder sb = new StringBuilder();
        sb.append(plantId);
        sb.append('/');
        sb.append(month);
        sb.append('/');
        sb.append(year);
        String sql = " SELECT IKP_ID FROM HEADER_IKP WHERE IKP_ID LIKE CONCAT(CONCAT('%',:param),'%') ";
        Query q = getCurrentSession().createSQLQuery(sql);
        q.setParameter("param", sb.toString());
        List resultList = q.list();
        List<String> result = new ArrayList<>();
        for (int i = 0; i < resultList.size(); i++) {
            result.add((String) resultList.get(i));
        }
        return result;
    }

    @Override
    public List<VoLovIkpId> getLovIkpId(DtoParamPaging input) {
        String sql = HeaderIkpConstant.LOV_IKP_ID_QUERY;
        sql = HeaderIkpConstant.ORDER_LOV_IKP_ID(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = HeaderIkpConstant.FILTER_LOV_IKP_ID(q, input);
        q = HeaderIkpConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < HeaderIkpConstant.LOV_IKP_ID_COLUMN.length; i++) {
                map.put(HeaderIkpConstant.LOV_IKP_ID_COLUMN[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovIkpId> voList = HeaderIkpConstant.SET_VO_LOV_IKP_ID(list);
        return voList;
    }

    @Override
    public int getCountLovIkpId(DtoParamPaging input) {
        String count = HeaderIkpConstant.SELECT_COUNT(HeaderIkpConstant.LOV_IKP_ID_QUERY);
        Query q = getCurrentSession().createSQLQuery(count);
        q = HeaderIkpConstant.FILTER_LOV_IKP_ID(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }
}
