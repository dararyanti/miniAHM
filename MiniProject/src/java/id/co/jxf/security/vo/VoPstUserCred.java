package id.co.jxf.security.vo;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Irzan Maulana
 */
public class VoPstUserCred {
    
    private String username = "kosong"; // username ldap
    private String password = "kosong"; // password ldap
    private String email = "kosong"; // email
    private String fullname = "kosong"; // fullname
    private String userid = "kosong"; // nrp or userid untuk external
    private String partnerid = "kosong"; // AHM or PartnerID(External)
    private String partnerName = "kosong"; // PT Astra Honda Motor or PartnerName(External)
    private String area = "kosong"; //WCT ID or H1H2H3
    private List<String> mdH1 = new ArrayList<String>(); //MainDealer H1 (Dealer Only)
    private List<String> mdH2 = new ArrayList<String>(); //MainDealer H2 (Dealer Only)
    private List<String> mdH3 = new ArrayList<String>(); //MainDealer H3 (Dealer Only)
    private String costCenter = "kosong"; // costCenter user AHM
    private String type = "kosong"; // AHM or V(Vendor) or M(Main Dealer) or D(Dealer)
    private String plant = "kosong"; // Plant user , Khusus AHM 
    private String plantDesc = "kosong"; // Plant Description user , Khusus AHM 
    private String accountStatus = "0"; // "0" = Account enable, 1 = Account disable (locked ldap), 2 = Account disable (locked last login > limit)
    
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }
   
    public String getPartnerid() {
        return partnerid;
    }

    public void setPartnerid(String partnerid) {
        this.partnerid = partnerid;
    }

    public String getPartnerName() {
        return partnerName;
    }

    public void setPartnerName(String partnerName) {
        this.partnerName = partnerName;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public List<String> getMdH1() {
        return mdH1;
    }

    public void setMdH1(List<String> mdH1) {
        this.mdH1 = mdH1;
    }

    public List<String> getMdH2() {
        return mdH2;
    }

    public void setMdH2(List<String> mdH2) {
        this.mdH2 = mdH2;
    }

    public List<String> getMdH3() {
        return mdH3;
    }

    public void setMdH3(List<String> mdH3) {
        this.mdH3 = mdH3;
    }

    public String getCostCenter() {
        return costCenter;
    }

    public void setCostCenter(String costCenter) {
        this.costCenter = costCenter;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPlant() {
        return plant;
    }

    public void setPlant(String plant) {
        this.plant = plant;
    }    

    public String getPlantDesc() {
        return plantDesc;
    }

    public void setPlantDesc(String plantDesc) {
        this.plantDesc = plantDesc;
    }

    public String getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(String accountStatus) {
        this.accountStatus = accountStatus;
    }

}
