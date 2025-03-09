<template>
  <div class="todo-list">
    <h1>Danh sách công việc</h1>
    
    <!-- Form thêm công việc mới -->
    <div class="add-todo">
      <input 
        v-model="newTodo" 
        @keyup.enter="addTodo()"
        placeholder="Tạo ghi chú..."
        class="todo-input"
      >
      <button @click="addTodo()" class="add-button">
        <span class="material-icons">add</span>
      </button>
    </div>

    <!-- Danh sách công việc -->
    <div class="todo-grid">
      <div v-for="(todo, index) in filteredTodos" 
           :key="index" 
           class="todo-item"
           :class="{ 'todo-completed': todo?.completed }">
        <div class="todo-content">
          <div class="todo-header">
            <input 
              type="checkbox" 
              v-model="todo.completed"
              class="todo-checkbox"
            >
            <span class="todo-text">
              <span class="todo-number">#{{ todos.indexOf(todo) + 1 }}</span>
              {{ todo?.text || 'Không có nội dung' }}
            </span>
          </div>
        </div>
        <div class="todo-actions">
          <button @click="removeTodo(todos.indexOf(todo))" class="action-button">
            <span class="material-icons">delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Thống kê -->
    <div class="todo-stats" v-if="todos.length > 0">
      <span>{{ remainingTodos }} ghi chú chưa hoàn thành</span>
      <span v-if="filterStatus !== 'all'" class="filter-status">
        (Đang lọc: {{ filterStatus === 'completed' ? 'Hoàn thành' : 'Chưa hoàn thành' }})
      </span>
    </div>

    <!-- ChatBot -->
    <ChatBot 
      :todos="todos"
      :onAddTodo="addTodo"
      :onRemoveTodo="removeTodo"
      :onUpdateTodo="updateTodo"
      :onCompleteTodo="completeTodo"
      :onSearchTodos="searchTodos"
      :onFilterTodos="filterTodos"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ChatBot from './ChatBot.vue'

const newTodo = ref('')
const todos = ref([])
const searchKeyword = ref('')
const filterStatus = ref('all') // 'all', 'completed', 'active'

const filteredTodos = computed(() => {
  let filtered = todos.value

  try {
    // Áp dụng tìm kiếm
    if (searchKeyword.value && typeof searchKeyword.value === 'string') {
      filtered = filtered.filter(todo => 
        todo?.text?.toLowerCase().includes(searchKeyword.value.toLowerCase())
      )
    }

    // Áp dụng lọc trạng thái
    if (filterStatus.value === 'completed') {
      filtered = filtered.filter(todo => todo?.completed)
    } else if (filterStatus.value === 'active') {
      filtered = filtered.filter(todo => !todo?.completed)
    }
  } catch (error) {
    console.error('Lỗi khi lọc công việc:', error)
    return []
  }

  return filtered
})

const remainingTodos = computed(() => {
  try {
    return todos.value.filter(todo => !todo?.completed).length
  } catch (error) {
    console.error('Lỗi khi đếm công việc còn lại:', error)
    return 0
  }
})

const addTodo = (text = null) => {
  try {
    const content = text || newTodo.value
    if (!content || typeof content !== 'string') return

    const trimmedContent = content.trim()
    if (trimmedContent) {
      todos.value.push({
        text: trimmedContent,
        completed: false
      })
      newTodo.value = ''
    }
  } catch (error) {
    console.error('Lỗi khi thêm công việc:', error)
  }
}

const removeTodo = (index) => {
  try {
    if (typeof index !== 'number' || index < 0 || index >= todos.value.length) return
    todos.value.splice(index, 1)
  } catch (error) {
    console.error('Lỗi khi xóa công việc:', error)
  }
}

const updateTodo = (index, newText) => {
  try {
    if (typeof index !== 'number' || index < 0 || index >= todos.value.length) return
    if (!newText || typeof newText !== 'string') return

    const trimmedText = newText.trim()
    if (trimmedText) {
      todos.value[index].text = trimmedText
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật công việc:', error)
  }
}

const completeTodo = (index) => {
  try {
    if (typeof index !== 'number' || index < 0 || index >= todos.value.length) return
    todos.value[index].completed = true
  } catch (error) {
    console.error('Lỗi khi đánh dấu hoàn thành:', error)
  }
}

const searchTodos = (keyword) => {
  try {
    searchKeyword.value = keyword && typeof keyword === 'string' ? keyword : ''
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error)
    searchKeyword.value = ''
  }
}

const filterTodos = (filter) => {
  try {
    if (!filter || typeof filter !== 'string') {
      filterStatus.value = 'all'
      return
    }

    const filterLower = filter.toLowerCase()
    if (filterLower.includes('hoàn thành')) {
      filterStatus.value = 'completed'
    } else if (filterLower.includes('chưa')) {
      filterStatus.value = 'active'
    } else {
      filterStatus.value = 'all'
    }
  } catch (error) {
    console.error('Lỗi khi lọc:', error)
    filterStatus.value = 'all'
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.todo-list {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
}

.add-todo {
  max-width: 600px;
  margin: 0 auto 40px;
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149);
  display: flex;
  align-items: center;
}

.todo-input {
  flex: 1;
  padding: 10px;
  border: none;
  font-size: 16px;
  color: #202124;
  background: transparent;
}

.todo-input:focus {
  outline: none;
}

.add-button {
  background: none;
  border: none;
  color: #5f6368;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-button:hover {
  background-color: rgba(95,99,104,0.039);
}

.todo-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  padding: 16px 0;
}

.todo-item {
  background: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  position: relative;
  transition: box-shadow 0.2s ease-in-out;
}

.todo-item:hover {
  box-shadow: 0 1px 2px 0 rgba(60,64,67,0.302), 0 2px 6px 2px rgba(60,64,67,0.149);
}

.todo-completed {
  background-color: #f8f9fa;
}

.todo-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.todo-checkbox {
  width: 20px;
  height: 20px;
  margin-top: 3px;
}

.todo-text {
  font-size: 14px;
  color: #202124;
  line-height: 1.5;
  word-wrap: break-word;
}

.todo-completed .todo-text {
  text-decoration: line-through;
  color: #80868b;
}

.todo-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  opacity: 0;
  transition: opacity 0.2s ease-in-out;
}

.todo-item:hover .todo-actions {
  opacity: 1;
}

.action-button {
  background: none;
  border: none;
  color: #5f6368;
  padding: 8px;
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-button:hover {
  background-color: rgba(95,99,104,0.039);
}

.material-icons {
  font-size: 20px;
}

.todo-stats {
  text-align: center;
  color: #80868b;
  font-size: 14px;
  margin-top: 20px;
}

.todo-number {
  color: #1a73e8;
  font-size: 12px;
  margin-right: 8px;
  font-weight: 500;
}

.todo-completed .todo-number {
  color: #80868b;
}

.filter-status {
  margin-left: 10px;
  font-style: italic;
}
</style> 