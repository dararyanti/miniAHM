--buat bikin user
alter session set "_ORACLE_SCRIPT"=true;
   
CREATE USER ahmgawpm IDENTIFIED BY miniproject;
GRANT ALL privileges TO ahmgawpm;


--bikin table 
CREATE TABLE AHMGAWPM_HDRIKPS
    (VIKPID VARCHAR2(50 BYTE) PRIMARY KEY, 
	VWOCTGR VARCHAR2(50 BYTE), 
	VWOPERMIT VARCHAR2(50 BYTE), 
	VORDERTYPE VARCHAR2(50 BYTE), 
	VODRTYPNUM VARCHAR2(50 BYTE), 
	VNOSPK VARCHAR2(50 BYTE), 
	VITEMDESC VARCHAR2(500 BYTE), 
	VPLANTID VARCHAR2(4 BYTE), 
	VPROJSUB VARCHAR2(50 BYTE), 
	VPROJDTL VARCHAR2(50 BYTE),
	DSTARTJOB DATE,
	DENDJOB DATE,
	VPURCHORG VARCHAR2(50 BYTE), 
	VPICNRPID NUMBER(22,0), 
	VSUPPLYID VARCHAR2(50 BYTE), 
	VSUPPLDESC VARCHAR2(500 BYTE), 
	VNAME VARCHAR2(50 BYTE), 
	VHP VARCHAR2(50 BYTE), 
	VNAMELK3 VARCHAR2(50 BYTE), 
	VHPLK3 VARCHAR2(50 BYTE),
	VSTATUS VARCHAR(50 BYTE),
	VCREA VARCHAR2(20 BYTE), 
	DCREA DATE, 
	VMODI VARCHAR2(20 BYTE), 
	DMODI DATE,
	VREMARK VARCHAR2(500)) ;

CREATE TABLE AHMGAWPM_DTLIKPAREAS 
   (	
	VIKPID VARCHAR2(50 BYTE), 
	VAREADTL VARCHAR2(50 BYTE), 
	VINOUT VARCHAR2(50 BYTE), 
	VCRIT VARCHAR2(50 BYTE), 
	VTASKLIST VARCHAR2(50 BYTE), 
	VLGINPATROL VARCHAR2(50 BYTE), 
	VASSETNO VARCHAR2(50),
	CONSTRAINT AHMGAWPM_DTLIKPAREAS_PK PRIMARY KEY (VIKPID,VASSETNO)
	);

--2 PK "VIKPID" VASSETNO 



--LoV Supplier -- > Tabel Supplier
 CREATE TABLE AHMGAWPM_TBLSUPPLIER 
 (	VSUPPLYID VARCHAR2(50 BYTE) PRIMARY KEY, 
	VSUPPLDESC VARCHAR2(50 BYTE) 
  ) ;


--LoV PO -- > Tabel PO
 CREATE TABLE AHMGAWPM_TBLPO
 (	VNOPO VARCHAR2(50 BYTE)  PRIMARY KEY, 
	VPODESC VARCHAR2(50 BYTE), 
	VSUPPLYID VARCHAR2(50 BYTE),
    CONSTRAINT AHMGAWPM_TBLPO_FK FOREIGN KEY (VSUPPLYID) 
    REFERENCES AHMGAWPM_TBLSUPPLIER (VSUPPLYID)
  ) ;
--nyambung ke Supplier lewat "VSUPPLYID" 


--LoV PIC -- > Tabel PIC
 CREATE TABLE AHMGAWPM_TBLPIC
 (	VNRP VARCHAR2(50 BYTE) PRIMARY KEY, 
	VNAMA VARCHAR2(50 BYTE), 
        VNAMADEPTHEAD VARCHAR2(50 BYTE), 
	VNAMASEKSI VARCHAR2(50 BYTE), 
	VNAMADIVISI VARCHAR2(50 BYTE)
  ) ;

--LoV Plant -- > Tabel Plant
 CREATE TABLE AHMGAWPM_TBLPLANT
 (	VPLANTVAR VARCHAR2(50 BYTE) PRIMARY KEY, 
	VPLANTDESC VARCHAR2(50 BYTE)
  ) ;

--LoV Asset -- > Tabel Asset
 CREATE TABLE AHMGAWPM_TBLASSET
 (	VNOASSET VARCHAR2(50 BYTE)  PRIMARY KEY, 
	VDESCASSET VARCHAR2(50 BYTE), 
	VPLANTVAR VARCHAR2(50 BYTE), 
	CONSTRAINT AHMGAWPM_TBLASSET_FK FOREIGN KEY (VPLANTVAR)
	REFERENCES AHMGAWPM_TBLPLANT(VPLANTVAR)
  ) ;
--nyambung ke plant lewat "VPLANTVAR" 

--LoV TaskList -- > Tabel TaskList
 CREATE TABLE AHMGAWPM_TBLTASKLIST
 (	VKODETASKLIST VARCHAR2(50 BYTE) PRIMARY KEY , 
	VTITLETASKLIST VARCHAR2(50 BYTE), 
	VNOASSET VARCHAR2(50 BYTE) ,
	CONSTRAINT AHMGAWPM_TBLTASKLIST_FK FOREIGN KEY (VNOASSET)
	REFERENCES AHMGAWPM_TBLASSET(VNOASSET)
	);
--nyambung ke asset lewat "VNOASSET" 

CREATE TABLE AHMGAWPM_TBLUSER
(USERNAME VARCHAR2(50 BYTE) PRIMARY KEY,
PASSWORD VARCHAR2(50 BYTE),
ROLE_NAME VARCHAR2(50 BYTE));


