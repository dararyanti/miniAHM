package id.co.ahm.ga.wpm.util;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Irzan Maulana
 */
public class DtoResponse {

    private String status;
    private List data;
    private Map<String, Object> message;

    public void addMessage(String key, Object value) {
        if (this.message == null) {
            this.message = new HashMap<String, Object>();
        }
        this.message.put(key, value);
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String stat) {
        this.status = stat;
    }

    public List getData() {
        return data;
    }

    public void setData(List data) {
        this.data = data;
    }

    public Map<String, Object> getMessage() {
        return message;
    }

    public void setMessage(Map<String, Object> message) {
        this.message = message;
    }
}
