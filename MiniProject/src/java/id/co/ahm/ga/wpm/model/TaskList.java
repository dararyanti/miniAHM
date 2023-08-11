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
@Table(name = "AHMGAWPM_TBLTASKLIST")
public class AhmgawpmTbltasklist {
    
    @Id
    @Column(name = "VKODETASKLIST")
    private String vkodetasklist;
    
    @Column(name = "VTITLETASKLIST")
    private String vtitletasklist;
    
    @ManyToOne
    @JoinColumn(name = "VASSETNO")
    private AhmgawpmTblasset vassetno;

    public String getVkodetasklist() {
        return vkodetasklist;
    }

    public void setVkodetasklist(String vkodetasklist) {
        this.vkodetasklist = vkodetasklist;
    }

    public String getVtitletasklist() {
        return vtitletasklist;
    }

    public void setVtitletasklist(String vtitletasklist) {
        this.vtitletasklist = vtitletasklist;
    }

    public AhmgawpmTblasset getVassetno() {
        return vassetno;
    }

    public void setVassetno(AhmgawpmTblasset vassetno) {
        this.vassetno = vassetno;
    }
    
}
