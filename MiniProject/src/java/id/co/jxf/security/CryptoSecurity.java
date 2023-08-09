package id.co.jxf.security;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.Key;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import org.apache.tomcat.util.codec.binary.Base64;

/**
 *
 * @author Irzan Maulana
 */
public class CryptoSecurity {

    public static String key = "12345678901234567890123456789012";
    public static byte[] key_Array = Base64.decodeBase64(key);

    public static byte[] loadKey(int key) {
        InputStream input = null;
        byte[] result = key_Array;

        try {
            Properties prop = new Properties();
            String pathConfig = System.getProperty("jxconfig");
            input = new FileInputStream(pathConfig);
            // load a properties file
            prop.load(input);
            String tmp;
            if (key == 2) {
                tmp = prop.getProperty("key" + key);
            } else {
                tmp = prop.getProperty("key");
            }

            result = Base64.decodeBase64(tmp);
        } catch (IOException ex) {
            Logger.getLogger(CryptoSecurity.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            try {
                if (input != null) {
                    input.close();
                }
            } catch (IOException ex) {
                Logger.getLogger(CryptoSecurity.class.getName()).log(Level.SEVERE, null, ex);
            }
        }

        return result;
    }

    public static String encrypt(String strToEncrypt, int key) {
        try {
            //Cipher _Cipher = Cipher.getInstance("AES");
            //Cipher _Cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
            Cipher _Cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");

            // Initialization vector.   
            // It could be any value or generated using a random number generator.
            byte[] iv = {1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 7, 7, 7, 7};
            IvParameterSpec ivspec = new IvParameterSpec(iv);

            Key SecretKey = new SecretKeySpec(loadKey(key), "AES");
            _Cipher.init(Cipher.ENCRYPT_MODE, SecretKey, ivspec);

            return Base64.encodeBase64String(_Cipher.doFinal(strToEncrypt.getBytes()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String encrypt(String strToEncrypt) {
        try {
            //Cipher _Cipher = Cipher.getInstance("AES");
            //Cipher _Cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
            Cipher _Cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");

            // Initialization vector.   
            // It could be any value or generated using a random number generator.
            byte[] iv = {1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 7, 7, 7, 7};
            IvParameterSpec ivspec = new IvParameterSpec(iv);

            Key SecretKey = new SecretKeySpec(loadKey(1), "AES");
            _Cipher.init(Cipher.ENCRYPT_MODE, SecretKey, ivspec);

            return Base64.encodeBase64String(_Cipher.doFinal(strToEncrypt.getBytes()));
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public static String decrypt(String EncryptedMessage, int key) {
        try {
            //Cipher _Cipher = Cipher.getInstance("AES");
            //Cipher _Cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
            Cipher _Cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");

            // Initialization vector.   
            // It could be any value or generated using a random number generator.
            byte[] iv = {1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 7, 7, 7, 7};
            IvParameterSpec ivspec = new IvParameterSpec(iv);

            Key SecretKey = new SecretKeySpec(loadKey(key), "AES");
            _Cipher.init(Cipher.DECRYPT_MODE, SecretKey, ivspec);

            byte DecodedMessage[] = Base64.decodeBase64(EncryptedMessage);
            return new String(_Cipher.doFinal(DecodedMessage));

        } catch (Exception e) {
            e.printStackTrace();

        }
        return null;
    }

    public static String decrypt(String EncryptedMessage) {
        try {
            //Cipher _Cipher = Cipher.getInstance("AES");
            //Cipher _Cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
            Cipher _Cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");

            // Initialization vector.   
            // It could be any value or generated using a random number generator.
            byte[] iv = {1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 1, 7, 7, 7, 7};
            IvParameterSpec ivspec = new IvParameterSpec(iv);

            Key SecretKey = new SecretKeySpec(loadKey(1), "AES");
            _Cipher.init(Cipher.DECRYPT_MODE, SecretKey, ivspec);

            byte DecodedMessage[] = Base64.decodeBase64(EncryptedMessage);
            return new String(_Cipher.doFinal(DecodedMessage));

        } catch (Exception e) {
            e.printStackTrace();

        }
        return null;
    }

    public static void main(String[] args) throws Exception {

    }

}
