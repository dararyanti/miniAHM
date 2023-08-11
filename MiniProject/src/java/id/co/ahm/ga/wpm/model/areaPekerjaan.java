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

    
}
