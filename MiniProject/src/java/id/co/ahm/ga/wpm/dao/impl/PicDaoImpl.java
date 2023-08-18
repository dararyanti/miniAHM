package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.constant.PicConstant;
import id.co.ahm.ga.wpm.dao.PicDao;
import id.co.ahm.ga.wpm.model.Pic;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.vo.VoLovPic;
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
@Repository("picDao")
public class PicDaoImpl extends DefaultHibernateDao<Pic, String> implements PicDao {

    @Override
    public List<VoLovPic> getLovPic(DtoParamPaging input) {
        String sql = PicConstant.LOV_PIC_QUERY;
        sql = PicConstant.ORDER_LOV_PIC(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = PicConstant.FILTER_LOV_PIC(q, input);
        q = PicConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < PicConstant.PIC_COLUMN_NAME.length; i++) {
                map.put(PicConstant.PIC_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovPic> voList = PicConstant.SET_VO_LOV_PIC(list);
        return voList;
    }

    @Override
    public int getCountLovPic(DtoParamPaging input) {
        String count = PicConstant.SELECT_COUNT(PicConstant.LOV_PIC_QUERY);
        Query q = getCurrentSession().createSQLQuery(count);
        q = PicConstant.FILTER_LOV_PIC(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

}
