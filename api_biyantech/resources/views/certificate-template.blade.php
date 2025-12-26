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
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            width: 297mm;
            height: 210mm;
            position: relative;
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
            color: #FFFFFF;
        }

        .student-name {
            position: absolute;
            top: 56%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            text-align: center;
            font-size: 48px;
            font-weight: bold;
            color: #FFFFFF;
        }

        .course-name {
            position: absolute;
            top: 80%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #FFFFFF;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .date-value {
            position: absolute;
            top: 89%;
            left: 33%;
            transform: translate(-50%, -50%);
            color: #c9a4ff;
            font-size: 16px;
            font-weight: bold;
        }

        /* --- NUEVO ESTILO PARA EL NOMBRE DEL INSTRUCTOR --- */
        .instructor-name {
            position: absolute;
            top: 89%; /* <-- AJUSTA ESTOS VALORES */
            left: 60%; /* <-- AJUSTA ESTOS VALORES */
            transform: translate(-50%, -50%);
            color: #c9a4ff;
            font-size: 16px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <img class="background-image" src="{{ public_path('storage/plantilla-certificado.png') }}" alt="Plantilla de Certificado">

    <div class="content-container">
        <div class="student-name">{{ $user->name }} {{ $user->surname }}</div>
        <div class="course-name">{{ $course->title }}</div>
        <div class="date-value">{{ now()->format('d/m/Y') }}</div>
        
        <div class="instructor-name">{{ $course->user ? $course->user->name : 'BIYANTECH' }}</div>
    </div>
</body>
</html>