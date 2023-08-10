package id.co.ahm.ga.wpm.util.dao;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.impl.DefaultEntityImpl;
import java.io.Serializable;
import java.util.List;
import org.hibernate.Criteria;

/**
 *
 * @author Irzan Maulana
 */
public interface DefaultDao<T, K extends Serializable> {

    public T load(K key);

    public T findOne(K key);

    public List<T> findAll();

    public boolean deleteById(K key);

    public boolean delete(DefaultEntityImpl deletedEntity);

    public boolean save(T newEntity);
    public boolean save(DefaultEntityImpl newEntity, String user);

    public boolean evict(Object entity);

    public boolean update(T newEntity);
    public boolean update(DefaultEntityImpl editedEntity, String user);

    public void flush();

    public void clear();
    
    public int count(DtoParamPaging param);
    public abstract Criteria getCriteria(DtoParamPaging param);
}
