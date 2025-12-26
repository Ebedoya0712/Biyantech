<?php

namespace App\Services;

use Google\Cloud\Vision\V1\ImageAnnotatorClient;
use Illuminate\Support\Facades\Log;

class ImageVerificationService
{
    /**
     * Verifies a screenshot using Google Cloud Vision
     * 
     * @param string $imagePath Absolute path to the image
     * @param string $referenceNumber Expected reference number
     * @param float|null $amountBs Expected amount in Bolivares
     * @return array
     */
    public function verifyScreenshot($imagePath, $referenceNumber, $amountBs = null)
    {
        try {
            // Path to your Google Cloud credentials JSON
            $credentialsPath = env('GOOGLE_VISION_CREDENTIALS_PATH', storage_path('app/google-credentials.json'));
            
            if (!file_exists($credentialsPath)) {
                return [
                    'success' => false,
                    'message' => 'Credenciales de Google Cloud no encontradas en storage/app/google-credentials.json',
                    'is_valid' => false
                ];
            }

            $imageAnnotator = new ImageAnnotatorClient([
                'credentials' => $credentialsPath
            ]);

            // Read the image
            $imageData = file_get_contents($imagePath);
            $response = $imageAnnotator->textDetection($imageData);
            $texts = $response->getTextAnnotations();

            if (empty($texts)) {
                $imageAnnotator->close();
                return [
                    'success' => true,
                    'is_valid' => false,
                    'message' => 'No se detectó texto en la imagen.'
                ];
            }

            $fullText = $texts[0]->getDescription();
            $fullTextLower = strtolower($fullText);
            
            Log::info("OCR Extracted Text: " . $fullText);

            $isValid = true;
            $details = [];

            // 1. Check Reference Number
            if ($referenceNumber) {
                // Remove leading zeros or non-digit chars if needed, but usually we match exact
                if (strpos($fullText, $referenceNumber) === false) {
                    $isValid = false;
                    $details[] = "Número de referencia no encontrado en la imagen.";
                } else {
                    $details[] = "Número de referencia validado correctamente.";
                }
            }

            // 2. Check Amount (Approximate match)
            if ($amountBs) {
                $formattedAmount = number_format($amountBs, 2, ',', '.');
                $formattedAmountSimple = number_format($amountBs, 2, '.', '');
                
                if (strpos($fullText, $formattedAmount) === false && strpos($fullText, $formattedAmountSimple) === false) {
                    // Sometimes comma and dot are swapped or absent
                    $details[] = "Monto en Bs ($formattedAmount) no encontrado exactamente, se recomienda revisión manual.";
                } else {
                    $details[] = "Monto en Bs validado.";
                }
            }

            // 3. Manipulation Detection (Basic heuristic)
            // If the text seems too "perfect" or has weird alignments (hard to tell with just OCR)
            // But we can check for keywords that should BE there (Banco, Pago Móvil, etc)
            $keywords = ['pago', 'movil', 'exitoso', 'referencia', 'monto', 'banco', 'comprobante', 'operación', 'bdv', 'bs'];
            $foundKeywords = 0;
            foreach ($keywords as $word) {
                if (strpos($fullTextLower, $word) !== false) {
                    $foundKeywords++;
                }
            }

            if ($foundKeywords < 2) {
                $details[] = "La imagen no parece ser un comprobante de Pago Móvil estándar (pocos términos relacionados encontrados).";
                $isValid = false;
            }

            $imageAnnotator->close();

            return [
                'success' => true,
                'is_valid' => $isValid,
                'full_text' => $fullText,
                'details' => implode(" ", $details),
                'confidence' => $foundKeywords / count($keywords)
            ];

        } catch (\Exception $e) {
            Log::error("Error in ImageVerificationService: " . $e->getMessage());
            return [
                'success' => false,
                'message' => "Error procesando la imagen: " . $e->getMessage(),
                'details' => "Error Técnico: " . $e->getMessage(),
                'is_valid' => false
            ];
        }
    }
}
