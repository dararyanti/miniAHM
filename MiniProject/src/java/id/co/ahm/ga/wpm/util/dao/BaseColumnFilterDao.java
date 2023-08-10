package id.co.ahm.ga.wpm.util.dao;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.function.Predicate;
import javax.persistence.Query;
import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author Irzan Maulana
 */
public class BaseColumnFilterDao {

    private final List<String> operatorSign = Arrays.asList("or", "and");

    private final List<String> operator1Sign = Arrays.asList(">=", ">", "<", "<=", "=");

    public enum WHERE_TYPE {
        STRING, NUMBER, DATE
    };

    public Param setParam(String colName, WHERE_TYPE type, Predicate<?> p) {
        return new Param(colName, type, p);
    }

    public class Param {

        Predicate p;
        private String colName;
        private WHERE_TYPE type;

        public Param(String colName, WHERE_TYPE type, Predicate p) {
            this.p = p;
            this.colName = colName;
            this.type = type;
        }

        public Predicate getP() {
            return p;
        }

        public void setP(Predicate p) {
            this.p = p;
        }

        public String getColName() {
            return colName;
        }

        public void setColName(String colName) {
            this.colName = colName;
        }

        public WHERE_TYPE getType() {
            return type;
        }

        public void setType(WHERE_TYPE type) {
            this.type = type;
        }

    }

    public void setWhereExpressionValue(Query q, String expression,
            String colName, WHERE_TYPE type) {

        //String identifier = "_" + colName;
        String initial = "P";
        String[] tmpSplit = expression.split(" ");
        String[] tmp = formatExpression(tmpSplit, false);
        String[] tmpValue = formatExpression(tmpSplit, true);
        for (int i = 0; i < tmp.length; i++) {
            if (!tmp[i].equals("")) {
                String filterValue = StringUtils.normalizeSpace(StringUtils.replace(tmpValue[i], "~", " "));
                if (isOperator(tmp[i])) {
                    //do nothing
                } else if (isOperator1(tmp[i])) {

                    int tmpIdx = i + 1;

                    if (tmpIdx >= tmp.length) {
                        break;
                    }

                    String filterValue2 = StringUtils.normalizeSpace(StringUtils.replace(tmpValue[tmpIdx], "~", " "));
                    String param = StringUtils.replace(tmp[tmpIdx], "-", "");

                    q.setParameter(initial + StringUtils.replace(param, "&", "") + colName, filterValue2);

                    ++i;

                } else if (isOperand(tmp[i])) {

                    String param = StringUtils.replace(tmp[i], "-", "");

                    if (type.equals(WHERE_TYPE.STRING)) {
                        q.setParameter(initial + StringUtils.replace(param, "&", "") + colName, "%" + filterValue.toLowerCase() + "%");
                    } else {
                        q.setParameter(initial + StringUtils.replace(param, "&", "") + colName, filterValue);
                    }

                }

            }

        }

    }

//    public static void main(String[] args) {
//        BaseColumnFilterDao d = new BaseColumnFilterDao();
//        System.out.println(d.setWhereExpression("DATA A AND DATA B OR DATA", "columz", WHERE_TYPE.STRING));
//    }

    public String setWhereExpression(String expression, String colName,
            WHERE_TYPE type) {

        if (StringUtils.startsWithAny(expression.toLowerCase(), "or", "and", " or ", " and ")) {
            throw new RuntimeException("Not a valid WHERE Expression");
        }

        String initial = "P";
        //String identifier = "_" + colName;
        String[] tmp = formatExpression(expression.split(" "), false);

        String result = "";

        boolean valid = true;

        for (int i = 0; i < tmp.length; i++) {
            if (!tmp[i].equals("")) {
                if (isOperator(tmp[i])) {

                    result = result + " " + tmp[i];

                } else if (isOperator1(tmp[i])) {

                    int tmpIdx = i + 1;

                    if (tmpIdx >= tmp.length) {

                        valid = false;

                        break;

                    }
                    //                if (i != 0) {
                    //                    if (!isOperator(tmp[i - 1])) {
                    //                        result = result + " AND ";
                    //                    }
                    //                }
                    String val = StringUtils.replace(tmp[tmpIdx], "-", "");
                    if (type.equals(WHERE_TYPE.STRING)) {
                        result = result + " lower( " + colName + " ) " + tmp[i] + ":" + initial + StringUtils.replace(val, "&", "") + colName + " ";
                    } else if (type.equals(WHERE_TYPE.DATE)) {
                        result = result + " " + " trunc( " + colName + " ) " + " " + tmp[i] + ":" + initial + StringUtils.replace(val, "&", "") + colName + " ";
                    } else {
                        result = result + " " + colName + " " + tmp[i] + ":" + initial + StringUtils.replace(val, "&", "") + colName + " ";
                    }

                    ++i;

                } else if (isOperand(tmp[i])) {
                    //                if (i != 0) {
                    //                    if (!isOperator(tmp[i - 1])) {
                    //                        result = result + " AND ";
                    //                    }
                    //                }
                    String val = StringUtils.replace(tmp[i], "-", "");

                    if (type.equals(WHERE_TYPE.STRING)) {
                        result = result + " lower( " + colName + " ) like :" + initial + StringUtils.replace(val, "&", "") + colName + " ";
                    } else if (type.equals(WHERE_TYPE.DATE)) {
                        result = result + " trunc( " + colName + " ) = :" + initial + StringUtils.replace(val, "&", "") + colName + " ";
                    } else {
                        result = result + " " + colName + " = :" + initial + StringUtils.replace(val, "&", "") + colName + " ";
                    }

                }
            }
        }

        if (!valid) {
            throw new RuntimeException("Not a valid WHERE Expression");
        }

        return result;

    }

    private static String[] formatExpression(String[] temp, boolean actionValue) {
        List<String> listData = new ArrayList<String>();
        for (int i = 0; i <= temp.length - 1; i++) {
            if (temp[i].equalsIgnoreCase("OR") || temp[i].equalsIgnoreCase("AND")
                    || temp[i].equalsIgnoreCase(">=") || temp[i].equalsIgnoreCase(">")
                    || temp[i].equalsIgnoreCase("<") || temp[i].equalsIgnoreCase("<=")
                    || temp[i].equalsIgnoreCase("=")) {

                listData.add(" " + temp[i] + " ");
            } else {
                if (actionValue) {
                    listData.add(temp[i] + "~");
                } else {
                    listData.add(temp[i] + "_");
                }
            }
        }
        String result = "";
        for (String t : listData) {
            result += t;
        }
        return result.split(" ");
    }

    private boolean isOperator(String s) {

        for (int i = 0; i < operatorSign.size(); i++) {

            if (operatorSign.get(i).equalsIgnoreCase(s)) {
                return true;
            }

        }

        return false;

    }

    private boolean isOperator1(String s) {

        for (int i = 0; i < operator1Sign.size(); i++) {

            if (operator1Sign.get(i).equalsIgnoreCase(s)) {
                return true;
            }

        }

        return false;

    }

    private boolean isOperand(String s) {
        return !((isOperator(s)) || (isOperator1(s)));
    }

    public void setWhereExpression(StringBuilder sql, Map<String, Object> filters,
            Map<String, Param> mapParam) {

        if (filters != null && filters.size() > 0) {

            filters.entrySet().stream().forEach((filter) -> {

                String key = filter.getKey();
                String value = (String) filter.getValue();

                if (mapParam.containsKey(key)) {

                    Boolean doWhereExpression = false;
                    Param param = mapParam.get(key);

                    if (param.getP() == null) {
                        if (StringUtils.isNotEmpty(value)) {
                            doWhereExpression = true;
                        }
                    } else {
                        if (param.getP().test(value)) {
                            doWhereExpression = true;
                        }
                    }

                    if (doWhereExpression) {
                        sql.append(" AND ")
                                .append(" ( ")
                                .append(setWhereExpression(value, param.getColName(), param.getType()))
                                .append(" ) ");
                    }

                }

            });

        }

        System.out.println(sql.toString());

    }

    public void setWhereExpressionValue(Query q, Map<String, Object> filters,
            Map<String, Param> mapParam) {

        if (filters != null && filters.size() > 0) {

            filters.entrySet().stream().forEach((filter) -> {

                String key = filter.getKey();
                String value = (String) filter.getValue();

                if (mapParam.containsKey(key)) {

                    Boolean doWhereExpression = false;
                    Param param = mapParam.get(key);

                    if (param.getP() == null) {
                        if (StringUtils.isNotEmpty(value)) {
                            doWhereExpression = true;
                        }
                    } else {
                        if (param.getP().test(value)) {
                            doWhereExpression = true;
                        }
                    }

                    if (doWhereExpression) {
                        setWhereExpressionValue(q, value, param.getColName(), param.getType());
                    }

                }

            });

        }

    }

}
