/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 *
 * @author USER
 */

@Entity
@Table(name = "AHMGAWPM_TBLPLANT")
public class AhmgawpmTblplant {
    
    @Id
    @Column(name = "VPLANTVAR")
    private String vplantvar;
    
    @Column(name = "VPLANTDESC")
    private String vplantdesc;

    public String getVplantvar() {
        return vplantvar;
    }

    public void setVplantvar(String vplantvar) {
        this.vplantvar = vplantvar;
    }

    public String getVplantdesc() {
        return vplantdesc;
    }

    public void setVplantdesc(String vplantdesc) {
        this.vplantdesc = vplantdesc;
    }
    
    
    
}
