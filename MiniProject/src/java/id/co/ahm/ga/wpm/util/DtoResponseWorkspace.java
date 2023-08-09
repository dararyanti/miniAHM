package id.co.ahm.ga.wpm.util;

import id.co.ahm.ga.wpm.util.vo.VoMessageWorkspace;
import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Irzan Maulana
 */
public class DtoResponseWorkspace<T>{
    
    private String status;    
    private T data;
    private List<VoMessageWorkspace> error_fields;
    private String message;

    public void addMessage(VoMessageWorkspace voMessageWorkspace) {
        if(this.error_fields==null){
            this.error_fields=new ArrayList<VoMessageWorkspace>();
        }
        this.error_fields.add(voMessageWorkspace);
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public List<VoMessageWorkspace> getError_fields() {
        return error_fields;
    }

    public void setError_fields(List<VoMessageWorkspace> error_fields) {
        this.error_fields = error_fields;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    
}
