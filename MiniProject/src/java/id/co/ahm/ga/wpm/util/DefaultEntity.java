package id.co.ahm.ga.wpm.util;

import java.util.Date;

/**
 *
 * @author Irzan Maulana
 */
public interface DefaultEntity {

    public String getCreateBy();

    public void setCreateBy(String createBy);

    public Date getCreateDate();

    public void setCreateDate(Date createDate);

    public String getLastModBy();

    public void setLastModBy(String lastModBy);

    public Date getLastModDate();

    public void setLastModDate(Date lastModDate);

}
