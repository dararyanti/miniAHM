/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author USER
 */
@Entity
@Table(name = "AHMGAWPM_TBLPO")
public class AhmgawpmTblpo {
    
    @Id
    @Column(name = "VNOPO")
    private String vnopo;
    
    @Column(name = "VPODESC")
    private String vpodesc;
    
    @ManyToOne
    @JoinColumn(name = "VSUPPLYID")
    private AhmgawpmTblsupplier vsupplyid;

    public String getVnopo() {
        return vnopo;
    }

    public void setVnopo(String vnopo) {
        this.vnopo = vnopo;
    }

    public String getVpodesc() {
        return vpodesc;
    }

    public void setVpodesc(String vpodesc) {
        this.vpodesc = vpodesc;
    }

    public AhmgawpmTblsupplier getVsupplyid() {
        return vsupplyid;
    }

    public void setVsupplyid(AhmgawpmTblsupplier vsupplyid) {
        this.vsupplyid = vsupplyid;
    }
    
    
    
}
