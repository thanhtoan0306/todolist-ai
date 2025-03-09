import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDOagEi9Dd_8va8hRpOvqqMvJNppvpvpw8';

// Kiểm tra API key
const isValidApiKey = (key) => {
  return key && key !== 'YOUR_API_KEY' && typeof key === 'string' && key.length > 0;
};

// Khởi tạo Gemini API với API key
let genAI = null;
let model = null;

try {
  if (isValidApiKey(API_KEY)) {
    genAI = new GoogleGenerativeAI(API_KEY);
    // Sử dụng version mới của API
    model = genAI.getGenerativeModel({ model: 'gemini-1.0-pro' });
  }
} catch (error) {
  console.error('Lỗi khởi tạo Gemini API:', error);
}

// Context cho chatbot
const CHAT_CONTEXT = `Bạn là một trợ lý quản lý công việc thông minh. 
Bạn có thể giúp người dùng quản lý các công việc của họ.
Bạn có thể thực hiện các lệnh sau:
- thêm: <nội dung> - Thêm một công việc mới
- sửa: <số thứ tự> -> <nội dung mới> - Sửa nội dung công việc
- xóa: <số thứ tự> - Xóa một công việc
- hoàn thành: <số thứ tự> - Đánh dấu công việc đã hoàn thành
- tìm: <từ khóa> - Tìm kiếm công việc
- lọc: hoàn thành/chưa - Lọc công việc theo trạng thái

Hãy trả lời thân thiện và giúp người dùng chuyển đổi yêu cầu của họ thành các lệnh phù hợp.
Nếu yêu cầu không rõ ràng, hãy hỏi thêm thông tin.
Luôn trả lời bằng tiếng Việt.

Khi người dùng yêu cầu thêm công việc, hãy tự động chuyển đổi thành lệnh "thêm:" và nội dung.
Khi người dùng yêu cầu sửa công việc, hãy tự động chuyển đổi thành lệnh "sửa: <số> -> <nội dung>".
Khi người dùng yêu cầu xóa công việc, hãy tự động chuyển đổi thành lệnh "xóa: <số>".
Khi người dùng yêu cầu đánh dấu hoàn thành, hãy tự động chuyển đổi thành lệnh "hoàn thành: <số>".`;

export async function processMessage(message, todos) {
  try {
    // Kiểm tra input
    if (!message || typeof message !== 'string') {
      return {
        botMessage: 'Vui lòng nhập tin nhắn hợp lệ.',
        command: null
      };
    }

    // Tạo context với danh sách công việc hiện tại
    const todoList = Array.isArray(todos) ? todos : [];
    const todoContext = `Danh sách công việc hiện tại:
${todoList.map((todo, index) => {
  const text = todo?.text || 'Không có nội dung';
  const completed = todo?.completed ? 'đã hoàn thành' : 'chưa hoàn thành';
  return `${index + 1}. ${text} (${completed})`;
}).join('\n')}

Yêu cầu của người dùng: ${message}`;

    // Gọi API Gemini trực tiếp
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=' + API_KEY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: CHAT_CONTEXT + '\n\n' + todoContext
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: 'HARM_CATEGORY_HARASSMENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_HATE_SPEECH',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
          {
            category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
            threshold: 'BLOCK_MEDIUM_AND_ABOVE',
          },
        ],
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0].content.parts[0].text) {
      throw new Error('Không nhận được phản hồi từ AI');
    }

    const text = data.candidates[0].content.parts[0].text.trim();

    // Phân tích câu trả lời để tìm lệnh
    const commandMatch = text.match(/(thêm|sửa|xóa|hoàn thành|tìm|lọc):.*/);
    
    return {
      botMessage: text,
      command: commandMatch ? commandMatch[0] : null
    };
  } catch (error) {
    console.error('Lỗi khi xử lý tin nhắn:', error);
    return {
      botMessage: 'Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.',
      command: null
    };
  }
} 