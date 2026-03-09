package com.phegondev.Phegon.Eccormerce.controller;

import com.phegondev.Phegon.Eccormerce.dto.OrderRequest;
import com.phegondev.Phegon.Eccormerce.dto.Response;
import com.phegondev.Phegon.Eccormerce.dto.TossConfirmRequest;
import com.phegondev.Phegon.Eccormerce.service.interf.OrderItemService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class TossPaymentController {

    @Value("${toss.secret.key}")
    private String tossSecretKey;

    private final OrderItemService orderItemService;

    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> confirmPayment(@RequestBody TossConfirmRequest request) {
        Map<String, Object> result = new HashMap<>();

        try {
            // 1. Toss API 결제 승인
            String encodedKey = Base64.getEncoder()
                    .encodeToString((tossSecretKey + ":").getBytes(StandardCharsets.UTF_8));

            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Basic " + encodedKey);
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = new HashMap<>();
            body.put("paymentKey", request.getPaymentKey());
            body.put("orderId", request.getOrderId());
            body.put("amount", request.getAmount());

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
            ResponseEntity<Map> tossResponse = restTemplate.postForEntity(
                    "https://api.tosspayments.com/v1/payments/confirm", entity, Map.class);

            if (tossResponse.getStatusCode().is2xxSuccessful()) {
                // 2. 주문 생성
                OrderRequest orderRequest = new OrderRequest();
                orderRequest.setItems(request.getItems());
                orderRequest.setTotalPrice(BigDecimal.valueOf(request.getAmount()));
                orderItemService.placeOrder(orderRequest);

                result.put("status", "success");
                result.put("message", "결제 및 주문이 완료되었습니다.");
                return ResponseEntity.ok(result);
            } else {
                result.put("error", "결제 승인 실패");
                return ResponseEntity.badRequest().body(result);
            }

        } catch (HttpClientErrorException e) {
            log.error("Toss 결제 승인 오류: {}", e.getResponseBodyAsString());
            result.put("error", "결제 승인 실패: " + e.getResponseBodyAsString());
            return ResponseEntity.badRequest().body(result);
        } catch (Exception e) {
            log.error("결제 처리 오류: {}", e.getMessage());
            result.put("error", e.getMessage());
            return ResponseEntity.internalServerError().body(result);
        }
    }
}
