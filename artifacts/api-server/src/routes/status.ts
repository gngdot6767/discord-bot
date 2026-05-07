import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(`<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Bot Status</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #23272a;
      color: #dcddde;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
    }
    .card {
      background: #2c2f33;
      border-radius: 16px;
      padding: 48px 56px;
      text-align: center;
      box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      max-width: 420px;
      width: 90%;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #5865f2;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 36px;
      margin: 0 auto 24px;
    }
    h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #fff; }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #1e2124;
      border-radius: 20px;
      padding: 6px 16px;
      font-size: 14px;
      margin: 16px 0 24px;
    }
    .dot {
      width: 10px; height: 10px;
      border-radius: 50%;
      background: #43b581;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
    .cmd {
      background: #1e2124;
      border-radius: 8px;
      padding: 12px 20px;
      font-family: monospace;
      font-size: 16px;
      color: #7289da;
      margin-bottom: 12px;
    }
    p { font-size: 14px; color: #99aab5; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <div class="avatar">🤖</div>
    <h1>Discord Bot</h1>
    <div class="status">
      <div class="dot"></div>
      Online i aktywny
    </div>
    <div class="cmd">/2wiadomosc</div>
    <p>Użyj tej komendy na serwerze Discord, aby wysłać wiadomość jako bot.</p>
  </div>
</body>
</html>`);
});

export default router;
