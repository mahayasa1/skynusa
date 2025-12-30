<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
        .status-box { background: white; border-left: 4px solid #2563eb; padding: 20px; margin: 20px 0; border-radius: 4px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">📢 Update Status Pesanan</h1>
            <p style="margin: 10px 0 0 0;">SKYNUSA TECH</p>
        </div>
        
        <div class="content">
            <p>Halo <strong>{{ $pesanan->name }}</strong>,</p>
            
            <p>Status pesanan Anda telah diperbarui!</p>
            
            <div class="status-box">
                <h3 style="margin-top: 0;">Kode Pesanan: <span style="color: #2563eb;">{{ $pesanan->code }}</span></h3>
                <p style="margin: 10px 0;">
                    Status Terbaru: <strong style="color: #{{ $pesanan->status_color }}-600; font-size: 18px;">{{ $pesanan->status_label }}</strong>
                </p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ $trackingUrl }}" class="button">
                    🔍 Lihat Detail Pesanan
                </a>
            </div>
            
            <p>Terima kasih atas kepercayaan Anda kepada SKYNUSA TECH.</p>
        </div>
        
        <div class="footer">
            <p>© 2025 SKYNUSA TECH. All rights reserved.</p>
        </div>
    </div>
</body>
</html>