/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.model;

import java.math.BigDecimal;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author USER
 */

@Entity
@Table(name = "HEADER_IKP")
public class HeaderIkp {
    @Id
    @Column(name = "IKP_ID")
    private String ikpId;
    
    @Column(name = "KAT_PEKERJAAN")
    private String katPekerjaan;
    
    @Column(name = "KAT_IZIN_KERJA")
    private String katIzinKerja;
    
    @Column(name = "TIPE_ORDER")
    private String tipeOrder;
    
    @Column(name = "NO_PO")
    private String noPo;
    
    @Column(name = "NO_SPK")
    private String noSpk;
    
    @Column(name = "DESKRIPSI_ITEM")
    private String deskripsiItem;
    
    @Column(name = "PLANT_ID")
    private String plantId;
    
    @Column(name = "NO_PENGAJUAN_PROYEK")
    private String noPengajuanProyek;
    
    @Column(name = "PROJECT_DETAIL")
    private String projectDetail;
    
    @Column(name = "START_JOB")
    @Temporal(TemporalType.DATE)
    private Date startJob;
    
    @Column(name = "END_JOB")
    @Temporal(TemporalType.DATE)
    private Date endJob;
    
    @Column(name = "PURCHASING_ORG")
    private String purchasingOrg;
    
    @Column(name = "NRP_ID")
    private BigDecimal nrpId;
    
    @Column(name = "SUPPLY_ID")
    private String supplyId;
    
    @Column(name = "SUPPLY_DESC")
    private String supplyDesc;
    
    @Column(name = "NAMA_PENGAWAS")
    private String namaPengawas;
    
    @Column(name = "HP_PENGAWAS")
    private String hpPengawas;
    
    @Column(name = "NAMA_LK3")
    private String namaLk3;
    
    @Column(name = "HP_LK3")
    private String hpLk3;
    
    @Column(name = "STATUS")
    private String status;
    
    @Column(name = "REMARK")
    private String remark;

    public String getIkpId() {
        return ikpId;
    }

    public void setIkpId(String ikpId) {
        this.ikpId = ikpId;
    }

    public String getKatPekerjaan() {
        return katPekerjaan;
    }

    public void setKatPekerjaan(String katPekerjaan) {
        this.katPekerjaan = katPekerjaan;
    }

    public String getKatIzinKerja() {
        return katIzinKerja;
    }

    public void setKatIzinKerja(String katIzinKerja) {
        this.katIzinKerja = katIzinKerja;
    }

    public String getTipeOrder() {
        return tipeOrder;
    }

    public void setTipeOrder(String tipeOrder) {
        this.tipeOrder = tipeOrder;
    }

    public String getNoPo() {
        return noPo;
    }

    public void setNoPo(String noPo) {
        this.noPo = noPo;
    }

    public String getNoSpk() {
        return noSpk;
    }

    public void setNoSpk(String noSpk) {
        this.noSpk = noSpk;
    }

    public String getDeskripsiItem() {
        return deskripsiItem;
    }

    public void setDeskripsiItem(String deskripsiItem) {
        this.deskripsiItem = deskripsiItem;
    }

    public String getPlantId() {
        return plantId;
    }

    public void setPlantId(String plantId) {
        this.plantId = plantId;
    }

    public String getNoPengajuanProyek() {
        return noPengajuanProyek;
    }

    public void setNoPengajuanProyek(String noPengajuanProyek) {
        this.noPengajuanProyek = noPengajuanProyek;
    }

    public String getProjectDetail() {
        return projectDetail;
    }

    public void setProjectDetail(String projectDetail) {
        this.projectDetail = projectDetail;
    }

    public Date getStartJob() {
        return startJob;
    }

    public void setStartJob(Date startJob) {
        this.startJob = startJob;
    }

    public Date getEndJob() {
        return endJob;
    }

    public void setEndJob(Date endJob) {
        this.endJob = endJob;
    }

    public String getPurchasingOrg() {
        return purchasingOrg;
    }

    public void setPurchasingOrg(String purchasingOrg) {
        this.purchasingOrg = purchasingOrg;
    }

    public BigDecimal getNrpId() {
        return nrpId;
    }

    public void setNrpId(BigDecimal nrpId) {
        this.nrpId = nrpId;
    }

    public String getSupplyId() {
        return supplyId;
    }

    public void setSupplyId(String supplyId) {
        this.supplyId = supplyId;
    }

    public String getSupplyDesc() {
        return supplyDesc;
    }

    public void setSupplyDesc(String supplyDesc) {
        this.supplyDesc = supplyDesc;
    }

    public String getNamaPengawas() {
        return namaPengawas;
    }

    public void setNamaPengawas(String namaPengawas) {
        this.namaPengawas = namaPengawas;
    }

    public String getHpPengawas() {
        return hpPengawas;
    }

    public void setHpPengawas(String hpPengawas) {
        this.hpPengawas = hpPengawas;
    }

    public String getNamaLk3() {
        return namaLk3;
    }

    public void setNamaLk3(String namaLk3) {
        this.namaLk3 = namaLk3;
    }

    public String getHpLk3() {
        return hpLk3;
    }

    public void setHpLk3(String hpLk3) {
        this.hpLk3 = hpLk3;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
 
}
