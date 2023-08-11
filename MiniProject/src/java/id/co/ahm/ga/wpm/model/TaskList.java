/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package id.co.ahm.ga.wpm.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 *
 * @author USER
 */

@Entity
@Table(name = "TASK_LIST")
public class TaskList {
    
    @Id
    @Column(name = "KODE_TASK_LIST")
    private String kodeTaskList;
    
    @Column(name = "TITLE_TASK_LIST")
    private String titleTaskList;
    
    @ManyToOne
    @JoinColumn(name = "NO_ASSET")
    private Asset noAsset;

    public String getKodeTaskList() {
        return kodeTaskList;
    }

    public void setKodeTaskList(String kodeTaskList) {
        this.kodeTaskList = kodeTaskList;
    }

    public String getTitleTaskList() {
        return titleTaskList;
    }

    public void setTitleTaskList(String titleTaskList) {
        this.titleTaskList = titleTaskList;
    }

    public Asset getNoAsset() {
        return noAsset;
    }

    public void setNoAsset(Asset noAsset) {
        this.noAsset = noAsset;
    }

}
