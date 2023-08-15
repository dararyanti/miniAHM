/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.model;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 *
 * @author USER
 */
@Entity
@Table(name = "AREA_PEKERJAAN")
public class AreaPekerjaan implements Serializable {

    @EmbeddedId
    private AreaPekerjaanPk ahmgawpmDtlikpareasPk;

    @Column(name = "AREA_DETAIL")
    private String areaDetail;

    @Column(name = "IN_OUT")
    private String inOut;

    @Column(name = "CRITICALITY")
    private String criticality;

    @Column(name = "TASK_LIST")
    private String taskList;

    @Column(name = "LOGIN_PATROL")
    private String loginPatrol;

    public AreaPekerjaanPk getAhmgawpmDtlikpareasPk() {
        return ahmgawpmDtlikpareasPk;
    }

    public void setAhmgawpmDtlikpareasPk(AreaPekerjaanPk ahmgawpmDtlikpareasPk) {
        this.ahmgawpmDtlikpareasPk = ahmgawpmDtlikpareasPk;
    }

    public String getAreaDetail() {
        return areaDetail;
    }

    public void setAreaDetail(String areaDetail) {
        this.areaDetail = areaDetail;
    }

    public String getInOut() {
        return inOut;
    }

    public void setInOut(String inOut) {
        this.inOut = inOut;
    }

    public String getCriticality() {
        return criticality;
    }

    public void setCriticality(String criticality) {
        this.criticality = criticality;
    }

    public String getTaskList() {
        return taskList;
    }

    public void setTaskList(String taskList) {
        this.taskList = taskList;
    }

    public String getLoginPatrol() {
        return loginPatrol;
    }

    public void setLoginPatrol(String loginPatrol) {
        this.loginPatrol = loginPatrol;
    }

    
    
}
