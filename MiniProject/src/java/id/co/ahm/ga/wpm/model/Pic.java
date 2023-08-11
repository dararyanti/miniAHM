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
@Table(name = "PIC")
public class Pic {
    
    @Id
    @Column(name = "NRP_ID")
    private String nrpId;
    
    @Column(name = "NAMA")
    private String nama;
    
    @Column(name = "DEPARTEMEN")
    private String departemen;
    
    @Column(name = "SEKSI")
    private String seksi;
    
    @Column(name = "DIVISI")
    private String divisi;

    public String getNrpId() {
        return nrpId;
    }

    public void setNrpId(String nrpId) {
        this.nrpId = nrpId;
    }

    public String getNama() {
        return nama;
    }

    public void setNama(String nama) {
        this.nama = nama;
    }

    public String getDepartemen() {
        return departemen;
    }

    public void setDepartemen(String departemen) {
        this.departemen = departemen;
    }

    public String getSeksi() {
        return seksi;
    }

    public void setSeksi(String seksi) {
        this.seksi = seksi;
    }

    public String getDivisi() {
        return divisi;
    }

    public void setDivisi(String divisi) {
        this.divisi = divisi;
    }

   
}
