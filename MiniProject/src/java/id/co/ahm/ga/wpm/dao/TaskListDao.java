/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.TaskList;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.vo.VoLovTaskList;
import java.util.List;

/**
 *
 * @author USER
 */
public interface TaskListDao extends DefaultDao<TaskList, String>{
    
    public List<VoLovTaskList> getLovTaskList(DtoParamPaging input);
    
    int getCountLovTaskList(DtoParamPaging input);
    
}
