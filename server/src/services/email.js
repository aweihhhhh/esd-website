/**
 * 邮件服务
 * 使用 nodemailer, 失败不抛错 (调用方需 catch)
 */
import nodemailer from 'nodemailer'

let transporter = null

function getTransporter() {
  if (transporter) return transporter
  if (!process.env.SMTP_HOST) return null
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  })
  return transporter
}

/**
 * 新询价单通知 (发给销售)
 */
export async function sendInquiryNotification(inquiry) {
  const t = getTransporter()
  if (!t) return console.log('[Email Skipped] No SMTP configured')

  const html = `
    <h2>New Inquiry ${inquiry.inquiryNo}</h2>
    <table style="border-collapse:collapse;">
      <tr><td><b>Company</b></td><td>${inquiry.companyName}</td></tr>
      <tr><td><b>Contact</b></td><td>${inquiry.contactName} (${inquiry.contactEmail})</td></tr>
      <tr><td><b>Phone</b></td><td>${inquiry.contactPhone || '-'}</td></tr>
      <tr><td><b>WhatsApp</b></td><td>${inquiry.whatsapp || '-'}</td></tr>
      <tr><td><b>Country</b></td><td>${inquiry.country || '-'}</td></tr>
      <tr><td><b>Total Qty</b></td><td>${inquiry.totalQty} pcs</td></tr>
      <tr><td><b>Incoterm</b></td><td>${inquiry.incoterm}</td></tr>
    </table>
    <h3>Items</h3>
    <table style="border-collapse:collapse;border:1px solid #ddd;">
      <tr style="background:#f5f5f5;"><th>Model</th><th>Brand</th><th>Package</th><th>Qty</th><th>Target $</th></tr>
      ${inquiry.items.map(it => `
        <tr>
          <td>${it.model}</td>
          <td>${it.brand || '-'}</td>
          <td>${it.packageType || '-'}</td>
          <td>${it.qty}</td>
          <td>${it.targetPrice || '-'}</td>
        </tr>
      `).join('')}
    </table>
    <p><a href="${process.env.FRONTEND_URL}/admin/inquiries/${inquiry.id}">View in Admin Panel</a></p>
  `

  await t.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.COMPANY_EMAIL,
    subject: `[New Inquiry] ${inquiry.inquiryNo} from ${inquiry.companyName}`,
    html
  })
}

/**
 * 询价确认回执 (发给客户)
 */
export async function sendInquiryConfirmation(inquiry) {
  const t = getTransporter()
  if (!t) return
  await t.sendMail({
    from: process.env.SMTP_FROM,
    to: inquiry.contactEmail,
    subject: `Inquiry ${inquiry.inquiryNo} Received`,
    html: `
      <h2>Thank you for your inquiry</h2>
      <p>Hi ${inquiry.contactName},</p>
      <p>We have received your inquiry <b>${inquiry.inquiryNo}</b> and our sales team will reply within 12 hours.</p>
      <p>Reference: ${inquiry.inquiryNo}</p>
      <p>— ${process.env.COMPANY_NAME}</p>
    `
  })
}
