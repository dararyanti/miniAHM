/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package id.co.ahm.ga.wpm.dao;

import id.co.ahm.ga.wpm.model.Asset;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.dao.DefaultDao;
import id.co.ahm.ga.wpm.vo.VoLovAsset;
import java.util.List;

/**
 *
 * @author USER
 */
public interface AssetDao extends DefaultDao<Asset, String>{
    
    public List<VoLovAsset> getLovAsset(DtoParamPaging input);
    
    int getCountLovAsset(DtoParamPaging input);
    
}
