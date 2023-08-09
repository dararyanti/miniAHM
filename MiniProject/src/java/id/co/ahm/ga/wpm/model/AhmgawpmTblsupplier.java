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
@Table(name = "AHMGAWPM_TBLSUPPLIER")
public class AhmgawpmTblsupplier {
    
    @Id
    @Column(name = "VSUPPLYID")
    private String vsupplyid;
    
    @Column(name = "VSUPPLYDESC")
    private String vsupplydesc;

    public String getVsupplyid() {
        return vsupplyid;
    }

    public void setVsupplyid(String vsupplyid) {
        this.vsupplyid = vsupplyid;
    }

    public String getVsupplydesc() {
        return vsupplydesc;
    }

    public void setVsupplydesc(String vsupplydesc) {
        this.vsupplydesc = vsupplydesc;
    }
    
    
    
}
