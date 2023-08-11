package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.model.AreaPekerjaan;
import id.co.ahm.ga.wpm.model.AreaPekerjaanPk;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import org.springframework.stereotype.Repository;
import id.co.ahm.ga.wpm.dao.AreaPekerjaanDao;

/**
 *
 * @author Irzan Maulana
 */
@Repository("AreaPekerjaanDao")
public class AreaPekerjaanDaoImpl extends DefaultHibernateDao<AreaPekerjaan, AreaPekerjaanPk> implements AreaPekerjaanDao {
}