package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.constant.AreaPekerjaanConstant;
import id.co.ahm.ga.wpm.model.AreaPekerjaan;
import id.co.ahm.ga.wpm.model.AreaPekerjaanPk;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import org.springframework.stereotype.Repository;
import id.co.ahm.ga.wpm.dao.AreaPekerjaanDao;
import id.co.jxf.security.vo.VoPstUserCred;
import java.util.List;
import org.hibernate.query.Query;
/**
 *
 * @author Irzan Maulana
 */
@Repository("areaPekerjaanDao")
public class AreaPekerjaanDaoImpl extends DefaultHibernateDao<AreaPekerjaan, AreaPekerjaanPk> implements AreaPekerjaanDao {
    
    @Override
    public List<Object[]> findNomorAssetAreaPekerjaanByIkpId(String ikpId, VoPstUserCred voPstUserCred) {

        String sql = AreaPekerjaanConstant.FIND_NOMOR_ASSET_AREA_PEKERJAAN_BY_IKP_ID_QUERY;

        Query query = getCurrentSession().createSQLQuery(sql);
        query = AreaPekerjaanConstant.FILTER_FIND_NOMOR_ASSET_AREA_PEKERJAAN_BY_IKP_ID(query, ikpId);

        return query.list();

    }

}