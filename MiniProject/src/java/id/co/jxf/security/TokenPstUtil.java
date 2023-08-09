package id.co.jxf.security;

import id.co.jxf.constant.CommonConstant;
import id.co.jxf.security.vo.VoPstUserCred;
import id.co.jxf.security.vo.VoXToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.IncorrectClaimException;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MissingClaimException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import java.net.URLEncoder;
import java.security.Key;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.DateTime;
import org.springframework.stereotype.Component;

/**
 *
 * @author Irzan Maulana
 */
@Component(value = "tokenPstUtil")
public class TokenPstUtil {

    public Map<String, String> generateToken(VoPstUserCred voPstUserCred, List<String> services) {
        Map<String, String> result = new HashMap<String, String>();
        try {
            UUID uuid = UUID.randomUUID();
            String id = uuid.toString();
            Key key = JwtKey.generateDefaultKey();
            Map<String, Object> userCred = new HashMap<String, Object>();
            userCred.put("username", CryptoSecurity.encrypt(voPstUserCred.getUsername(), 2));
            userCred.put("email", CryptoSecurity.encrypt(voPstUserCred.getEmail(), 2));
            userCred.put("fullname", CryptoSecurity.encrypt(voPstUserCred.getFullname(), 2));
            userCred.put("area", CryptoSecurity.encrypt(voPstUserCred.getArea(), 2));
            userCred.put("userid", CryptoSecurity.encrypt(voPstUserCred.getUserid(), 2));
            userCred.put("partnerid", CryptoSecurity.encrypt(voPstUserCred.getPartnerid(), 2));
            userCred.put("partnerName", CryptoSecurity.encrypt(voPstUserCred.getPartnerName(), 2));
            userCred.put("costCenter", CryptoSecurity.encrypt(voPstUserCred.getCostCenter(), 2));
            userCred.put("plant", CryptoSecurity.encrypt(voPstUserCred.getPlant(), 2));
            userCred.put("plantDesc", CryptoSecurity.encrypt(voPstUserCred.getPlantDesc(), 2));            
            userCred.put("type", CryptoSecurity.encrypt(voPstUserCred.getType(), 2));
            userCred.put("mdH1", voPstUserCred.getMdH1());
            userCred.put("mdH2", voPstUserCred.getMdH2());
            userCred.put("mdH3", voPstUserCred.getMdH3());
            userCred.put("accountStatus", CryptoSecurity.encrypt(voPstUserCred.getAccountStatus(), 2));
            String url = "";
            for (String s : services) {
                url = url + s;
            }
            String compactJws = Jwts.builder()
                    .setClaims(userCred)
                    .setSubject("JXF")
                    .setIssuedAt(new DateTime().toDate())
                    .setId(id)
                    .signWith(SignatureAlgorithm.HS512, key)
                    .compact();
            String jxid = CryptoSecurity.encrypt(compactJws);
            result.put(CommonConstant.JXID, jxid);
            result.put(CommonConstant.TKID, id);
        } catch (Exception ex) {
            Logger.getLogger(TokenPstUtil.class.getName()).log(Level.SEVERE, null, ex);
        }
        return result;
    }

    public String generateXToken(VoXToken voXToken) {
        String xToken = null;
        try {
//            ObjectMapper mapper = new ObjectMapper();
//            // Object to JSON in String
//            String json = mapper.writeValueAsString(voXToken);
//            String encJson = CryptoSecurity.encrypt(json);
            String source_token = voXToken.getDomain() + "|" + voXToken.getUsername() + "|" + voXToken.getDisplayname()
                    + "|" + voXToken.getEmail() + "|" + voXToken.getNrp() + "|" + voXToken.getZone()
                    + "|" + voXToken.getIpaddress() + "::::" + voXToken.getOadate();

            String encJson = CryptoSecurity.encrypt(source_token);
            xToken = URLEncoder.encode(encJson, "UTF-8"); // URLDecoder.decode(url, "UTF-8");
        } catch (Exception ex) {
            Logger.getLogger(TokenPstUtil.class.getName()).log(Level.SEVERE, null, ex);
        }

        return xToken;
    }

    public VoPstUserCred getUserCred(String token) {
        if(TokenBearerAuth.isBearer(token)){
            token = TokenBearerAuth.getToken(token);
        }
        VoPstUserCred voPstUserCred = null;
        Jws<Claims> claims = extractToken(token);
        if (claims != null) {
            voPstUserCred = new VoPstUserCred();
            voPstUserCred.setUsername(CryptoSecurity.decrypt((String) claims.getBody().get("username"), 2));
            voPstUserCred.setEmail(CryptoSecurity.decrypt((String) claims.getBody().get("email"), 2));
            voPstUserCred.setFullname(CryptoSecurity.decrypt((String) claims.getBody().get("fullname"), 2));
            voPstUserCred.setArea(CryptoSecurity.decrypt((String) claims.getBody().get("area"), 2));
            voPstUserCred.setUserid(CryptoSecurity.decrypt((String) claims.getBody().get("userid"), 2));
            if (StringUtils.isNotBlank((String) claims.getBody().get("partnerid"))) {
                voPstUserCred.setPartnerid(CryptoSecurity.decrypt((String) claims.getBody().get("partnerid"), 2));
            }
            if (StringUtils.isNotBlank((String) claims.getBody().get("partnerName"))) {
                voPstUserCred.setPartnerName(CryptoSecurity.decrypt((String) claims.getBody().get("partnerName"), 2));
            }
            if (StringUtils.isNotBlank((String) claims.getBody().get("costCenter"))) {
                voPstUserCred.setCostCenter(CryptoSecurity.decrypt((String) claims.getBody().get("costCenter"), 2));
            }
            voPstUserCred.setType(CryptoSecurity.decrypt((String) claims.getBody().get("type"), 2));
            voPstUserCred.setMdH1((List<String>) (claims.getBody().get("mdH1")));
            voPstUserCred.setMdH2((List<String>) (claims.getBody().get("mdH2")));
            voPstUserCred.setMdH3((List<String>) (claims.getBody().get("mdH3")));
            voPstUserCred.setPlant(CryptoSecurity.decrypt((String) claims.getBody().get("plant"), 2));
            voPstUserCred.setPlantDesc(CryptoSecurity.decrypt((String) claims.getBody().get("plantDesc"), 2));
            voPstUserCred.setAccountStatus(CryptoSecurity.decrypt((String) claims.getBody().get("accountStatus"), 2));
        }
        return voPstUserCred;
    }

    public boolean validateUrl(String url, String svid) {
        String tmp = CryptoSecurity.decrypt(svid);
        return tmp.contains(url);
    }

    public boolean validateToken(String token, String id) {
        Jws<Claims> claims = extractToken(token);
        if (claims != null) {
            if (claims.getBody().getId().equals(id)) {
                return true;
            }
        }
        return false;
    }

    public boolean isTokenNotExpired(String token, String id) {
        Jws<Claims> claims = extractToken(token);
        if (claims != null) {
            if (claims.getBody().getId().equals(id)) {
                long now = new DateTime().getMillis();
                long issuedAt = claims.getBody().getIssuedAt().getTime();
                long delta = now - issuedAt;
//                1200000
                if (delta <= 1200000) {
                    return true;
                }
            }
        }
        return false;
    }

    public Jws<Claims> extractToken(String token) {
        if (token != null) {
            if (!token.isEmpty()) {
                try {
                    Key key = JwtKey.generateDefaultKey();
                    String tokenJwt = CryptoSecurity.decrypt(token);
                    try {
                        Jwts.parser().setSigningKey(key).parseClaimsJws(tokenJwt);
                        Jws<Claims> claims = Jwts.parser()
                                .requireSubject("JXF")
                                .setSigningKey(key)
                                .parseClaimsJws(tokenJwt);
                        return claims;
                    } catch (SignatureException e) {
                        Logger.getLogger(TokenPstUtil.class.getName()).log(Level.SEVERE, null, e);
                        //don't trust the JWT!
                    } catch (MissingClaimException e) {
                        Logger.getLogger(TokenPstUtil.class.getName()).log(Level.SEVERE, null, e);
                        // we get here if the required claim is not present
                    } catch (IncorrectClaimException e) {
                        Logger.getLogger(TokenPstUtil.class.getName()).log(Level.SEVERE, null, e);
                        // we get here if ther required claim has the wrong value
                    }
                } catch (Exception ex) {
                    Logger.getLogger(TokenPstUtil.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
        return null;
    }
    
    

}