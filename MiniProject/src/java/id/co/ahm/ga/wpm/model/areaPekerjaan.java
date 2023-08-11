/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 *
 * @author USER
 */
@Entity
@Table(name = "AHMGAWPM_DTLIKPAREAS")
public class AhmgawpmDtlikpareas implements Serializable {

    @EmbeddedId
    private AhmgawpmDtlikpareasPk ahmgawpmDtlikpareasPk;

    @Column(name = "VAREADTL")
    private String vareadtl;

    @Column(name = "VINOUT")
    private String vinout;

    @Column(name = "VCRIT")
    private String vcrit;

    @Column(name = "VTASKLIST")
    private String vtasklist;

    @Column(name = "VLGINPATROL")
    private String vlginpatrol;

    public AhmgawpmDtlikpareasPk getAhmgawpmDtlikpareasPk() {
        return ahmgawpmDtlikpareasPk;
    }

    public void setAhmgawpmDtlikpareasPk(AhmgawpmDtlikpareasPk ahmgawpmDtlikpareasPk) {
        this.ahmgawpmDtlikpareasPk = ahmgawpmDtlikpareasPk;
    }

    public String getVareadtl() {
        return vareadtl;
    }

    public void setVareadtl(String vareadtl) {
        this.vareadtl = vareadtl;
    }

    public String getVinout() {
        return vinout;
    }

    public void setVinout(String vinout) {
        this.vinout = vinout;
    }

    public String getVcrit() {
        return vcrit;
    }

    public void setVcrit(String vcrit) {
        this.vcrit = vcrit;
    }

    public String getVtasklist() {
        return vtasklist;
    }

    public void setVtasklist(String vtasklist) {
        this.vtasklist = vtasklist;
    }

    public String getVlginpatrol() {
        return vlginpatrol;
    }

    public void setVlginpatrol(String vlginpatrol) {
        this.vlginpatrol = vlginpatrol;
    }
}
