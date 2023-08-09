package id.co.ahm.ga.wpm.util.impl;

import id.co.ahm.ga.wpm.util.DefaultEntity;
import java.util.Date;
import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 *
 * @author Irzan Maulana
 */
@MappedSuperclass
public class DefaultEntityImpl implements DefaultEntity {

    @Column(name = "VCREA",length=255)
    private String createBy;

    @Column(name = "VMODI",length=255)
    private String lastModBy;

    @Column(name = "DCREA")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createDate;

    @Column(name = "DMODI")
    @Temporal(TemporalType.TIMESTAMP)
    private Date lastModDate;

    @Override
    public String getCreateBy() {
        return createBy;
    }

    @Override
    public void setCreateBy(String createBy) {
        this.createBy = createBy;
    }

    @Override
    public Date getCreateDate() {
        return createDate;
    }

    @Override
    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
    }

    @Override
    public String getLastModBy() {
        return this.lastModBy;
    }

    @Override
    public void setLastModBy(String lastModBy) {
        this.lastModBy = lastModBy;
    }

    @Override
    public Date getLastModDate() {
        return this.lastModDate;
    }

    @Override
    public void setLastModDate(Date lastModDate) {
        this.lastModDate = lastModDate;
    }
}

