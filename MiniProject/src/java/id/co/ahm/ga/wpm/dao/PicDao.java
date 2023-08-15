/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.Pic;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.vo.VoLovPic;
import java.io.Serializable;
import java.util.List;

/**
 *
 * @author USER
 */
public interface PicDao extends DefaultDao<Pic, String> {
    
    public List<VoLovPic> getLovPic(DtoParamPaging input);
    
    int getCountLovPic(DtoParamPaging input);
    
}
