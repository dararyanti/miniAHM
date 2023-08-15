/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.vo;

import java.util.List;

/**
 *
 * @author USER
 */
public class VoSaveIkp {
    private VoCreateUpdateIkp ikp;
    private List<VoCreateUpdateAreaPekerjaan> listArea;

    public VoCreateUpdateIkp getIkp() {
        return ikp;
    }

    public void setIkp(VoCreateUpdateIkp ikp) {
        this.ikp = ikp;
    }

    public List<VoCreateUpdateAreaPekerjaan> getListArea() {
        return listArea;
    }

    public void setListArea(List<VoCreateUpdateAreaPekerjaan> listArea) {
        this.listArea = listArea;
    }
    
    
}
