package id.co.ahm.ga.wpm.service.impl;

import id.co.ahm.ga.wpm.util.DtoHelper;
import id.co.ahm.ga.wpm.util.DtoParamPaging;
import id.co.ahm.ga.wpm.util.DtoResponse;
import id.co.ahm.ga.wpm.util.StatusMsgEnum;
import id.co.ahm.ga.wpm.vo.VoShowTableIkp;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import id.co.ahm.ga.wpm.dao.AreaPekerjaanDao;
import id.co.ahm.ga.wpm.dao.AssetDao;
import id.co.ahm.ga.wpm.dao.HeaderIkpDao;
import id.co.ahm.ga.wpm.dao.PicDao;
import id.co.ahm.ga.wpm.dao.PlantDao;
import id.co.ahm.ga.wpm.dao.PurchasingOrderDao;
import id.co.ahm.ga.wpm.dao.SupplierDao;
import id.co.ahm.ga.wpm.dao.TaskListDao;
import id.co.ahm.ga.wpm.model.AreaPekerjaan;
import id.co.ahm.ga.wpm.model.AreaPekerjaanPk;
import id.co.ahm.ga.wpm.model.HeaderIkp;
import org.springframework.stereotype.Service;
import id.co.ahm.ga.wpm.service.ServiceIkp;
import id.co.ahm.ga.wpm.vo.VoCreateUpdateIkp;
import id.co.ahm.ga.wpm.vo.VoLovIkpId;
import id.co.ahm.ga.wpm.vo.VoCreateUpdateAreaPekerjaan;
import id.co.ahm.ga.wpm.vo.VoLovAsset;
import id.co.ahm.ga.wpm.vo.VoLovPic;
import id.co.ahm.ga.wpm.vo.VoLovPlant;
import id.co.ahm.ga.wpm.vo.VoLovPo;
import id.co.ahm.ga.wpm.vo.VoLovSupplier;
import id.co.ahm.ga.wpm.vo.VoLovTaskList;
import id.co.ahm.ga.wpm.vo.VoSaveIkp;
import id.co.ahm.ga.wpm.vo.VoShowAreaPekerjaan;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.beans.BeanUtils;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author Irzan Maulana
 */
@Service(value = "serviceIkp")
@Transactional
public class ServiceIkpImpl implements ServiceIkp {

    @Autowired
    @Qualifier(value = "headerIkpDao")
    private HeaderIkpDao headerIkpDao;

    @Autowired
    @Qualifier(value = "areaPekerjaanDao")
    private AreaPekerjaanDao areaPekerjaanDao;

    @Autowired
    @Qualifier(value = "supplierDao")
    private SupplierDao supplierDao;

    @Autowired
    @Qualifier(value = "picDao")
    private PicDao picDao;

    @Autowired
    @Qualifier(value = "plantDao")
    private PlantDao plantDao;

    @Autowired
    @Qualifier(value = "purchasingOrderDao")
    private PurchasingOrderDao purchasingOrderDao;

    @Autowired
    @Qualifier(value = "assetDao")
    private AssetDao assetDao;

    @Autowired
    @Qualifier(value = "taskListDao")
    private TaskListDao taskListDao;

    @Override
    public DtoResponse getTableIkp(DtoParamPaging input) {
        int total = headerIkpDao.getCountTableIkp(input);
        List<VoShowTableIkp> result = headerIkpDao.getTableIkp(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse getTabelArea(DtoParamPaging input) {
        int total = areaPekerjaanDao.getCountTabelArea(input);
        List<VoShowAreaPekerjaan> result = areaPekerjaanDao.getTabelArea(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse deleteIkp(String ikpId) {
        try {
            List<Object[]> listResultFindNomorAsset = areaPekerjaanDao.findNomorAssetAreaPekerjaanByIkpId(ikpId);
            List<AreaPekerjaan> listResultAreaPekerjaan = new ArrayList<>();
            for (Object[] resultFindNomorAsset : listResultFindNomorAsset) {
                AreaPekerjaanPk primaryKeyAreaPekerjaan = new AreaPekerjaanPk();
                primaryKeyAreaPekerjaan.setIkpId(ikpId);
                primaryKeyAreaPekerjaan.setAssetNo(resultFindNomorAsset[1].toString());
                listResultAreaPekerjaan.add(areaPekerjaanDao.findOne(primaryKeyAreaPekerjaan));
                areaPekerjaanDao.deleteById(primaryKeyAreaPekerjaan);
                areaPekerjaanDao.flush();
            }
            HeaderIkp deletedIkp = headerIkpDao.findOne(ikpId);
            headerIkpDao.deleteById(ikpId);
            headerIkpDao.flush();
            Map<String, Object> message = new HashMap();
            message.put("AreaPekerjaan", listResultAreaPekerjaan);
            return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, message, Arrays.asList(deletedIkp), 1);
        } catch (Exception e) {
            return DtoHelper.constructResponsePaging(StatusMsgEnum.GAGAL, null, null, 0);
        }
    }

    @Override
    public DtoResponse getAreaProjectTableIkp(DtoParamPaging input) {
        int total = headerIkpDao.getCountTableIkp(input);
        List<VoShowTableIkp> result = headerIkpDao.getTableIkp(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public List<VoShowTableIkp> exportToExcelIkp(Map<String, Object> mappedInput) {
        DtoParamPaging input = new DtoParamPaging();
        if (!(mappedInput.containsKey("nrpId"))) {
            mappedInput.put("nrpId", "");
        }
        Map<String, Object> search = mappedInput;
        String status = (String) mappedInput.get("status");
        search.put("status", Stream.of(status.split(",", -1)).collect(Collectors.toList()));
        input.setSearch(search);
        input.setOrder((String) mappedInput.get("order"));
        input.setSort((String) mappedInput.get("sort"));
        List<VoShowTableIkp> result = headerIkpDao.getTableIkp(input);
        return result;
    }

    @Override
    public VoShowTableIkp downloadIkp(Map<String, Object> mappedInput) throws Exception {
        DtoParamPaging input = new DtoParamPaging();
        if (!(mappedInput.containsKey("nrpId"))) {
            mappedInput.put("nrpId", "");
        }
        Map<String, Object> search = mappedInput;
        String status = (String) mappedInput.get("status");
        search.put("status", Stream.of(status.split(",", -1)).collect(Collectors.toList()));
        input.setSearch(search);
        input.setOrder((String) mappedInput.get("order"));
        input.setSort((String) mappedInput.get("sort"));
        List<VoShowTableIkp> listResult = headerIkpDao.getTableIkp(input);
        VoShowTableIkp result = listResult.get(0);

        List<Object[]> listResultFindNomorAsset = areaPekerjaanDao.findNomorAssetAreaPekerjaanByIkpId(result.getIkpId());
        List<VoShowAreaPekerjaan> listResultAreaPekerjaan = new ArrayList<>();
        for (Object[] resultFindNomorAsset : listResultFindNomorAsset) {
            VoShowAreaPekerjaan resultAreaPekerjaan = new VoShowAreaPekerjaan();
            AreaPekerjaanPk primaryKeyAreaPekerjaan = new AreaPekerjaanPk();
            primaryKeyAreaPekerjaan.setIkpId(result.getIkpId());
            primaryKeyAreaPekerjaan.setAssetNo(resultFindNomorAsset[1].toString());
            AreaPekerjaan areaPekerjaan = areaPekerjaanDao.findOne(primaryKeyAreaPekerjaan);
            resultAreaPekerjaan.setAreaDetail(areaPekerjaan.getAreaDetail());
            resultAreaPekerjaan.setAssetNo(areaPekerjaan.getAhmgawpmDtlikpareasPk().getAssetNo());
            resultAreaPekerjaan.setCriticality(areaPekerjaan.getCriticality());
            resultAreaPekerjaan.setInOut(areaPekerjaan.getInOut());
            resultAreaPekerjaan.setLoginPatrol(areaPekerjaan.getLoginPatrol());
            resultAreaPekerjaan.setTaskList(areaPekerjaan.getTaskList());
            listResultAreaPekerjaan.add(resultAreaPekerjaan);
        }
        result.setAreaPekerjaan(listResultAreaPekerjaan);

        return result;
    }

    @Override
    public DtoResponse getLovSupplier(DtoParamPaging input) {
        int total = supplierDao.getCountLovSupplier(input);
        List<VoLovSupplier> result = supplierDao.getLovSupplier(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse getLovPic(DtoParamPaging input) {
        int total = picDao.getCountLovPic(input);
        List<VoLovPic> result = picDao.getLovPic(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse getLovPlant(DtoParamPaging input) {
        int total = plantDao.getCountLovPlant(input);
        List<VoLovPlant> result = plantDao.getLovPlant(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse getLovPo(DtoParamPaging input) {
        int total = purchasingOrderDao.getCountLovPo(input);
        List<VoLovPo> result = purchasingOrderDao.getLovPo(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse getLovAsset(DtoParamPaging input) {
        int total = assetDao.getCountLovAsset(input);
        List<VoLovAsset> result = assetDao.getLovAsset(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse getLovTaskList(DtoParamPaging input) {
        int total = taskListDao.getCountLovTaskList(input);
        List<VoLovTaskList> result = taskListDao.getLovTaskList(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse getLovIkpId(DtoParamPaging input) {
        int total = headerIkpDao.getCountLovIkpId(input);
        List<VoLovIkpId> result = headerIkpDao.getLovIkpId(input);
        return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, result, total);
    }

    @Override
    public DtoResponse saveIkp(VoSaveIkp vo) throws Exception {
        VoCreateUpdateIkp voIkp = vo.getIkp();
        List<VoCreateUpdateAreaPekerjaan> listArea = vo.getListArea();

        HeaderIkp entityIkp = Optional.ofNullable(headerIkpDao.findOne(voIkp.getIkpId()))
                .orElse(new HeaderIkp());

        SimpleDateFormat format = new SimpleDateFormat("dd-MM-yyyy");

        BeanUtils.copyProperties(voIkp, entityIkp);

        if (voIkp.getIkpId().isEmpty()) {
            entityIkp.setIkpId(ikpId(entityIkp.getPlantId()));
            entityIkp.setStatus("00-IKP");
        } else {
            entityIkp.setIkpId(voIkp.getIkpId());
            entityIkp.setStatus(voIkp.getStatus());
        }

        headerIkpDao.save(entityIkp);
        headerIkpDao.flush();

        for (int i = 0; i < listArea.size(); i++) {
//            VoCreateUpdateAreaPekerjaan voArea = new VoCreateUpdateAreaPekerjaan();

            AreaPekerjaanPk pk = new AreaPekerjaanPk();
            if (listArea.get(i).getIkpId().isEmpty()) {
                pk.setIkpId(entityIkp.getIkpId());
            } else {
                pk.setIkpId(listArea.get(i).getIkpId());
            }
            pk.setAssetNo(listArea.get(i).getAssetNo());

            AreaPekerjaan entityArea = Optional.ofNullable(areaPekerjaanDao.findOne(pk))
                    .orElse(new AreaPekerjaan());

            entityArea.setAhmgawpmDtlikpareasPk(pk);
            entityArea.setAreaDetail(listArea.get(i).getAreaDetail());
            entityArea.setCriticality(listArea.get(i).getCriticality());
            entityArea.setInOut(listArea.get(i).getInOut());
            entityArea.setLoginPatrol(listArea.get(i).getLoginPatrol());
            entityArea.setTaskList(listArea.get(i).getTaskList());
            areaPekerjaanDao.save(entityArea);
            areaPekerjaanDao.flush();
        }

        return DtoHelper.constructResponse(StatusMsgEnum.SUKSES, null, Arrays.asList(entityIkp));
    }

    @Override
    public DtoResponse saveArea(VoCreateUpdateAreaPekerjaan vo) {
        AreaPekerjaanPk pk = new AreaPekerjaanPk();
        pk.setIkpId(vo.getIkpId());
        pk.setAssetNo(vo.getAssetNo());

        AreaPekerjaan entityArea = Optional.ofNullable(areaPekerjaanDao.findOne(pk))
                .orElse(new AreaPekerjaan());

        entityArea.setAhmgawpmDtlikpareasPk(pk);
        entityArea.setAreaDetail(vo.getAreaDetail());
        entityArea.setCriticality(vo.getCriticality());
        entityArea.setInOut(vo.getInOut());
        entityArea.setLoginPatrol(vo.getLoginPatrol());
        entityArea.setTaskList(vo.getTaskList());
        areaPekerjaanDao.save(entityArea);
        areaPekerjaanDao.flush();

        return DtoHelper.constructResponse(StatusMsgEnum.SUKSES, null, Arrays.asList(entityArea));
    }

    @Override
    public DtoResponse deleteArea(String ikpId, String assetNo) {
        try {
            AreaPekerjaanPk primaryKeyAreaPekerjaan = new AreaPekerjaanPk();
            primaryKeyAreaPekerjaan.setIkpId(ikpId);
            primaryKeyAreaPekerjaan.setAssetNo(assetNo);
            AreaPekerjaan entityArea = areaPekerjaanDao.findOne(primaryKeyAreaPekerjaan);
            areaPekerjaanDao.deleteById(primaryKeyAreaPekerjaan);
            areaPekerjaanDao.flush();

            return DtoHelper.constructResponsePaging(StatusMsgEnum.SUKSES, null, Arrays.asList(entityArea), 1);
        } catch (Exception e) {
            return DtoHelper.constructResponsePaging(StatusMsgEnum.GAGAL, null, null, 0);
        }
    }

    private String ikpId(String plantId) {

        SimpleDateFormat bulan = new SimpleDateFormat("MM");
        SimpleDateFormat tahun = new SimpleDateFormat("yyyy");

        Date newDate = new Date();
        String month = bulan.format(newDate);
        String year = tahun.format(newDate);

        List<String> sequence = headerIkpDao.findSequence(plantId, monthToRomawi(month), year);
        String splitSequence = "0000";
        int splitSequenceValue = 0;
        if (sequence == null || sequence.isEmpty()) {
            splitSequenceValue = (Integer.parseInt(splitSequence)) + 1;
            int length = String.valueOf(splitSequenceValue).length();
            splitSequence = generateSequence(length, splitSequenceValue);
        } else {
            String maxValue = Collections.max(sequence);
            splitSequence = maxValue.substring(maxValue.lastIndexOf('/') + 1);
            splitSequenceValue = (Integer.parseInt(splitSequence)) + 1;
            int length = String.valueOf(splitSequenceValue).length();
            splitSequence = generateSequence(length, splitSequenceValue);
        }

        String ikpId = "IKP/" + plantId + "/"
                + monthToRomawi(month) + "/" + year + "/" + splitSequence;

        return ikpId;
    }

    private String monthToRomawi(String date) {
        date = date.replace("01", "I");
        date = date.replace("02", "II");
        date = date.replace("03", "III");
        date = date.replace("04", "IV");
        date = date.replace("05", "V");
        date = date.replace("06", "VI");
        date = date.replace("07", "VII");
        date = date.replace("08", "VIII");
        date = date.replace("09", "IX");
        date = date.replace("10", "X");
        date = date.replace("11", "XI");
        date = date.replace("12", "XII");
        return date;
    }

    private String generateSequence(int digit, int value) {
        int maxDigit = 5;
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < maxDigit - digit; i++) {
            sb.append('0');
        }
        sb.append(value);
        return sb.toString();
    }

}
