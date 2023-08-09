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
@Table(name = "AHMGAWPM_TBLASSET")
public class AhmgawpmTblasset {
    @Id
    @Column(name = "VNOASSET")
    private String vnoasset;
    
    @Column(name = "VDESCASSET")
    private String vdescasset;
    
    @ManyToOne
    @JoinColumn(name = "VPLANTVAR")
    private AhmgawpmTblplant vplatvar;

    public String getVnoasset() {
        return vnoasset;
    }

    public void setVnoasset(String vnoasset) {
        this.vnoasset = vnoasset;
    }

    public String getVdescasset() {
        return vdescasset;
    }

    public void setVdescasset(String vdescasset) {
        this.vdescasset = vdescasset;
    }

    public AhmgawpmTblplant getVplatvar() {
        return vplatvar;
    }

    public void setVplatvar(AhmgawpmTblplant vplatvar) {
        this.vplatvar = vplatvar;
    }
    
    
    
    
}
