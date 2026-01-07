<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Certificado BIYANTECH</title>
    <style>
        @page {
            size: A4 landscape;
            margin: 0;
        }
        html, body {
            margin: 0;
            padding: 0;
            width: 297mm;
            height: 210mm;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            position: relative;
            background-color: #fff;
        }
        
        .background-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }

        .content-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
        }

        /* --- QR CODE --- */
        .qr-code {
            position: absolute;
            top: 55px;
            right: 80px;
            width: 85px;
            height: 85px;
        }

        /* --- UPPER LEFT TEXT --- */
        .header-text {
            position: absolute;
            top: 90px;
            left: 90px;
            text-align: center;
            color: #FFFFFF; /* Texto blanco */
            background-color: transparent; /* Fondo transparente */
            border: 2px solid #FFFFFF; /* Borde blanco */
            padding: 10px;
            font-size: 13px;
            line-height: 1.2;
            width: 170px; /* Un poco mas ancho para el marco */
            font-weight: bold;
        }

        /* --- STUDENT NAME --- */
        .student-name {
            position: absolute;
            top: 418px;
            left: 690px; /* Movido de 680px a 690px para centrar mejor a la derecha */
            transform: translateX(-50%);
            width: 700px;
            text-align: center;
            font-size: 40px;
            font-weight: bold;
            color: #7B3EBF; /* Morado */
            text-transform: uppercase;
        }

        /* --- COURSE DETAILS --- */
        .bottom-section {
            position: absolute;
            top: 540px;
            left: 340px; /* Alineado igual que el nombre (centrado en un area de 700px) */
            width: 700px; /* Mismo ancho que el nombre */
            text-align: center;
            color: #000;
        }

        .course-info {
            font-size: 16px;
            margin-bottom: 25px;
            line-height: 1.4;
        }

        .course-name {
            font-weight: bold;
            text-decoration: underline;
        }

        .instructor-section {
            font-size: 18px;
            margin-top: 15px;
            position: relative;
            left: -20px; /* Mover un poco a la izquierda */
        }

        .text-purple {
            color: #7B3EBF;
        }

        /* --- FOOTER INFO --- */
        .footer-info {
            position: absolute;
            bottom: 35px;
            left: 345px;
            font-size: 10px;
            color: #333;
            line-height: 1.3;
        }

        .mmpe-code {
            position: absolute;
            bottom: 35px;
            right: 50px;
            font-size: 12px;
            font-weight: bold;
            color: #000;
        }

        .bold {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <img class="background-image" src="{{ public_path('storage/plantilla-certificado3.png') }}" alt="Plantilla de Certificado">

    <div class="content-container">
        <!-- QR Code -->
        <img class="qr-code" src="{{ $qr_image }}">

        <!-- Header Text -->
        <div class="header-text">
            BIYANTECH<br>
            OTORGA Y<br>
            CERTIFICA ESTE<br>
            CERTIFICADO EL:<br>
            {{ $date }}
        </div>

        <!-- Student Name -->
        <div class="student-name">{{ $user->name }} {{ $user->surname }}</div>

        <!-- Bottom Section: Course and Instructor -->
        <div class="bottom-section">
            <div class="course-info">
                POR HABER COMPLETADO SATISFACTORIAMENTE EL CURSO DE:<br>
                <span class="course-name text-purple">{{ $course->title }}</span>,<br>
                <span class="bold text-purple">TIEMPO DE DURACIÓN {{ strtoupper($duration) }},</span>
            </div>

            <div class="instructor-section">
                Dictado por el Docente <span class="bold text-purple">{{ $instructor }}</span>
            </div>
        </div>

        <!-- Footer Info -->
        <div class="footer-info">
            Número de Certificado: <a href="{{ $verification_url }}" target="_blank" style="text-decoration:none; color:#333;">{{ $certificate_number }}</a><br>
            URL de Certificado: <a href="{{ $verification_url }}" target="_blank" style="text-decoration:none; color:#333;">{{ $verification_url }}</a><br>
            Referencia: {{ $reference_number }}
        </div>

        <!-- MMPE Code -->
        <div class="mmpe-code">
            CÓDIGO DE MMPE: {{ $mmpe_code }}
        </div>
    </div>
</body>
</html>
