package id.co.ahm.ga.wpm.util.model;

import id.co.ahm.ga.wpm.util.impl.DefaultEntityImpl;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import org.hibernate.annotations.DynamicInsert;
import org.hibernate.annotations.DynamicUpdate;

/**
 *
 * @author Irzan Maulana
 */
@DynamicInsert
@DynamicUpdate
@Entity
@Table(name="AHMMOERP_MSTKARYAWANS")
public class MasterKaryawan extends DefaultEntityImpl implements Serializable{
    
    @Id
    @Column(name = "IIDNRP",precision = 7,scale = 0)
    private Integer iidnrp;
    
    @Column(name = "VNAMA",length = 64)
    private String vnama;
    
    @Column(name = "IMAXCLIENT",precision = 3,scale = 0)
    private Integer imaxclient;
    
    @Column(name = "VNAMALDAP",length = 64)
    private String vnamaldap;
    
    @Column(name = "MWCT_VWCTID",length = 8)
    private String mwctVwctid;
    
    @Column(name = "VCOSTCENTER",length = 8)
    private String vcostcenter;
    
    @Column(name = "BNONAKTIF",length = 1)
    private String bnonaktif;
    
    @Column(name = "VEMAIL",length = 100)
    private String vemail;
    
    @Column(name = "VASMCCT",length = 10)
    private String vasmcct;
    
    @Column(name = "VASMPOS",length = 3)
    private String vasmpos;

    public Integer getIidnrp() {
        return iidnrp;
    }

    public void setIidnrp(Integer iidnrp) {
        this.iidnrp = iidnrp;
    }
    
    public String getVnama() {
        return vnama;
    }

    public void setVnama(String vnama) {
        this.vnama = vnama;
    }

    public Integer getImaxclient() {
        return imaxclient;
    }

    public void setImaxclient(Integer imaxclient) {
        this.imaxclient = imaxclient;
    }

    public String getVnamaldap() {
        return vnamaldap;
    }

    public void setVnamaldap(String vnamaldap) {
        this.vnamaldap = vnamaldap;
    }

    public String getMwctVwctid() {
        return mwctVwctid;
    }

    public void setMwctVwctid(String mwctVwctid) {
        this.mwctVwctid = mwctVwctid;
    }

    public String getVcostcenter() {
        return vcostcenter;
    }

    public void setVcostcenter(String vcostcenter) {
        this.vcostcenter = vcostcenter;
    }

    public String getBnonaktif() {
        return bnonaktif;
    }

    public void setBnonaktif(String bnonaktif) {
        this.bnonaktif = bnonaktif;
    }

    public String getVemail() {
        return vemail;
    }

    public void setVemail(String vemail) {
        this.vemail = vemail;
    }

    public String getVasmcct() {
        return vasmcct;
    }

    public void setVasmcct(String vasmcct) {
        this.vasmcct = vasmcct;
    }

    public String getVasmpos() {
        return vasmpos;
    }

    public void setVasmpos(String vasmpos) {
        this.vasmpos = vasmpos;
    }
}

