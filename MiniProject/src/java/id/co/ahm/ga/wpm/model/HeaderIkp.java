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
@Table(name = "AHMGAWPM_HDRIKPS")
public class AhmgawpmHdrikps {
    @Id
    @Column(name = "VIKPID")
    private String vikpid;
    
    @Column(name = "VWOCTGR")
    private String vwoctgr;
    
    @Column(name = "VWOPERMIT")
    private String vwopermit;
    
    @Column(name = "VORDERTYPE")
    private String vordertype;
    
    @Column(name = "VODRTYPNUM")
    private String vodrtypnum;
    
    @Column(name = "VNOSPK")
    private String vnospk;
    
    @Column(name = "VITEMDESC")
    private String vitemdesc;
    
    @Column(name = "VPLANTID")
    private String vplantid;
    
    @Column(name = "VPROJSUB")
    private String vprojsub;
    
    @Column(name = "VPROJDTL")
    private String vprojdtl;
    
    @Column(name = "DSTARTJOB")
    @Temporal(TemporalType.DATE)
    private Date dstartjob;
    
    @Column(name = "DENDJOB")
    @Temporal(TemporalType.DATE)
    private Date dendjob;
    
    @Column(name = "VPURCHORG")
    private String vpurchorg;
    
    @Column(name = "VPICNRPID")
    private BigDecimal vpicnrpid;
    
    @Column(name = "VSUPPLYID")
    private String vsupplyid;
    
    @Column(name = "VSUPPLDESC")
    private String vsuppldesc;
    
    @Column(name = "VNAME")
    private String vname;
    
    @Column(name = "VHP")
    private String vhp;
    
    @Column(name = "VNAMELK3")
    private String vnamelk3;
    
    @Column(name = "VHPLK3")
    private String vhplk3;
    
    @Column(name = "VSTATUS")
    private String vstatus;
    
    @Column(name = "VREMARK")
    private String vremark;

    public String getVikpid() {
        return vikpid;
    }

    public void setVikpid(String vikpid) {
        this.vikpid = vikpid;
    }

    public String getVwoctgr() {
        return vwoctgr;
    }

    public void setVwoctgr(String vwoctgr) {
        this.vwoctgr = vwoctgr;
    }

    public String getVwopermit() {
        return vwopermit;
    }

    public void setVwopermit(String vwopermit) {
        this.vwopermit = vwopermit;
    }

    public String getVordertype() {
        return vordertype;
    }

    public void setVordertype(String vordertype) {
        this.vordertype = vordertype;
    }

    public String getVodrtypnum() {
        return vodrtypnum;
    }

    public void setVodrtypnum(String vodrtypnum) {
        this.vodrtypnum = vodrtypnum;
    }

    public String getVnospk() {
        return vnospk;
    }

    public void setVnospk(String vnospk) {
        this.vnospk = vnospk;
    }

    public String getVitemdesc() {
        return vitemdesc;
    }

    public void setVitemdesc(String vitemdesc) {
        this.vitemdesc = vitemdesc;
    }

    public String getVplantid() {
        return vplantid;
    }

    public void setVplantid(String vplantid) {
        this.vplantid = vplantid;
    }

    public String getVprojsub() {
        return vprojsub;
    }

    public void setVprojsub(String vprojsub) {
        this.vprojsub = vprojsub;
    }

    public String getVprojdtl() {
        return vprojdtl;
    }

    public void setVprojdtl(String vprojdtl) {
        this.vprojdtl = vprojdtl;
    }

    public Date getDstartjob() {
        return dstartjob;
    }

    public void setDstartjob(Date dstartjob) {
        this.dstartjob = dstartjob;
    }

    public Date getDendjob() {
        return dendjob;
    }

    public void setDendjob(Date dendjob) {
        this.dendjob = dendjob;
    }

    public String getVpurchorg() {
        return vpurchorg;
    }

    public void setVpurchorg(String vpurchorg) {
        this.vpurchorg = vpurchorg;
    }

    public BigDecimal getVpicnrpid() {
        return vpicnrpid;
    }

    public void setVpicnrpid(BigDecimal vpicnrpid) {
        this.vpicnrpid = vpicnrpid;
    }

    public String getVsupplyid() {
        return vsupplyid;
    }

    public void setVsupplyid(String vsupplyid) {
        this.vsupplyid = vsupplyid;
    }

    public String getVsuppldesc() {
        return vsuppldesc;
    }

    public void setVsuppldesc(String vsuppldesc) {
        this.vsuppldesc = vsuppldesc;
    }

    public String getVname() {
        return vname;
    }

    public void setVname(String vname) {
        this.vname = vname;
    }

    public String getVhp() {
        return vhp;
    }

    public void setVhp(String vhp) {
        this.vhp = vhp;
    }

    public String getVnamelk3() {
        return vnamelk3;
    }

    public void setVnamelk3(String vnamelk3) {
        this.vnamelk3 = vnamelk3;
    }

    public String getVhplk3() {
        return vhplk3;
    }

    public void setVhplk3(String vhplk3) {
        this.vhplk3 = vhplk3;
    }

    public String getVstatus() {
        return vstatus;
    }

    public void setVstatus(String vstatus) {
        this.vstatus = vstatus;
    }

    public String getVremark() {
        return vremark;
    }

    public void setVremark(String vremark) {
        this.vremark = vremark;
    }
    
    
    
}
