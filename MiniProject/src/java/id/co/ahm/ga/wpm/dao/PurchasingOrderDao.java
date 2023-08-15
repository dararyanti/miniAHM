/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.PurchasingOrder;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.vo.VoLovPo;
import java.util.List;

/**
 *
 * @author USER
 */
public interface PurchasingOrderDao extends DefaultDao<PurchasingOrder, String> {
    
    public List<VoLovPo> getLovPo(DtoParamPaging input);
    
    int getCountLovPo(DtoParamPaging input);
    
}
