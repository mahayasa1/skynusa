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
        .code-box { background: white; border: 2px dashed #2563eb; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
        .code { font-size: 24px; font-weight: bold; color: #2563eb; letter-spacing: 2px; }
        .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">✅ Pesanan Berhasil Dibuat!</h1>
            <p style="margin: 10px 0 0 0;">SKYNUSA TECH</p>
        </div>
        
        <div class="content">
            <p>Halo <strong>{{ $pesanan->name }}</strong>,</p>
            
            <p>Terima kasih telah mempercayakan kebutuhan Anda kepada kami. Pesanan Anda telah berhasil diterima dan akan segera kami proses.</p>
            
            <div class="code-box">
                <p style="margin: 0 0 10px 0; color: #6b7280;">Kode Pesanan Anda:</p>
                <div class="code">{{ $pesanan->code }}</div>
                <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Simpan kode ini untuk tracking pesanan</p>
            </div>
            
            <div class="details">
                <h3 style="margin-top: 0; color: #1f2937;">Detail Pesanan:</h3>
                
                <div class="detail-row">
                    <span style="color: #6b7280;">Layanan:</span>
                    <strong>{{ $pesanan->service->title }}</strong>
                </div>
                
                <div class="detail-row">
                    <span style="color: #6b7280;">Tanggal Pesanan:</span>
                    <strong>{{ $pesanan->created_at->format('d M Y H:i') }}</strong>
                </div>
                
                <div class="detail-row">
                    <span style="color: #6b7280;">Target Selesai:</span>
                    <strong>{{ $pesanan->due_date->format('d M Y') }}</strong>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="{{ $trackingUrl }}" class="button">
                    🔍 Lacak Pesanan Anda
                </a>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #eab308; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #92400e;">
                    <strong>📌 Langkah Selanjutnya:</strong><br>
                    Tim kami akan menghubungi Anda dalam <strong>1x24 jam</strong> untuk konfirmasi detail pesanan. Pastikan nomor telepon Anda aktif.
                </p>
            </div>
            
            <p>Jika Anda memiliki pertanyaan, jangan ragu untuk menghubungi kami:</p>
            <ul style="color: #6b7280;">
                <li>📞 Telepon: +62 812-3456-7890</li>
                <li>📧 Email: info@skynusa.com</li>
                <li>🌐 Website: www.skynusa-tech.com</li>
            </ul>
        </div>
        
        <div class="footer">
            <p>© 2025 SKYNUSA TECH. All rights reserved.</p>
            <p>Email ini dikirim otomatis, mohon tidak membalas email ini.</p>
        </div>
    </div>
</body>
</html>