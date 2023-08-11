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
@Table(name = "PURCHASING_ORDER")
public class PurchasingOrder {
    
    @Id
    @Column(name = "NO_PO")
    private String noPo;
    
    @Column(name = "PO_DESC")
    private String poDesc;
    
    @ManyToOne
    @JoinColumn(name = "SUPPLY_ID")
    private Supplier supplyId;

    public String getNoPo() {
        return noPo;
    }

    public void setNoPo(String noPo) {
        this.noPo = noPo;
    }

    public String getPoDesc() {
        return poDesc;
    }

    public void setPoDesc(String poDesc) {
        this.poDesc = poDesc;
    }

    public Supplier getSupplyId() {
        return supplyId;
    }

    public void setSupplyId(Supplier supplyId) {
        this.supplyId = supplyId;
    }
 
}
