/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.vo;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

/**
 *
 * @author Dell
 */
public class VoShowTableIkp {

    private String ikpId;
    private String idSupplier;
    private String namaSupplier;
    private String tipeOrder;
    private String nomorPoSpk;
    private String plantId;
    private String nomorPengajuanProyek;
    private String loginPatrol;
    private String kategoriIzinKerja;
    private String kategoriPekerjaan;
    private String purchasingOrganization;
    private String deskripsiItem;
    private String projectDetail;
    private String status;
    private BigDecimal nrpPic;
    private String namaPic;
    private String divisi;
    private String departemen;
    private String seksi;
    private Date startJob;
    private Date endJob;
    private List<VoShowAreaPekerjaan> areaPekerjaan;

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
    
    

    public List<VoShowAreaPekerjaan> getAreaPekerjaan() {
        return areaPekerjaan;
    }

    public void setAreaPekerjaan(List<VoShowAreaPekerjaan> areaPekerjaan) {
        this.areaPekerjaan = areaPekerjaan;
    }

    public String getNomorPoSpk() {
        return nomorPoSpk;
    }

    public void setNomorPoSpk(String nomorPoSpk) {
        this.nomorPoSpk = nomorPoSpk;
    }

    public String getIkpId() {
        return ikpId;
    }

    public void setIkpId(String ikpId) {
        this.ikpId = ikpId;
    }

    public String getIdSupplier() {
        return idSupplier;
    }

    public void setIdSupplier(String idSupplier) {
        this.idSupplier = idSupplier;
    }

    public String getNamaSupplier() {
        return namaSupplier;
    }

    public void setNamaSupplier(String namaSupplier) {
        this.namaSupplier = namaSupplier;
    }

    public String getTipeOrder() {
        return tipeOrder;
    }

    public void setTipeOrder(String tipeOrder) {
        this.tipeOrder = tipeOrder;
    }

    public String getPlantId() {
        return plantId;
    }

    public void setPlantId(String plantId) {
        this.plantId = plantId;
    }

    public String getNomorPengajuanProyek() {
        return nomorPengajuanProyek;
    }

    public void setNomorPengajuanProyek(String nomorPengajuanProyek) {
        this.nomorPengajuanProyek = nomorPengajuanProyek;
    }

    public String getLoginPatrol() {
        return loginPatrol;
    }

    public void setLoginPatrol(String loginPatrol) {
        this.loginPatrol = loginPatrol;
    }

    public String getKategoriIzinKerja() {
        return kategoriIzinKerja;
    }

    public void setKategoriIzinKerja(String kategoriIzinKerja) {
        this.kategoriIzinKerja = kategoriIzinKerja;
    }

    public String getKategoriPekerjaan() {
        return kategoriPekerjaan;
    }

    public void setKategoriPekerjaan(String kategoriPekerjaan) {
        this.kategoriPekerjaan = kategoriPekerjaan;
    }

    public String getPurchasingOrganization() {
        return purchasingOrganization;
    }

    public void setPurchasingOrganization(String purchasingOrganization) {
        this.purchasingOrganization = purchasingOrganization;
    }

    public String getDeskripsiItem() {
        return deskripsiItem;
    }

    public void setDeskripsiItem(String deskripsiItem) {
        this.deskripsiItem = deskripsiItem;
    }

    public String getProjectDetail() {
        return projectDetail;
    }

    public void setProjectDetail(String projectDetail) {
        this.projectDetail = projectDetail;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getNrpPic() {
        return nrpPic;
    }

    public void setNrpPic(BigDecimal nrpPic) {
        this.nrpPic = nrpPic;
    }

    public String getNamaPic() {
        return namaPic;
    }

    public void setNamaPic(String namaPic) {
        this.namaPic = namaPic;
    }

    public String getDivisi() {
        return divisi;
    }

    public void setDivisi(String divisi) {
        this.divisi = divisi;
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

}
