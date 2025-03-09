![image](https://github.com/user-attachments/assets/4fdc5775-ccd7-450f-a7f2-881a982ffb61)# Todo List AI - Ứng dụng Quản lý Công việc Thông minh

Ứng dụng Todo List với trợ lý AI tích hợp, giúp quản lý công việc một cách thông minh và hiệu quả.

![Demo Todo List AI](https://raw.githubusercontent.com/thanhtoan0306/todolist-ai/main/screenshots/demo.png)

## Tính năng chính

- ✨ Giao diện giống Google Keep
- 🤖 Trợ lý AI thông minh tích hợp
- 💬 Chat bằng tiếng Việt tự nhiên
- ✅ Thêm, sửa, xóa công việc
- 🔍 Tìm kiếm và lọc công việc
- ✔️ Đánh dấu hoàn thành
- 📱 Giao diện responsive

## Cài đặt

1. Clone repository:
```bash
git clone https://github.com/thanhtoan0306/todolist-ai.git
cd todolist-ai
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình API key:
- Đăng ký Google AI Studio tại https://makersuite.google.com/app/apikey
- Thay thế `YOUR_API_KEY` trong file `src/services/gemini.js`

4. Chạy ứng dụng:
```bash
npm run dev
```

## Cách sử dụng Trợ lý AI

### Sử dụng lệnh trực tiếp:
```
thêm: Học Vue.js lúc 7h tối
sửa: 1 -> Học Vue.js lúc 8h tối
xóa: 1
hoàn thành: 2
```

### Sử dụng ngôn ngữ tự nhiên:
- "Thêm công việc học Vue.js vào lúc 7h tối"
- "Sửa công việc số 1 thành học lúc 8h tối"
- "Xóa công việc số 1"
- "Đánh dấu công việc 2 đã hoàn thành"
- "Tìm các công việc có từ học"
- "Lọc các việc đã hoàn thành"

## Công nghệ sử dụng

- Vue.js 3
- Google Gemini AI

  ![image](https://github.com/user-attachments/assets/35028254-2c35-4b74-baf3-9e2f7a1517da)

- Material Icons
- Vite

## Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.
