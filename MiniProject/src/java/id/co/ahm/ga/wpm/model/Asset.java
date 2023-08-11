/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 *
 * @author USER
 */
@Entity
@Table(name = "ASSET")
public class Asset {
    @Id
    @Column(name = "NO_ASSET")
    private String noAsset;
    
    @Column(name = "DESC_ASSET")
    private String descAsset;
    
    @ManyToOne
    @JoinColumn(name = "PLANT_VAR")
    private Plant platVar;

    public String getNoAsset() {
        return noAsset;
    }

    public void setNoAsset(String noAsset) {
        this.noAsset = noAsset;
    }

    public String getDescAsset() {
        return descAsset;
    }

    public void setDescAsset(String descAsset) {
        this.descAsset = descAsset;
    }

    public Plant getPlatVar() {
        return platVar;
    }

    public void setPlatVar(Plant platVar) {
        this.platVar = platVar;
    }

    
}
