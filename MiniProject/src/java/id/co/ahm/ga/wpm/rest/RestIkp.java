package id.co.ahm.ga.wpm.rest;

import id.co.ahm.ga.wpm.rest.view.DownloadPdfIkp;
import id.co.ahm.ga.wpm.rest.view.ExportExcelIkp;
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
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import id.co.ahm.ga.wpm.service.ServiceIkp;
import id.co.ahm.ga.wpm.vo.VoSaveIkp;
import java.util.Map;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

/**
 *
 * @author Irzan Maulana
 */

@Controller
@CrossOrigin
@RequestMapping("ga/wpm001")
public class RestIkp {
    
     @Autowired
    @Qualifier(value = "tokenPstUtil")
    private TokenPstUtil tokenPstUtil;

    @Autowired
    @Qualifier(value = "serviceIkp")
    private ServiceIkp serviceIkp;

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
    DtoResponse getIkpTable(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody DtoParamPaging dtoParamPaging) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.getTableIkp(dtoParamPaging, voPstUserCred);
    }
    
    @RequestMapping(value = "delete-ikp", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse deleteIkp(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestParam String ikpId) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.deleteIkp(ikpId, voPstUserCred);
    }
    
     @RequestMapping(value = "get-areaproject-table", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getAreaTable(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody DtoParamPaging dtoParamPaging) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.getAreaProjectTableIkp(dtoParamPaging, voPstUserCred);
    }
    
    @RequestMapping(value = "export-to-excel-ikp",
            method = RequestMethod.GET)
    public @ResponseBody
    ModelAndView exportToExcelIkp(@RequestParam(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestParam Map<String, Object> params) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        ModelAndView model = new ModelAndView(new ExportExcelIkp(), "IKP", this.serviceIkp.exportToExcelIkp(params, voPstUserCred));
        return model;
    }
    
    @RequestMapping(value = "download-ikp",
            method = RequestMethod.GET)
    public @ResponseBody
    ModelAndView downloadIkp(@RequestParam(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestParam Map<String, Object> params) throws Exception {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        ModelAndView model = new ModelAndView(new DownloadPdfIkp(), "IKP", this.serviceIkp.downloadIkp(params, voPstUserCred));
        return model;
    }
    
    @RequestMapping(value = "get-lov-supplier", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovSupplier(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody DtoParamPaging dtoParamPaging) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.getLovSupplier(dtoParamPaging);
    }
    
    @RequestMapping(value = "get-lov-pic", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovPic(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody DtoParamPaging dtoParamPaging) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.getLovPic(dtoParamPaging);
    }
    
    @RequestMapping(value = "get-lov-plant", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovPlant(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody DtoParamPaging dtoParamPaging) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.getLovPlant(dtoParamPaging);
    }
    
    @RequestMapping(value = "get-lov-po", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovPo(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody DtoParamPaging dtoParamPaging) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.getLovPo(dtoParamPaging);
    }
    
    @RequestMapping(value = "get-lov-asset", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovAsset(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody DtoParamPaging dtoParamPaging) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.getLovAsset(dtoParamPaging);
    }
    
    @RequestMapping(value = "get-lov-tasklist", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovTaskList(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody DtoParamPaging dtoParamPaging) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.getLovTaskList(dtoParamPaging);
    }
    
    @RequestMapping(value = "get-lov-ikp-id", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovIkpId(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody DtoParamPaging dtoParamPaging) {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.getLovIkpId(dtoParamPaging);
    }
    
    @RequestMapping(value = "save-ikp", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse saveIkp(@RequestHeader(value = CommonConstant.JXID, defaultValue = "") String token,
            @RequestBody VoSaveIkp vo) throws Exception {
        VoPstUserCred voPstUserCred = tokenPstUtil.getUserCred(token);
        return this.serviceIkp.saveIkp(vo);
    }
}
