const mono = 'Courier New, Courier, monospace'

export function contactEmailHtml(opts: {
  name: string
  email: string
  message: string
  timestamp: string
}): string {
  const { name, email, message, timestamp } = opts
  const safe = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

  return `<!DOCTYPE html>
<html>
<body style="background-color:#111418;margin:0;padding:0;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    <p style="font-family:${mono};font-size:10px;color:#ff5f1f;text-transform:uppercase;letter-spacing:0.12em;margin:0 0 4px;">
      rashaydaya.co.za: Inbound Message
    </p>
    <hr style="border:none;border-top:1px solid #ff5f1f;margin:12px 0;" />
    <p style="font-family:${mono};font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.1em;margin:8px 0 2px;">Sender</p>
    <p style="font-family:${mono};font-size:12px;color:#e8e6e1;margin:0 0 4px;">${safe(name)} &lt;${safe(email)}&gt;</p>
    <p style="font-family:${mono};font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.1em;margin:8px 0 2px;">Timestamp</p>
    <p style="font-family:${mono};font-size:12px;color:#e8e6e1;margin:0 0 4px;">${safe(timestamp)}</p>
    <hr style="border:none;border-top:1px solid #ff5f1f;margin:12px 0;" />
    <p style="font-family:${mono};font-size:13px;color:#e8e6e1;line-height:1.7;white-space:pre-wrap;margin:0;">${safe(message)}</p>
    <hr style="border:none;border-top:1px solid #ff5f1f;margin:12px 0;" />
    <p style="font-family:${mono};font-size:9px;color:#94A3B8;text-transform:uppercase;letter-spacing:0.08em;margin:0;">Reply directly to ${safe(email)}</p>
  </div>
</body>
</html>`
}
