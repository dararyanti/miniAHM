package id.co.ahm.ga.wpm.util.model;

import id.co.ahm.ga.wpm.util.impl.DefaultEntityImpl;
import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

/**
 *
 * @author Irzan Maulana
 */
@Entity
@Table(name = "AHMIPUAM_MSTROLEAAS")
public class MasterRole extends DefaultEntityImpl implements Serializable{
    
    @Id
    @SequenceGenerator(name = "roleAccessActionSeq", sequenceName = "SE_MSTROLEAAS")
    @GeneratedValue(strategy = GenerationType.AUTO, generator = "roleAccessActionSeq")
    @Column(name = "IINTERNALID")
    private Long iinternalid;
    
    @Column(name="IROLEACCSID")
    private Long iroleaccsid;
    
    @Column(name="VACTALLOWED")
    private String vactallowed;
    
    @Column(name="VENABLEFLAG")
    private String venableflag;

    public Long getIinternalid() {
        return iinternalid;
    }

    public void setIinternalid(Long iinternalid) {
        this.iinternalid = iinternalid;
    }

    public Long getIroleaccsid() {
        return iroleaccsid;
    }

    public void setIroleaccsid(Long iroleaccsid) {
        this.iroleaccsid = iroleaccsid;
    }

    public String getVactallowed() {
        return vactallowed;
    }

    public void setVactallowed(String vactallowed) {
        this.vactallowed = vactallowed;
    }

    public String getVenableflag() {
        return venableflag;
    }

    public void setVenableflag(String venableflag) {
        this.venableflag = venableflag;
    }
    
}