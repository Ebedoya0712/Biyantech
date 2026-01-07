<!DOCTYPE html>
<html>
<head>
    <title>Recuperar Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #333333; text-align: center;">Hola, {{ $user->name }}</h2>
        <p style="color: #666666; font-size: 16px; line-height: 1.5;">
            Has solicitado restablecer tu contraseña para acceder a Biyantech. Haz clic en el siguiente botón para continuar el proceso:
        </p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:4200/auth/reset-password?token={{ $token }}&email={{ $user->email }}" 
               style="background-color: #a855f7; color: white; padding: 15px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Restablecer Contraseña
            </a>
        </div>
        <p style="color: #999999; font-size: 12px; text-align: center;">
            Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
        </p>
    </div>
</body>
</html>
