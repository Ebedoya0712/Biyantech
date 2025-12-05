<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BinancePayService
{
    protected $mode;
    protected $apiKey;
    protected $secretKey;
    protected $merchantId;
    protected $baseUrl;

    public function __construct()
    {
        $this->mode = config('services.binance_pay.mode', 'mock');
        $this->apiKey = config('services.binance_pay.api_key');
        $this->secretKey = config('services.binance_pay.secret_key');
        $this->merchantId = config('services.binance_pay.merchant_id');
        $this->baseUrl = config('services.binance_pay.base_url');
    }

    /**
     * Crear una orden de pago en Binance Pay
     */
    public function createOrder($orderData)
    {
        // Si estamos en modo MOCK, retornar datos simulados
        if ($this->mode === 'mock') {
            return $this->createMockOrder($orderData);
        }

        // Modo producción: llamar a la API real de Binance
        $endpoint = '/binancepay/openapi/v2/order';
        $body = [
            'env' => [
                'terminalType' => 'WEB'
            ],
            'merchantTradeNo' => $orderData['merchant_trade_no'],
            'orderAmount' => $orderData['amount'],
            'currency' => $orderData['currency'] ?? 'USD',
            'goods' => [
                'goodsType' => '02', // Virtual goods
                'goodsCategory' => 'D000', // Digital content
                'referenceGoodsId' => $orderData['reference_id'],
                'goodsName' => $orderData['goods_name'],
                'goodsDetail' => $orderData['goods_detail'] ?? $orderData['goods_name']
            ],
            'returnUrl' => $orderData['return_url'] ?? url('/payment-success'),
            'cancelUrl' => $orderData['cancel_url'] ?? url('/payment-cancel')
        ];

        $response = $this->makeRequest('POST', $endpoint, $body);

        return $response;
    }

    /**
     * Consultar el estado de una orden
     */
    public function queryOrder($prepayId)
    {
        if ($this->mode === 'mock') {
            return $this->queryMockOrder($prepayId);
        }

        $endpoint = '/binancepay/openapi/v2/order/query';
        $body = [
            'prepayId' => $prepayId
        ];

        return $this->makeRequest('POST', $endpoint, $body);
    }

    /**
     * Verificar la firma de un webhook
     */
    public function verifyWebhook($payload, $signature, $timestamp, $nonce)
    {
        if ($this->mode === 'mock') {
            return true; // En modo mock, siempre aceptar
        }

        $payloadString = $timestamp . "\n" . $nonce . "\n" . json_encode($payload) . "\n";
        $expectedSignature = strtoupper(hash_hmac('SHA512', $payloadString, $this->secretKey));

        return hash_equals($expectedSignature, $signature);
    }

    /**
     * Realizar una petición a la API de Binance Pay
     */
    protected function makeRequest($method, $endpoint, $body = [])
    {
        $timestamp = round(microtime(true) * 1000);
        $nonce = Str::random(32);
        $bodyJson = json_encode($body);
        
        // Generar firma
        $payload = $timestamp . "\n" . $nonce . "\n" . $bodyJson . "\n";
        $signature = strtoupper(hash_hmac('SHA512', $payload, $this->secretKey));

        try {
            $response = Http::withHeaders([
                'Content-Type' => 'application/json',
                'BinancePay-Timestamp' => $timestamp,
                'BinancePay-Nonce' => $nonce,
                'BinancePay-Certificate-SN' => $this->apiKey,
                'BinancePay-Signature' => $signature,
            ])->$method($this->baseUrl . $endpoint, $body);

            $result = $response->json();

            if ($result['status'] !== 'SUCCESS') {
                Log::error('Binance Pay API Error', [
                    'endpoint' => $endpoint,
                    'response' => $result
                ]);
            }

            return $result;

        } catch (\Exception $e) {
            Log::error('Binance Pay Request Failed', [
                'endpoint' => $endpoint,
                'error' => $e->getMessage()
            ]);

            return [
                'status' => 'ERROR',
                'code' => '500',
                'errorMessage' => $e->getMessage()
            ];
        }
    }

    /**
     * Crear orden simulada (MOCK)
     */
    protected function createMockOrder($orderData)
    {
        $prepayId = 'MOCK_' . time() . '_' . Str::random(10);
        $qrContent = 'binance://pay?prepayId=' . $prepayId;
        
        return [
            'status' => 'SUCCESS',
            'code' => '000000',
            'data' => [
                'prepayId' => $prepayId,
                'terminalType' => 'WEB',
                'expireTime' => 900000, // 15 minutos
                // Generar un QR visual real basado en el contenido
                'qrcodeLink' => 'https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=' . urlencode($qrContent),
                'qrContent' => $qrContent,
                'checkoutUrl' => url('/mock-binance-checkout/' . $prepayId),
                'deeplink' => 'bnc://app.binance.com/payment/' . $prepayId,
                'universalUrl' => 'https://app.binance.com/payment/' . $prepayId,
                'merchantTradeNo' => $orderData['merchant_trade_no'],
                'orderAmount' => $orderData['amount'],
                'currency' => $orderData['currency'] ?? 'USD'
            ]
        ];
    }

    /**
     * Consultar orden simulada (MOCK)
     */
    protected function queryMockOrder($prepayId)
    {
        // En modo mock, simular que el pago está pendiente
        return [
            'status' => 'SUCCESS',
            'code' => '000000',
            'data' => [
                'prepayId' => $prepayId,
                'status' => 'PENDING', // PENDING, PAID, EXPIRED, ERROR
                'transactionId' => null,
                'transactTime' => null
            ]
        ];
    }

    /**
     * Simular pago exitoso (solo para testing en modo MOCK)
     */
    public function simulatePaymentSuccess($prepayId)
    {
        if ($this->mode !== 'mock') {
            return false;
        }

        return [
            'status' => 'SUCCESS',
            'code' => '000000',
            'data' => [
                'prepayId' => $prepayId,
                'status' => 'PAID',
                'transactionId' => 'MOCK_TX_' . time(),
                'transactTime' => now()->timestamp * 1000
            ]
        ];
    }
}
