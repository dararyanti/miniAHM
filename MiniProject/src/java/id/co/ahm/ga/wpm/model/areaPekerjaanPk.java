/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Embeddable;

/**
 *
 * @author USER
 */

@Embeddable
public class AreaPekerjaanPk implements Serializable {
     @Column(name = "ASSET_NO")
    private String assetNo;

    @Column(name = "IKP_ID")
    private String ikpId;

    public String getAssetNo() {
        return assetNo;
    }

    public void setAssetNo(String assetNo) {
        this.assetNo = assetNo;
    }

    public String getIkpId() {
        return ikpId;
    }

    public void setIkpId(String ikpId) {
        this.ikpId = ikpId;
    }
    
    

}
