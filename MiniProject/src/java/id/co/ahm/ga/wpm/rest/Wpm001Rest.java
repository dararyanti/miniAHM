package id.co.ahm.ga.wpm.rest;

import id.co.ahm.ga.wpm.service.Wpm001Service;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import id.co.ahm.ga.wpm.util.UserUtilsService;
import id.co.jxf.constant.CommonConstant;
import id.co.jxf.security.TokenPstUtil;
import id.co.jxf.security.vo.VoPstUserCred;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 *
 * @author Irzan Maulana
 */

@Controller
@RequestMapping("ga/wpm001")
public class Wpm001Rest {
    
     @Autowired
    @Qualifier(value = "tokenPstUtil")
    private TokenPstUtil tokenPstUtil;

    @Autowired
    @Qualifier(value = "wpm001Service")
    private Wpm001Service wpm001Service;

    @Autowired
    @Qualifier(value = "userUtilsService")
    private UserUtilsService userUtilsService;

    public TokenPstUtil getTokenPstUtil() {
        return tokenPstUtil;
    }

    public void setTokenPstUtil(TokenPstUtil tokenPstUtil) {
        this.tokenPstUtil = tokenPstUtil;
    }
    
     @RequestMapping(value = "get-ikp-table", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getAllIkp(@RequestBody DtoParamPaging dtoParamPaging) {
//        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.wpm001Service.getTableIkp(dtoParamPaging, null);
    }
    
}
