<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'binance_pay' => [
        'mode' => env('BINANCE_PAY_MODE', 'mock'), // 'mock' or 'production'
        'api_key' => env('BINANCE_PAY_API_KEY'),
        'secret_key' => env('BINANCE_PAY_SECRET_KEY'),
        'merchant_id' => env('BINANCE_PAY_MERCHANT_ID'),
        'base_url' => env('BINANCE_PAY_BASE_URL', 'https://bpay.binanceapi.com'),
    ],

];
