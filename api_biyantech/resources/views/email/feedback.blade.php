<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Feedback Biyantech</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            border-radius: 8px 8px 0 0;
        }

        .content {
            padding: 20px;
            color: #333333;
            line-height: 1.6;
        }

        .btn {
            display: block;
            width: 200px;
            margin: 20px auto;
            text-align: center;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            padding: 10px;
            border-radius: 5px;
            font-weight: bold;
        }

        .footer {
            margin-top: 20px;
            text-align: center;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="header">
            <h2>¡Tu opinión nos importa!</h2>
        </div>

        <div class="content">
            <p>Hola,</p>

            <p>{!! $body_content !!}</p>

            <a href="{{ $url }}" class="btn" target="_blank">Responder Preguntas</a>

            <p>Gracias por ayudarnos a mejorar.</p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} Biyantech. Todos los derechos reservados.
        </div>
    </div>

</body>

</html>