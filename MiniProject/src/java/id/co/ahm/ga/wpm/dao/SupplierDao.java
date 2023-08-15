/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.Supplier;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.vo.VoLovSupplier;
import java.io.Serializable;
import java.util.List;

/**
 *
 * @author USER
 */
public interface SupplierDao extends DefaultDao<Supplier, String>{
    
    public List<VoLovSupplier> getLovSupplier(DtoParamPaging input);
    
    public int getCountLovSupplier(DtoParamPaging input);
    
}
