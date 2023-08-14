/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.constant;

import id.co.ahm.ga.wpm.util.DtoParamPaging;
import java.util.Collection;
import org.hibernate.query.Query;

/**
 *
 * @author Irzan Maulana
 */
public class AreaPekerjaanConstant {

    public static final String FIND_NOMOR_ASSET_AREA_PEKERJAAN_BY_IKP_ID_QUERY
            = "SELECT "
            + " IKP_ID, "
            + " ASSET_NO "
            + " FROM AREA_PEKERJAAN "
            + " WHERE IKP_ID = :ikpId ";
    
     public final static Query FILTER_FIND_NOMOR_ASSET_AREA_PEKERJAAN_BY_IKP_ID(Query q, String ikpId) {
        q.setParameter("ikpId", ikpId);
        return q;
    } 

}
