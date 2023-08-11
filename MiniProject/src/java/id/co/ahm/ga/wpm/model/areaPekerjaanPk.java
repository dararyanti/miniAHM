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
public class AhmgawpmDtlikpareasPk implements Serializable {
     @Column(name = "VASSETNO")
    private String vassetno;

    @Column(name = "VIKPID")
    private String vikpid;

    public String getVassetno() {
        return vassetno;
    }

    public void setVassetno(String vassetno) {
        this.vassetno = vassetno;
    }

    public String getVikpid() {
        return vikpid;
    }

    public void setVikpid(String vikpid) {
        this.vikpid = vikpid;
    }
}
