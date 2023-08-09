package id.co.ahm.ga.wpm.util;

import java.util.Map;

/**
 *
 * @author Irzan Maulana
 */
public class DtoParamPaging {
    
    private int offset;
    private int limit;
    // field yang akan diurutkan
    private String sort;
    
    //descending atau ascending
    private String order;    
    private Map<String,Object> search;

    public int getOffset() {
        return offset;
    }

    public void setOffset(int offset) {
        this.offset = offset;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public String getOrder() {
        return order;
    }

    public void setOrder(String order) {
        this.order = order;
    }

    public Map<String, Object> getSearch() {
        return search;
    }

    public void setSearch(Map<String, Object> search) {
        this.search = search;
    }
}
