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
@Table(name = "AHMGAWPM_TBLPIC")
public class AhmgawpmTblpic {
    
    @Id
    @Column(name = "VNRP")
    private String vnrp;
    
    @Column(name = "VNAMA")
    private String vnama;
    
    @Column(name = "VNAMADEPTHEAD")
    private String vnamadepthead;
    
    @Column(name = "VNAMASEKSI")
    private String vnamaseksi;
    
    @Column(name = "VNAMADIVISI")
    private String vnamadivisi;

    public String getVnrp() {
        return vnrp;
    }

    public void setVnrp(String vnrp) {
        this.vnrp = vnrp;
    }

    public String getVnama() {
        return vnama;
    }

    public void setVnama(String vnama) {
        this.vnama = vnama;
    }

    public String getVnamadepthead() {
        return vnamadepthead;
    }

    public void setVnamadepthead(String vnamadepthead) {
        this.vnamadepthead = vnamadepthead;
    }

    public String getVnamaseksi() {
        return vnamaseksi;
    }

    public void setVnamaseksi(String vnamaseksi) {
        this.vnamaseksi = vnamaseksi;
    }

    public String getVnamadivisi() {
        return vnamadivisi;
    }

    public void setVnamadivisi(String vnamadivisi) {
        this.vnamadivisi = vnamadivisi;
    }
    
    
}
