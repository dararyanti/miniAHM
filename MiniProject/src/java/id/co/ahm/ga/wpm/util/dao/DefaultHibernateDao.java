package id.co.ahm.ga.wpm.util.dao;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.BaseColumnFilterDao;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.util.impl.DefaultEntityImpl;
import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.util.Date;
import java.util.List;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

/**
 *
 * @author Irzan Maulana
 */
public class DefaultHibernateDao<T, K extends Serializable> extends BaseColumnFilterDao implements DefaultDao<T, K> {

    @Autowired
    @Qualifier("sessionFactory")
    private SessionFactory sessionFactory;

    private Class<T> persistentClass;

    public SessionFactory getSessionFactory() {
        return sessionFactory;
    }

    public DefaultHibernateDao() {
        persistentClass = (Class<T>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }

    protected Session getCurrentSession() {
        return sessionFactory.getCurrentSession();
    }
    
//    protected Session getCurrentSession() {
//        HttpServletRequest request = ((ServletRequestAttributes)RequestContextHolder.getRequestAttributes()).getRequest();
//        String srvc = ""+request.getRequestURL();
//        String[] service = srvc.split("/");
//        
//        String appsName = service[4].substring(0, 6) + service[7];
//                
//        Session session = sessionFactory.getCurrentSession();
//        session
//                .createSQLQuery("call DBMS_APPLICATION_INFO.SET_MODULE('" + appsName + "','" + service[8] + "')")
//                .executeUpdate();
//        
//        return sessionFactory.getCurrentSession();
//    }

    @Override
    public T load(K key) {
        return (T) sessionFactory.getCurrentSession().load(persistentClass, key);
    }

    @Override
    public T findOne(K key) {
        return (T) sessionFactory.getCurrentSession().get(persistentClass, key);
    }

    @Override
    public List<T> findAll() {
        return getCurrentSession().createQuery("from " + persistentClass.getName()).list();
    }

    @Override
    public boolean deleteById(K key) {
        Object entity = getCurrentSession().get(persistentClass, key);
        getCurrentSession().delete(entity);
        return true;
    }

    @Override
    public boolean delete(DefaultEntityImpl deletedEntity) {
        getCurrentSession().delete(deletedEntity);
        return true;
    }

    @Override
    public boolean evict(Object entity) {
        getCurrentSession().evict(entity);
        return true;
    }

    @Override
    public void flush() {
        getCurrentSession().flush();
    }

    @Override
    public void clear() {
        getCurrentSession().clear();
    }

    public Criterion buildResctrictionsAndForAllProperty(String[] listProp, String[] listValueLike) {
        Criterion criterion = null;
        for (String valueLike : listValueLike) {
            if (criterion == null) {
                criterion = buildResctrictionsOrForAllProperty(listProp, valueLike);
            } else {
                criterion = Restrictions.and(criterion, buildResctrictionsOrForAllProperty(listProp, valueLike));
            }
        }
        return criterion;
    }

    public Criterion buildResctrictionsOrForAllProperty(String[] listProp, String valueLike) {
        Criterion criterion = null;
        for (String prop : listProp) {
            if (criterion == null) {
                criterion = Restrictions.ilike(prop, valueLike, MatchMode.ANYWHERE);
            } else {
                String valueLikeTemp = null;
                valueLikeTemp = valueLike;
                criterion = Restrictions.or(criterion, Restrictions.ilike(prop, valueLikeTemp, MatchMode.ANYWHERE));
            }
        }
        return criterion;
    }

    @Override
    public boolean save(T newEntity) {
        getCurrentSession().save(newEntity);
        return true;
    }    
    
    @Override
    public boolean save(DefaultEntityImpl newEntity, String user) {
        Date date = new Date();
        newEntity.setCreateBy(user);
        newEntity.setCreateDate(date);
//        newEntity.setLastModBy(user);
//        newEntity.setLastModDate(date);
        getCurrentSession().save(newEntity);
        return true;
    }
    
    @Override
    public boolean update(T editedEntity) {
        getCurrentSession().update(editedEntity);
        return true;
    }

    @Override
    public boolean update(DefaultEntityImpl editedEntity, String user) {
        editedEntity.setLastModBy(user);
        editedEntity.setLastModDate(new Date());
        getCurrentSession().update(editedEntity);
        return true;
    }

    @Override
    public int count(DtoParamPaging param) {
        
//        Criteria count = getCriteria(param);
//        count.setProjection(Projections.rowCount());
//        Long total = (Long) count.uniqueResult();    
//        
//        return total.intValue();
        

        Criteria c = getCriteria(param);
        c.setFirstResult(0);
        c.setMaxResults(0);
        c.setProjection(Projections.rowCount());
        c.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
        Long resultCount = (Long)c.uniqueResult();
        Integer total = Integer.parseInt(Long.toString(resultCount));
        return total;
    }

    @Override
    public Criteria getCriteria(DtoParamPaging param) {
        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }
}
