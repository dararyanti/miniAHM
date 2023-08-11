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
@Table(name = "PLANT")
public class Plant {
    
    @Id
    @Column(name = "PLANT_VAR")
    private String plantVar;
    
    @Column(name = "PLANT_DESC")
    private String plantDesc;

    public String getPlantVar() {
        return plantVar;
    }

    public void setPlantVar(String plantVar) {
        this.plantVar = plantVar;
    }

    public String getPlantDesc() {
        return plantDesc;
    }

    public void setPlantDesc(String plantDesc) {
        this.plantDesc = plantDesc;
    }

}
