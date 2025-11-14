package com.nikguscode.orchestrator.core.service.authentication;

import com.github.dockerjava.zerodep.shaded.org.apache.commons.codec.binary.Hex;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.stream.Collectors;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

@Service
public class MaxHashVerifyService {
  private static final String HMAC_SHA256 = "HmacSHA256";
  private static final String SECRET_INFO_KEY = "WebAppData";

  private final String maxBotToken;

  public MaxHashVerifyService(@Value("${max.bot.token}") String maxBotToken) {
    this.maxBotToken = maxBotToken;
  }

  public boolean check(String miniAppInitData) {
    String decodedData = URLDecoder.decode(miniAppInitData, StandardCharsets.UTF_8);

    Map<String, String> data = UriComponentsBuilder.fromUriString("?" + decodedData)
        .build()
        .getQueryParams()
        .toSingleValueMap();

    String receivedHash = data.remove("hash");
    if (receivedHash == null) {
      return false;
    }

    String dataCheckString = getParsedString(data);

    String calculatedHash = calculateDataHash(maxBotToken, dataCheckString);
    return calculatedHash.equalsIgnoreCase(receivedHash);
  }

  private String getParsedString(Map<String, String> data) {
    return data.entrySet().stream()
        .sorted(Map.Entry.comparingByKey())
        .map(e -> e.getKey() + "=" + e.getValue())
        .collect(Collectors.joining("\n"));
  }

  private String calculateDataHash(String botToken, String dataCheckString) {
    try {
      Mac mac = Mac.getInstance(HMAC_SHA256);
      mac.init(new SecretKeySpec(SECRET_INFO_KEY.getBytes(StandardCharsets.UTF_8), HMAC_SHA256));
      byte[] secretKeyBytes = mac.doFinal(botToken.getBytes(StandardCharsets.UTF_8));

      Mac mac2 = Mac.getInstance(HMAC_SHA256);
      mac2.init(new SecretKeySpec(secretKeyBytes, HMAC_SHA256));
      byte[] hmacBytes = mac2.doFinal(dataCheckString.getBytes(StandardCharsets.UTF_8));

      return Hex.encodeHexString(hmacBytes);
    } catch (Exception e) {
      throw new RuntimeException(e);
    }
  }
}