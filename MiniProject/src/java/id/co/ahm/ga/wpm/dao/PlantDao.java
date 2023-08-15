/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.Plant;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.vo.VoLovPlant;
import java.util.List;

/**
 *
 * @author USER
 */
public interface PlantDao extends DefaultDao<Plant, String> {
    
    public List<VoLovPlant> getLovPlant(DtoParamPaging input);
    
    int getCountLovPlant(DtoParamPaging input);
    
}
