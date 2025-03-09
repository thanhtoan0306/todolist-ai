<template>
  <div class="chatbot" :class="{ 'chatbot-open': isOpen }">
    <button class="chatbot-toggle" @click="toggleChat">
      <span class="material-icons">{{ isOpen ? 'close' : 'chat' }}</span>
    </button>
    
    <div class="chatbot-container" v-if="isOpen">
      <div class="chatbot-header">
        <h3>Trợ lý Todo AI</h3>
      </div>
      
      <div class="chatbot-messages" ref="messageContainer">
        <div v-for="(message, index) in messages" 
             :key="index" 
             :class="['message', message?.type || 'bot']">
          <div class="message-content">{{ message?.text || '' }}</div>
        </div>
      </div>
      
      <div class="chatbot-input">
        <input 
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="Hỏi tôi bất cứ điều gì..."
          type="text"
          :disabled="isProcessing"
        >
        <button @click="sendMessage" :disabled="isProcessing">
          <span class="material-icons">{{ isProcessing ? 'hourglass_empty' : 'send' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { processMessage } from '../services/gemini'

const props = defineProps({
  todos: {
    type: Array,
    required: true,
    default: () => []
  },
  onAddTodo: {
    type: Function,
    required: true
  },
  onRemoveTodo: {
    type: Function,
    required: true
  },
  onUpdateTodo: {
    type: Function,
    required: true
  },
  onCompleteTodo: {
    type: Function,
    required: true
  },
  onSearchTodos: {
    type: Function,
    required: true
  },
  onFilterTodos: {
    type: Function,
    required: true
  }
})

const isOpen = ref(false)
const userInput = ref('')
const messages = ref([
  {
    type: 'bot',
    text: 'Xin chào! Tôi là trợ lý Todo AI. Tôi có thể giúp bạn:\n- Thêm công việc mới\n- Sửa nội dung công việc\n- Xóa công việc\n- Đánh dấu hoàn thành\n- Tìm kiếm công việc\n- Lọc công việc theo trạng thái\n\nHãy hỏi tôi bất cứ điều gì!'
  }
])
const messageContainer = ref(null)
const isProcessing = ref(false)

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

const scrollToBottom = async () => {
  try {
    await nextTick()
    if (messageContainer.value) {
      messageContainer.value.scrollTop = messageContainer.value.scrollHeight
    }
  } catch (error) {
    console.error('Lỗi khi cuộn tin nhắn:', error)
  }
}

const addMessage = (text, type = 'user') => {
  try {
    if (!text || typeof text !== 'string') return
    messages.value.push({ text, type })
    scrollToBottom()
  } catch (error) {
    console.error('Lỗi khi thêm tin nhắn:', error)
  }
}

const executeCommand = (command) => {
  try {
    if (!command || typeof command !== 'string') return

    const commandLower = command.toLowerCase()
    
    if (commandLower.startsWith('thêm:')) {
      const content = command.slice(5).trim()
      if (content) {
        props.onAddTodo(content)
      }
    }
    else if (commandLower.startsWith('sửa:')) {
      const match = command.match(/sửa:\s*(\d+)\s*->\s*(.+)/)
      if (match) {
        const [, index, newContent] = match
        const parsedIndex = parseInt(index)
        if (!isNaN(parsedIndex) && parsedIndex > 0) {
          props.onUpdateTodo(parsedIndex - 1, newContent.trim())
        }
      }
    }
    else if (commandLower.startsWith('xóa:')) {
      const index = parseInt(command.slice(4).trim())
      if (!isNaN(index) && index > 0) {
        props.onRemoveTodo(index - 1)
      }
    }
    else if (commandLower.startsWith('hoàn thành:')) {
      const index = parseInt(command.slice(11).trim())
      if (!isNaN(index) && index > 0) {
        props.onCompleteTodo(index - 1)
      }
    }
    else if (commandLower.startsWith('tìm:')) {
      const keyword = command.slice(4).trim()
      if (keyword) {
        props.onSearchTodos(keyword)
      }
    }
    else if (commandLower.startsWith('lọc:')) {
      const filter = command.slice(4).trim()
      props.onFilterTodos(filter)
    }
  } catch (error) {
    console.error('Lỗi khi thực thi lệnh:', error)
  }
}

const sendMessage = async () => {
  try {
    if (!userInput.value?.trim() || isProcessing.value) return

    const userMessage = userInput.value
    addMessage(userMessage)
    userInput.value = ''
    isProcessing.value = true

    const { botMessage, command } = await processMessage(userMessage, props.todos)
    if (botMessage) {
      addMessage(botMessage, 'bot')
    }
    if (command) {
      executeCommand(command)
    }
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error)
    addMessage('Xin lỗi, có lỗi xảy ra khi xử lý yêu cầu của bạn. Vui lòng thử lại sau.', 'bot')
  } finally {
    isProcessing.value = false
  }
}

watch(isOpen, (newValue) => {
  if (newValue) {
    scrollToBottom()
  }
})
</script>

<style scoped>
.chatbot {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}

.chatbot-toggle {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-color: #1a73e8;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
}

.chatbot-container {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 320px;
  height: 450px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
}

.chatbot-header {
  padding: 16px;
  background: #1a73e8;
  color: white;
  border-radius: 12px 12px 0 0;
}

.chatbot-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
}

.chatbot-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
}

.message.user {
  align-self: flex-end;
  background: #e3f2fd;
  color: #1a73e8;
}

.message.bot {
  align-self: flex-start;
  background: #f5f5f5;
  color: #202124;
  white-space: pre-line;
}

.chatbot-input {
  padding: 12px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 8px;
}

.chatbot-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  font-size: 14px;
}

.chatbot-input input:focus {
  outline: none;
  border-color: #1a73e8;
}

.chatbot-input input:disabled,
.chatbot-input button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.chatbot-input button {
  background: none;
  border: none;
  color: #1a73e8;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
}

.chatbot-input button:hover {
  background-color: rgba(26,115,232,0.039);
  border-radius: 50%;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.chatbot-input button:disabled .material-icons {
  animation: spin 1s linear infinite;
}
</style> 