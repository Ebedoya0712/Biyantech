<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<title>Pago Móvil Aprobado</title>
	
	<style type="text/css" media="screen">
		body { padding:0 !important; margin:0 auto !important; display:block !important; min-width:100% !important; width:100% !important; background:#f4f4f4; -webkit-text-size-adjust:none }
		a { color:#7B3FF2; text-decoration:none }
		p { padding:0 !important; margin:0 !important } 
		img { margin: 0 !important; -ms-interpolation-mode: bicubic; }
		
		.btn-primary { background: linear-gradient(135deg, #7B3FF2 0%, #9D5FFF 100%); color: #ffffff; padding: 12px 30px; border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold; }
		.btn-primary:hover { background: linear-gradient(135deg, #6A2FE1 0%, #8C4EEE 100%); }
		
		/* Mobile styles */
		@media only screen and (max-device-width: 480px), only screen and (max-width: 480px) {
			.m-shell { width: 100% !important; min-width: 100% !important; }
			.m-center { text-align: center !important; }
			.m-padding { padding: 20px !important; }
		}
	</style>
</head>
<body style="padding:0 !important; margin:0 auto !important; display:block !important; min-width:100% !important; width:100% !important; background:#f4f4f4; -webkit-text-size-adjust:none;">
	<center>
		<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 0; padding: 0; width: 100%; height: 100%;" bgcolor="#f4f4f4">
			<tr>
				<td style="margin: 0; padding: 0; width: 100%; height: 100%;" align="center" valign="top">
					<table width="600" border="0" cellspacing="0" cellpadding="0" class="m-shell">
						<tr>
							<td style="width:600px; min-width:600px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal;">
								
								<!-- Header -->
								<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 30px;">
									<tr>
										<td style="padding: 40px 30px; background: linear-gradient(135deg, #7B3FF2 0%, #9D5FFF 100%); border-radius: 10px 10px 0 0;" align="center">
											<h1 style="color: #ffffff; font-size: 28px; margin: 0; font-family: Arial, sans-serif;">
												✅ ¡Pago Aprobado!
											</h1>
											<p style="color: #ffffff; font-size: 16px; margin: 10px 0 0 0; font-family: Arial, sans-serif;">
												Tu pago móvil ha sido verificado exitosamente
											</p>
										</td>
									</tr>
								</table>
								
								<!-- Main Content -->
								<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#ffffff">
									<tr>
										<td style="padding: 40px 30px;">
											
											<!-- Greeting -->
											<p style="font-size: 16px; line-height: 24px; color: #333333; font-family: Arial, sans-serif; margin: 0 0 20px 0;">
												Hola <strong>{{ $sale->user->name }}</strong>,
											</p>
											
											<p style="font-size: 16px; line-height: 24px; color: #666666; font-family: Arial, sans-serif; margin: 0 0 30px 0;">
												Nos complace informarte que tu pago móvil ha sido verificado y aprobado. Ya tienes acceso completo a tus cursos.
											</p>
											
											<!-- Payment Details Box -->
											<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #f8f9fa; border-radius: 8px; margin-bottom: 30px;">
												<tr>
													<td style="padding: 25px;">
														<h2 style="font-size: 18px; color: #333333; font-family: Arial, sans-serif; margin: 0 0 20px 0; border-bottom: 2px solid #7B3FF2; padding-bottom: 10px;">
															📋 Detalles del Pago
														</h2>
														
														<table width="100%" border="0" cellspacing="0" cellpadding="8">
															<tr>
																<td style="font-size: 14px; color: #666666; font-family: Arial, sans-serif; padding: 8px 0;">
																	<strong>Número de Orden:</strong>
																</td>
																<td style="font-size: 14px; color: #333333; font-family: Arial, sans-serif; text-align: right; padding: 8px 0;">
																	#{{ $sale->n_transaccion ?? $sale->id }}
																</td>
															</tr>
															<tr style="background: #ffffff;">
																<td style="font-size: 14px; color: #666666; font-family: Arial, sans-serif; padding: 8px 0;">
																	<strong>Método de Pago:</strong>
																</td>
																<td style="font-size: 14px; color: #333333; font-family: Arial, sans-serif; text-align: right; padding: 8px 0;">
																	Pago Móvil
																</td>
															</tr>
															<tr>
																<td style="font-size: 14px; color: #666666; font-family: Arial, sans-serif; padding: 8px 0;">
																	<strong>Monto en USD:</strong>
																</td>
																<td style="font-size: 16px; color: #7B3FF2; font-family: Arial, sans-serif; text-align: right; padding: 8px 0; font-weight: bold;">
																	${{ number_format($sale->total, 2) }}
																</td>
															</tr>
															<tr style="background: #ffffff;">
																<td style="font-size: 14px; color: #666666; font-family: Arial, sans-serif; padding: 8px 0;">
																	<strong>Monto en Bs:</strong>
																</td>
																<td style="font-size: 16px; color: #7B3FF2; font-family: Arial, sans-serif; text-align: right; padding: 8px 0; font-weight: bold;">
																	{{ number_format($sale->total_bs, 2) }} Bs
																</td>
															</tr>
															<tr>
																<td style="font-size: 14px; color: #666666; font-family: Arial, sans-serif; padding: 8px 0;">
																	<strong>Tasa de Cambio:</strong>
																</td>
																<td style="font-size: 14px; color: #333333; font-family: Arial, sans-serif; text-align: right; padding: 8px 0;">
																	{{ number_format($sale->exchange_rate, 4) }} Bs/USD
																</td>
															</tr>
															<tr style="background: #ffffff;">
																<td style="font-size: 14px; color: #666666; font-family: Arial, sans-serif; padding: 8px 0;">
																	<strong>Fuente de Tasa:</strong>
																</td>
																<td style="font-size: 14px; color: #333333; font-family: Arial, sans-serif; text-align: right; padding: 8px 0;">
																	{{ $sale->exchange_source }}
																</td>
															</tr>
															<tr>
																<td style="font-size: 14px; color: #666666; font-family: Arial, sans-serif; padding: 8px 0;">
																	<strong>Fecha de Pago:</strong>
																</td>
																<td style="font-size: 14px; color: #333333; font-family: Arial, sans-serif; text-align: right; padding: 8px 0;">
																	{{ $sale->created_at->format('d/m/Y h:i A') }}
																</td>
															</tr>
														</table>
													</td>
												</tr>
											</table>
											
											<!-- Courses List -->
											<h2 style="font-size: 18px; color: #333333; font-family: Arial, sans-serif; margin: 0 0 20px 0;">
												🎓 Tus Cursos
											</h2>
											
											@foreach ($sale->sale_details as $sale_detail)
											<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
												<tr>
													<td style="padding: 20px;">
														<!-- Course Image -->
														<table width="100%" border="0" cellspacing="0" cellpadding="0">
															<tr>
																<td align="center" style="padding-bottom: 15px;">
																	<img src="{{ env('APP_URL').'storage/'.$sale_detail->course->imagen }}" width="150" style="border-radius: 8px; display: block; max-width: 100%;" alt="{{ $sale_detail->course->title }}" />
																</td>
															</tr>
														</table>
														
														<!-- Course Info -->
														<h3 style="font-size: 16px; color: #333333; font-family: Arial, sans-serif; margin: 0 0 8px 0; line-height: 1.4;">
															{{ $sale_detail->course->title }}
														</h3>
														<p style="font-size: 14px; color: #666666; font-family: Arial, sans-serif; margin: 0 0 12px 0; line-height: 1.5;">
															{{ $sale_detail->course->subtitle }}
														</p>
														
														@if($sale_detail->discount > 0)
														<p style="font-size: 13px; color: #7B3FF2; font-family: Arial, sans-serif; margin: 0;">
															<strong>Descuento:</strong> {{ $sale_detail->discount }}{{ $sale_detail->type_discount == 1 ? '%' : ' USD' }}
														</p>
														@endif
													</td>
												</tr>
											</table>
											@endforeach
											
											<!-- Access Button -->
											<table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 30px 0;">
												<tr>
													<td align="center">
														<a href="{{ env('APP_URL') }}" class="btn-primary" style="background: linear-gradient(135deg, #7B3FF2 0%, #9D5FFF 100%); color: #ffffff; padding: 15px 40px; border-radius: 5px; text-decoration: none; display: inline-block; font-weight: bold; font-size: 16px; font-family: Arial, sans-serif;">
															Acceder a Mis Cursos
														</a>
													</td>
												</tr>
											</table>
											
											<!-- Footer Message -->
											<table width="100%" border="0" cellspacing="0" cellpadding="0" style="background: #f8f9fa; border-radius: 8px; margin-top: 30px;">
												<tr>
													<td style="padding: 20px; text-align: center;">
														<p style="font-size: 14px; color: #666666; font-family: Arial, sans-serif; margin: 0;">
															Si tienes alguna pregunta, no dudes en contactarnos.
														</p>
													</td>
												</tr>
											</table>
											
										</td>
									</tr>
								</table>
								
								<!-- Footer -->
								<table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0A0E27" style="border-radius: 0 0 10px 10px;">
									<tr>
										<td style="padding: 30px; text-align: center;">
											<p style="font-size: 12px; color: #999999; font-family: Arial, sans-serif; margin: 0;">
												© {{ date('Y') }} Biyantech. Todos los derechos reservados.
											</p>
										</td>
									</tr>
								</table>
								
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</center>
</body>
</html>
