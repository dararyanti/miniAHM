package id.co.ahm.ga.wpm.util;

import id.co.ahm.ga.wpm.util.vo.VoColumn;
import id.co.ahm.ga.wpm.util.vo.VoMessageWorkspace;
import id.co.jxf.constant.CommonConstant;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

/**
 *
 * @author Irzan Maulana
 */
public class DtoHelper {

    public static DtoResponsePaging constructResponsePaging(StatusMsgEnum sme, Map<String, Object> msg, List data, int total) {
        DtoResponse dtoResponse = constructResponse(sme, msg, data);
        DtoResponsePaging dtoResponsePaging = new DtoResponsePaging();
        dtoResponsePaging.setStatus(dtoResponse.getStatus());
        dtoResponsePaging.setData(dtoResponse.getData());
        dtoResponsePaging.setMessage(dtoResponse.getMessage());
        dtoResponsePaging.setTotal(total);
        return dtoResponsePaging;
    }

    public static DtoResponse constructResponse(StatusMsgEnum sme, Map<String, Object> msg, List data) {
        DtoResponse dtoRespond = null;
        if (null != sme) {
            switch (sme) {
                case GAGAL:
                    dtoRespond = new DtoResponse();
                    dtoRespond.setStatus(CommonConstant._0);
                    dtoRespond.addMessage(CommonConstant.MESSAGE, CommonConstant.GAGAL);
                    break;
                case SUKSES:
                    dtoRespond = new DtoResponse();
                    dtoRespond.setStatus(CommonConstant._1);
                    dtoRespond.addMessage(CommonConstant.MESSAGE, CommonConstant.SUKSES);
                    break;
                default:
                    return null;
            }
        }
        if (msg != null) {
            for (Map.Entry<String, Object> entry : msg.entrySet()) {
                dtoRespond.addMessage(entry.getKey(), entry.getValue());
            }
        }
        if (data != null) {
            dtoRespond.setData(data);
        }
        return dtoRespond;
    }

    public static DtoResponse constructResponse(StatusMsgEnum sme, Map<String, Object> msg, String note, Map<String, List<String>> detailMessage, List data) {
        if (note != null) {
            if (msg == null) {
                msg = new HashMap<String, Object>();
            }
            msg.put("note", note);
        }
        if (detailMessage != null) {
            if (msg == null) {
                msg = new HashMap<String, Object>();
            }
            msg.put("details", detailMessage);
        }
        DtoResponse dtoResponse = constructResponse(sme, msg, data);
        return dtoResponse;
    }

    public static DtoResponse constructResponseInvalidRequest() {
        DtoResponse dtoResponse = new DtoResponse();
        dtoResponse.setStatus("0");
        dtoResponse.addMessage("authentication", "Invalid Request");
        dtoResponse.addMessage("authorization", "Invalid Request");
        return dtoResponse;
    }

    public static <Z> DtoResponseWorkspace constructResponseWorkspace(StatusMsgEnum sme, Map<String, Object> msg, Z data) {
        DtoResponseWorkspace dtoRespond = null;
        VoMessageWorkspace vmw = null;
        if (null != sme) {
            switch (sme) {
                case GAGAL:
                    dtoRespond = new DtoResponseWorkspace();
                    dtoRespond.setStatus(CommonConstant._0);
                    vmw = new VoMessageWorkspace();
                    vmw.setF(CommonConstant.MESSAGE);
                    vmw.setM(CommonConstant.GAGAL);
                    dtoRespond.addMessage(vmw);
                    break;
                case SUKSES:
                    dtoRespond = new DtoResponseWorkspace();
                    dtoRespond.setStatus(CommonConstant._1);
                    vmw = new VoMessageWorkspace();
                    vmw.setF(CommonConstant.MESSAGE);
                    vmw.setM(CommonConstant.SUKSES);
                    dtoRespond.addMessage(vmw);
                    break;
                default:
                    return null;
            }
        }
        if (msg != null) {
            for (Map.Entry<String, Object> entry : msg.entrySet()) {
                vmw = new VoMessageWorkspace();
                vmw.setF(entry.getKey());
                vmw.setM((String) entry.getValue());
                dtoRespond.addMessage(vmw);
            }
        }
        if (data != null) {
            dtoRespond.setData(data);
        }
        return dtoRespond;
    }

    public static <Z> DtoResponseWorkspace constructResponseWorkspace(StatusMsgEnum sme, Map<String, Object> msg, String note, Map<String, List<String>> detailMessage, Z data) {
        DtoResponseWorkspace dtoRespond = constructResponseWorkspace(sme, msg, data);
        dtoRespond.setMessage(note);
        if (detailMessage != null) {
            for (Map.Entry<String, List<String>> entry : detailMessage.entrySet()) {
                for (String msgDetail : entry.getValue()) {
                    VoMessageWorkspace vmw = new VoMessageWorkspace();
                    vmw.setF(entry.getKey());
                    vmw.setM(msgDetail);
                    dtoRespond.addMessage(vmw);
                }
            }
        }
        return dtoRespond;
    }

    public static <Z> DtoResponseWorkspace constructResponseWorkspace(StatusMsgEnum sme, String note, List<VoMessageWorkspace> detailMessage, Z data) {
        DtoResponseWorkspace dtoRespond = null;
        if (null != sme) {
            switch (sme) {
                case GAGAL:
                    dtoRespond = new DtoResponseWorkspace();
                    dtoRespond.setStatus(CommonConstant._0);
                    dtoRespond.setMessage(CommonConstant.GAGAL);
                    if (note != null) {
                        dtoRespond.setMessage(note);
                    }
                    break;
                case SUKSES:
                    dtoRespond = new DtoResponseWorkspace();
                    dtoRespond.setStatus(CommonConstant._1);
                    dtoRespond.setMessage(CommonConstant.SUKSES);
                    if (note != null) {
                        dtoRespond.setMessage(note);
                    }
                    break;
                default:
                    return null;
            }
        }
        if (data != null) {
            dtoRespond.setData(data);
        }
        if (detailMessage != null) {
            dtoRespond.setError_fields(detailMessage);
        }
        return dtoRespond;
    }

    public static DtoResponsePagingWorkspace constructResponsePagingWorkspace(StatusMsgEnum sme, String note, List<VoMessageWorkspace> detailMessage, List data, int count) {
        DtoResponseWorkspace drw = constructResponseWorkspace(sme, note, detailMessage, null);
        DtoResponsePagingWorkspace drpw = new DtoResponsePagingWorkspace();
        drpw.setStatus(drw.getStatus());
        drpw.setError_fields(detailMessage);
        drpw.setData(data);
        drpw.setRecordsTotal(count);
        drpw.setRecordsFiltered(count);
        drpw.setMessage(note);
        return drpw;
    }

    public static void copyToVo(Object source, Object target, String... excludedAttributes) {
        try {
            if (source != null && target != null) {
                String fieldPkName = source.getClass().getTypeName() + "PK";
                //Field[] fields = source.getClass().getDeclaredFields();
                List<Field> fields = getAllFields(new LinkedList<>(), source.getClass());
                for (Field field : fields) {
                    Boolean isExcluded = false;
                    for (String excludeAttr : excludedAttributes) {
                        if (field.getName().equals(excludeAttr)) {
                            isExcluded = true;
                        }
                    }
                    if (!isExcluded) {
                        String dtoColumnName;
                        field.setAccessible(Boolean.TRUE);

                        if (fieldPkName.equals(field.getType().getName())) {
                            Object o = field.get(source);
                            copyToVo(o, target);
                        }

                        if (field.isAnnotationPresent(VoColumn.class)) {
                            VoColumn fAnno = field.getAnnotation(VoColumn.class);
                            dtoColumnName = fAnno.name();
                        } else {
                            String getterName = "get" + field.getName().substring(0, 1).toUpperCase()
                                    + field.getName().substring(1);
                            Method method;
                            try {
                                method = source.getClass().getMethod(getterName);
                                if (method.isAnnotationPresent(VoColumn.class)) {
                                    VoColumn mAnno = method.getAnnotation(VoColumn.class);
                                    dtoColumnName = mAnno.name();
                                } else {
                                    continue;
                                }
                            } catch (NoSuchMethodException nme) {
                                continue;
                            }
                        }
                        Object value = field.get(source);
                        Field fieldTarget = target.getClass().getDeclaredField(dtoColumnName);
                        fieldTarget.setAccessible(true);
                        fieldTarget.set(target, value);
                    }
                }
            }
        } catch (IllegalAccessException | IllegalArgumentException | NoSuchFieldException | SecurityException e) {
            e.printStackTrace();
        }
    }

    private static List<Field> getAllFields(List<Field> fields, Class<?> type) {
        fields.addAll(Arrays.asList(type.getDeclaredFields()));
        if (type.getSuperclass() != null) {
            getAllFields(fields, type.getSuperclass());
        }
        return fields;
    }

}
