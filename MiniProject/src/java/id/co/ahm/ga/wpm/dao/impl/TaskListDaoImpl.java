/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.dao.impl;

import id.co.ahm.ga.wpm.constant.TaskListConstant;
import id.co.ahm.ga.wpm.dao.TaskListDao;
import id.co.ahm.ga.wpm.model.TaskList;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultHibernateDao;
import id.co.ahm.ga.wpm.vo.VoLovTaskList;
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
@Repository("taskListDao")
public class TaskListDaoImpl extends DefaultHibernateDao<TaskList, String> implements TaskListDao {

    @Override
    public List<VoLovTaskList> getLovTaskList(DtoParamPaging input) {
        String sql = TaskListConstant.LOV_TASK_LIST_QUERY;
        sql = TaskListConstant.ORDER_LOV_TASK_LIST(sql, input);
        Query q = getCurrentSession().createSQLQuery(sql);
        q = TaskListConstant.FILTER_LOV_TASK_LIST(q, input);
        q = TaskListConstant.SET_OFFSET(q, input);

        List<Object[]> results = q.list();
        List<Map<String, Object>> list = new ArrayList<>();

        for (Object[] row : results) {
            Map<String, Object> map = new HashMap<>();
            for (int i = 0; i < TaskListConstant.TASK_LIST_COLUMN_NAME.length; i++) {
                map.put(TaskListConstant.TASK_LIST_COLUMN_NAME[i], row[i]);
            }
            list.add(map);
        }
        List<VoLovTaskList> voList = TaskListConstant.SET_VO_LOV_TASK_LIST(list);
        return voList;
    }

    @Override
    public int getCountLovTaskList(DtoParamPaging input) {
        String count = TaskListConstant.SELECT_COUNT(TaskListConstant.LOV_TASK_LIST_QUERY);
        Query q = getCurrentSession().createSQLQuery(count);
        q = TaskListConstant.FILTER_LOV_TASK_LIST(q, input);
        BigDecimal resultCount = (BigDecimal) q.uniqueResult();
        Integer total = resultCount.intValue();
        return total;
    }

}
