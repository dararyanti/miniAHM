package id.co.ahm.ga.wpm.rest;

import id.co.ahm.ga.wpm.rest.view.DownloadPdfIkp;
import id.co.ahm.ga.wpm.rest.view.ExportExcelIkp;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import id.co.ahm.ga.wpm.service.ServiceIkp;
import id.co.ahm.ga.wpm.vo.VoCreateUpdateAreaPekerjaan;
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
    @Qualifier(value = "serviceIkp")
    private ServiceIkp serviceIkp;

    @RequestMapping(value = "get-ikp-table", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getIkpTable(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getTableIkp(dtoParamPaging);
    }

    @RequestMapping(value = "delete-ikp", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse deleteIkp(@RequestParam String ikpId) {
        return this.serviceIkp.deleteIkp(ikpId);
    }

    @RequestMapping(value = "get-areaproject-table", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getAreaTable(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getAreaProjectTableIkp(dtoParamPaging);
    }

    @RequestMapping(value = "export-to-excel-ikp",
            method = RequestMethod.GET)
    public @ResponseBody
    ModelAndView exportToExcelIkp(@RequestParam Map<String, Object> params) {
        ModelAndView model = new ModelAndView(new ExportExcelIkp(), "IKP", this.serviceIkp.exportToExcelIkp(params));
        return model;
    }

    @RequestMapping(value = "download-ikp",
            method = RequestMethod.GET)
    public @ResponseBody
    ModelAndView downloadIkp(@RequestParam Map<String, Object> params) throws Exception {
        ModelAndView model = new ModelAndView(new DownloadPdfIkp(), "IKP", this.serviceIkp.downloadIkp(params));
        return model;
    }

    @RequestMapping(value = "get-lov-supplier", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovSupplier(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getLovSupplier(dtoParamPaging);
    }

    @RequestMapping(value = "get-lov-pic", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovPic(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getLovPic(dtoParamPaging);
    }

    @RequestMapping(value = "get-lov-plant", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovPlant(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getLovPlant(dtoParamPaging);
    }

    @RequestMapping(value = "get-lov-po", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovPo(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getLovPo(dtoParamPaging);
    }

    @RequestMapping(value = "get-lov-asset", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovAsset(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getLovAsset(dtoParamPaging);
    }

    @RequestMapping(value = "get-lov-tasklist", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovTaskList(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getLovTaskList(dtoParamPaging);
    }

    @RequestMapping(value = "get-lov-ikp-id", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getLovIkpId(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getLovIkpId(dtoParamPaging);
    }

    @RequestMapping(value = "save-ikp", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse saveIkp(@RequestBody VoSaveIkp vo) throws Exception {
        return this.serviceIkp.saveIkp(vo);
    }

    @RequestMapping(value = "get-area-table", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse getTabelArea(@RequestBody DtoParamPaging dtoParamPaging) {
        return this.serviceIkp.getTabelArea(dtoParamPaging);
    }

    @RequestMapping(value = "save-area", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse saveArea(@RequestBody VoCreateUpdateAreaPekerjaan vo) throws Exception {
        return this.serviceIkp.saveArea(vo);
    }

    @RequestMapping(value = "delete-area", method = RequestMethod.POST,
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    DtoResponse deleteArea(@RequestParam String ikpId, @RequestParam String assetNo) {
        return this.serviceIkp.deleteArea(ikpId, assetNo);
    }
}
