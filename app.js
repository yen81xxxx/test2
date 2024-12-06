const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// 這是你的 Channel Access Token
const CHANNEL_ACCESS_TOKEN = '9Q7Ky8bqq5uru7aUfl3wiSUiyhkLQWccZnAXizl7E/UDCbcdF0H36hbB2vUiUVbTiCTijsnvmyZXkSyhGjQx7B17DC+5fLEpDWQucOjrYhjasSLTRLcdooMoKWZvbhxPWu6pPyouEIiuRp45G2pK7gdB04t89/1O/w1cDnyilFU=';

// 這是你的 Rich Menu ID
const RICH_MENU_ID = 'YOUR_RICH_MENU_ID';  // 替換為你的 Rich Menu ID

// 解析 JSON 請求
app.use(bodyParser.json());

// Webhook 事件處理器
app.post('/webhook', async (req, res) => {
  const events = req.body.events;
  
  // 遍歷所有事件
  for (let event of events) {
    if (event.type === 'message') {
      const userId = event.source.userId;  // 從事件中提取 userId
      console.log('Received message from userId:', userId);

      // 呼叫函數綁定 Rich Menu 到用戶
      try {
        await linkRichMenuToUser(userId, RICH_MENU_ID);
        console.log(`Rich Menu successfully linked to user ${userId}`);
      } catch (error) {
        console.error('Error linking Rich Menu:', error.message);
      }
    }
  }

  // 回應 LINE 平台
  res.status(200).send('OK');
});

// 綁定 Rich Menu 到用戶
async function linkRichMenuToUser(userId, richMenuId) {
  const url = `https://api.line.me/v2/bot/user/${userId}/richmenu/${richMenuId}`;
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${CHANNEL_ACCESS_TOKEN}`,  // 使用你的 Channel Access Token
  };

  try {
    const response = await axios.post(url, {}, { headers });
    console.log(`Successfully linked Rich Menu ${richMenuId} to user ${userId}`);
  } catch (error) {
    console.error('Error linking Rich Menu:', error.response?.data || error.message);
    throw error;  // 拋出錯誤以便處理
  }
}

// 啟動伺服器
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
