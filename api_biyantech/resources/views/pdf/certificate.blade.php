<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Certificado</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; text-align: center; padding: 50px; }
        h1 { font-size: 40px; }
        p { font-size: 18px; }
    </style>
</head>
<body>
    <h1>Certificado de Finalización</h1>
    <p>Este certificado se otorga a:</p>
    <h2>{{ $student_name }}</h2>
    <p>Por completar satisfactoriamente el curso:</p>
    <h3>"{{ $course_title }}"</h3>
    <p>Emitido el {{ $date }}</p>
</body>
</html>
