<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Biyantech</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }

        .header {
            background-color: #181C32;
            /* Metronic logic */
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }

        .content {
            padding: 30px;
            color: #555555;
            line-height: 1.6;
        }

        .footer {
            background-color: #f1f1f1;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #888888;
        }
    </style>
</head>

<body>

    <div class="container">
        <div class="header">
            <h1>Noticias Biyantech</h1>
        </div>

        <div class="content">
            {!! $body_content !!}
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} Biyantech. <br>
            Este mensaje fue enviado automáticamente.
        </div>
    </div>

</body>

</html>