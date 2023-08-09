package id.co.jxf.security;

import java.security.Key;
import javax.crypto.spec.SecretKeySpec;

/**
 *
 * @author Irzan Maulana
 */
public class JwtKey {

    private static final String passPhrase = "6jWaODzbSzCLgdRKhfuOD4VJyhSLvL43";

    public static Key generateDefaultKey() throws Exception {
        return generateKey(passPhrase);
    }

    public static Key generateKey(String passphrase) throws Exception {
        SecretKeySpec key = new SecretKeySpec(passphrase.getBytes(), "AES");
        return key;
    }

}
