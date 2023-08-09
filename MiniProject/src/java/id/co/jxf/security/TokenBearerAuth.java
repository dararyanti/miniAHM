package id.co.jxf.security;

import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author Irzan Maulana
 */
public class TokenBearerAuth {

    public static String getToken(HttpServletRequest httpServletRequest) {
        String header = httpServletRequest.getHeader("Authorization");
        if (header != null) {
            header = header.replaceAll("Bearer ", "");
            header = StringUtils.trim(header.trim());
        }
        return header;
    }

    public static String getToken(String header) {
        if (header != null) {
            header = header.replaceAll("Bearer ", "");
            header = StringUtils.trim(header.trim());
        }
        return header;
    }

    public static boolean isBearer(String header) {
        if (header != null) {
            if (!header.isEmpty()) {
                if (header.substring(0, 6).equals("Bearer")) {
                    return true;
                } 
            }
        }
        return false;
    }
}
