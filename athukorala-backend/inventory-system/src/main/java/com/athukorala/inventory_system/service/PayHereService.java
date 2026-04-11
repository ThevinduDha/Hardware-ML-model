package com.athukorala.inventory_system.service;

import org.springframework.stereotype.Service;

import java.security.MessageDigest;

@Service
public class PayHereService {

    private final String MERCHANT_ID = "1235088";

    // 🔥 VERY IMPORTANT: paste REAL secret from PayHere dashboard
    private final String MERCHANT_SECRET = "MTA2NTUxOTA0MTMzMDQ1MDE0NzcyMzI4OTY1OTI1OTkzMTI4Nzk4";

    // 🔥 HASH GENERATION (FINAL CORRECT)
    public String generateHash(String orderId, String amount, String currency) {
        try {
            String formattedAmount = String.format("%.2f", Double.parseDouble(amount));

            String merchantSecretMd5 = md5(MERCHANT_SECRET).toUpperCase();

            String hashString = MERCHANT_ID + orderId + formattedAmount + currency + merchantSecretMd5;

            return md5(hashString).toUpperCase();

        } catch (Exception e) {
            throw new RuntimeException("Hash generation failed");
        }
    }

    // 🔥 MD5 HELPER
    private String md5(String input) throws Exception {
        MessageDigest md = MessageDigest.getInstance("MD5");
        byte[] digest = md.digest(input.getBytes("UTF-8"));

        StringBuilder hex = new StringBuilder();
        for (byte b : digest) {
            hex.append(String.format("%02x", b));
        }

        return hex.toString();
    }
}