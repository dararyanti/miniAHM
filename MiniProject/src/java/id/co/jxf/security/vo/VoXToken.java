package id.co.jxf.security.vo;

/**
 *
 * @author Irzan Maulana
 */
public class VoXToken {

    private String domain;
    private String username;
    private String displayname;
    private String email;
    private String nrp;
    private String zone;
    private String ipaddress;
    private String oadate;

    public String getDomain() {
        return domain;
    }

    public void setDomain(String domain) {
        this.domain = domain;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayname() {
        return displayname;
    }

    public void setDisplayname(String displayname) {
        this.displayname = displayname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNrp() {
        return nrp;
    }

    public void setNrp(String nrp) {
        this.nrp = nrp;
    }

    public String getZone() {
        return zone;
    }

    public void setZone(String zone) {
        this.zone = zone;
    }

    public String getIpaddress() {
        return ipaddress;
    }

    public void setIpaddress(String ipaddress) {
        this.ipaddress = ipaddress;
    }

    public String getOadate() {
        return oadate;
    }

    public void setOadate(String oadate) {
        this.oadate = oadate;
    }

}

