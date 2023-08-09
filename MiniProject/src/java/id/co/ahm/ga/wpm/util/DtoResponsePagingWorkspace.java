package id.co.ahm.ga.wpm.util;

/**
 *
 * @author IRzan Maulana
 */
public class DtoResponsePagingWorkspace extends DtoResponseWorkspace{
    
    private int recordsTotal;
    private int recordsFiltered;

    public int getRecordsTotal() {
        return recordsTotal;
    }

    public void setRecordsTotal(int recordsTotal) {
        this.recordsTotal = recordsTotal;
    }

    public int getRecordsFiltered() {
        return recordsFiltered;
    }

    public void setRecordsFiltered(int recordsFiltered) {
        this.recordsFiltered = recordsFiltered;
    }

}
