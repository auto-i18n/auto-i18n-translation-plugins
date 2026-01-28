export const exampleProjects = [
  {
    id: 'vue3-vite',
    title: 'Vue 3 + Vite 电商项目',
    description: '使用 Vue 3 Composition API 和 Vite 构建的现代化电商平台，展示完整的国际化解决方案，包含用户管理、商品展示、购物车、订单管理等核心功能模块',
    framework: 'Vue',
    buildTool: 'Vite',
    difficulty: 'beginner',
    features: ['Composition API', 'Vue-i18n集成', '路由国际化', 'Vite热重载', '响应式设计', '状态管理', '表单验证', '数据持久化'],
    projectStructure: `project-root/
├── src/
│   ├── components/         # 可复用组件
│   │   ├── layout/        # 布局组件
│   │   ├── common/        # 通用组件
│   │   └── business/      # 业务组件
│   ├── views/             # 页面视图
│   │   ├── user/          # 用户相关页面
│   │   ├── product/       # 商品相关页面
│   │   └── order/         # 订单相关页面
│   ├── stores/            # Pinia状态管理
│   ├── utils/             # 工具函数
│   ├── composables/       # 组合式函数
│   └── locales/           # 国际化文件
├── locales/               # 自动生成的翻译文件
├── vite.config.js         # Vite配置
└── package.json`,
    beforeCode: `<!-- src/views/user/UserManagement.vue -->
<template>
  <div class="user-management">
    <div class="page-header">
      <h1>用户管理系统</h1>
      <p class="subtitle">管理和维护平台用户信息</p>
      
      <!-- 搜索和筛选区域 -->
      <div class="search-filters">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="搜索用户姓名或邮箱..."
            class="search-input"
          >
          <button @click="searchUsers" class="search-btn">搜索</button>
        </div>
        
        <div class="filter-dropdown">
          <select v-model="statusFilter" class="status-filter">
            <option value="">所有状态</option>
            <option value="active">活跃用户</option>
            <option value="inactive">未激活</option>
            <option value="suspended">已暂停</option>
            <option value="pending">待审核</option>
          </select>
        </div>
        
        <button @click="showCreateModal = true" class="create-btn">
          <span class="icon">+</span>
          创建新用户
        </button>
      </div>
    </div>

    <!-- 用户统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">👥</div>
        <div class="stat-info">
          <h3>{{ totalUsers }}</h3>
          <p>总用户数</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active-icon">✅</div>
        <div class="stat-info">
          <h3>{{ activeUsers }}</h3>
          <p>活跃用户</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon new-icon">🆕</div>
        <div class="stat-info">
          <h3>{{ newUsersThisMonth }}</h3>
          <p>本月新增</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue-icon">💰</div>
        <div class="stat-info">
          <h3>¥{{ monthlyRevenue }}</h3>
          <p>月度收入</p>
        </div>
      </div>
    </div>

    <!-- 用户列表表格 -->
    <div class="user-table-container">
      <div class="table-header">
        <h2>用户列表</h2>
        <div class="table-actions">
          <button @click="exportUsers" class="export-btn">导出数据</button>
          <button @click="refreshUserList" class="refresh-btn">刷新</button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载用户数据...</p>
      </div>

      <table v-else class="user-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
            </th>
            <th @click="sortBy('name')">
              姓名
              <span class="sort-indicator" :class="getSortClass('name')">↕️</span>
            </th>
            <th @click="sortBy('email')">
              邮箱
              <span class="sort-indicator" :class="getSortClass('email')">↕️</span>
            </th>
            <th>头像</th>
            <th @click="sortBy('status')">
              状态
              <span class="sort-indicator" :class="getSortClass('status')">↕️</span>
            </th>
            <th @click="sortBy('role')">
              角色
              <span class="sort-indicator" :class="getSortClass('role')">↕️</span>
            </th>
            <th @click="sortBy('createdAt')">
              注册时间
              <span class="sort-indicator" :class="getSortClass('createdAt')">↕️</span>
            </th>
            <th @click="sortBy('lastLoginAt')">
              最后登录
              <span class="sort-indicator" :class="getSortClass('lastLoginAt')">↕️</span>
            </th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in paginatedUsers" 
            :key="user.id"
            :class="{ 'selected': selectedUsers.includes(user.id) }"
            @click="selectUser(user.id)"
          >
            <td>
              <input 
                type="checkbox" 
                :checked="selectedUsers.includes(user.id)"
                @change="toggleUserSelection(user.id)"
                @click.stop
              >
            </td>
            <td class="user-name-cell">
              <div class="user-info">
                <strong>{{ user.name }}</strong>
                <small class="user-id">ID: {{ user.id }}</small>
              </div>
            </td>
            <td class="email-cell">{{ user.email }}</td>
            <td class="avatar-cell">
              <img 
                :src="user.avatar || '/default-avatar.png'" 
                :alt="user.name + '的头像'"
                class="user-avatar"
                @error="handleAvatarError"
              >
            </td>
            <td class="status-cell">
              <span :class="['status-badge', getStatusClass(user.status)]">
                {{ getStatusText(user.status) }}
              </span>
            </td>
            <td class="role-cell">
              <span :class="['role-badge', getRoleClass(user.role)]">
                {{ getRoleText(user.role) }}
              </span>
            </td>
            <td class="date-cell">
              <time :datetime="user.createdAt" :title="formatFullDate(user.createdAt)">
                {{ formatRelativeDate(user.createdAt) }}
              </time>
            </td>
            <td class="date-cell">
              <time 
                v-if="user.lastLoginAt" 
                :datetime="user.lastLoginAt"
                :title="formatFullDate(user.lastLoginAt)"
              >
                {{ formatRelativeDate(user.lastLoginAt) }}
              </time>
              <span v-else class="never-logged-in">从未登录</span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <button 
                  @click.stop="editUser(user)" 
                  class="action-btn edit-btn"
                  :title="'编辑' + user.name"
                >
                  ✏️
                </button>
                <button 
                  @click.stop="viewUserDetails(user)" 
                  class="action-btn view-btn"
                  :title="'查看' + user.name + '的详情'"
                >
                  👁️
                </button>
                <button 
                  v-if="user.status === 'active'"
                  @click.stop="suspendUser(user)" 
                  class="action-btn suspend-btn"
                  :title="'暂停' + user.name + '的账户'"
                >
                  ⏸️
                </button>
                <button 
                  v-else-if="user.status === 'suspended'"
                  @click.stop="activateUser(user)" 
                  class="action-btn activate-btn"
                  :title="'激活' + user.name + '的账户'"
                >
                  ✅
                </button>
                <button 
                  @click.stop="deleteUser(user)" 
                  class="action-btn delete-btn"
                  :title="'删除' + user.name + '的账户'"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, totalUsers) }} 条，
          共 {{ totalUsers }} 条记录
        </div>
        <div class="pagination-controls">
          <button 
            @click="currentPage = 1" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            首页
          </button>
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            上一页
          </button>
          
          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="['page-btn', { active: page === currentPage }]"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            下一页
          </button>
          <button 
            @click="currentPage = totalPages" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            末页
          </button>
        </div>
        <div class="page-size-selector">
          <label>每页显示：</label>
          <select v-model="pageSize" @change="currentPage = 1">
            <option value="10">10条</option>
            <option value="20">20条</option>
            <option value="50">50条</option>
            <option value="100">100条</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedUsers.length > 0" class="bulk-actions-bar">
      <div class="selected-info">
        已选择 {{ selectedUsers.length }} 个用户
      </div>
      <div class="bulk-actions">
        <button @click="bulkActivate" class="bulk-btn activate">批量激活</button>
        <button @click="bulkSuspend" class="bulk-btn suspend">批量暂停</button>
        <button @click="bulkExport" class="bulk-btn export">导出选中</button>
        <button @click="bulkDelete" class="bulk-btn delete">批量删除</button>
      </div>
    </div>

    <!-- 创建/编辑用户模态框 -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateModal ? '创建新用户' : '编辑用户信息' }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="submitUserForm" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label for="userName">姓名 *</label>
              <input 
                id="userName"
                v-model="userForm.name"
                type="text"
                required
                placeholder="请输入用户姓名"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="userEmail">邮箱地址 *</label>
              <input 
                id="userEmail"
                v-model="userForm.email"
                type="email"
                required
                placeholder="请输入邮箱地址"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="userPhone">手机号码</label>
              <input 
                id="userPhone"
                v-model="userForm.phone"
                type="tel"
                placeholder="请输入手机号码"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="userRole">用户角色</label>
              <select id="userRole" v-model="userForm.role" class="form-select">
                <option value="user">普通用户</option>
                <option value="premium">高级用户</option>
                <option value="admin">管理员</option>
                <option value="super_admin">超级管理员</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="userStatus">账户状态</label>
              <select id="userStatus" v-model="userForm.status" class="form-select">
                <option value="active">活跃</option>
                <option value="inactive">未激活</option>
                <option value="suspended">已暂停</option>
                <option value="pending">待审核</option>
              </select>
            </div>
            
            <div class="form-group full-width">
              <label for="userBio">个人简介</label>
              <textarea 
                id="userBio"
                v-model="userForm.bio"
                placeholder="请输入个人简介（可选）"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModals" class="cancel-btn">
              取消
            </button>
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? '提交中...' : (showCreateModal ? '创建用户' : '保存修改') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 用户详情模态框 -->
    <div v-if="showDetailsModal && selectedUserForDetails" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ selectedUserForDetails.name }} 的详细信息</h3>
          <button @click="closeDetailsModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="user-details">
            <div class="user-avatar-section">
              <img 
                :src="selectedUserForDetails.avatar || '/default-avatar.png'"
                :alt="selectedUserForDetails.name + '的头像'"
                class="large-avatar"
              >
              <button class="change-avatar-btn">更换头像</button>
            </div>
            
            <div class="user-info-sections">
              <div class="info-section">
                <h4>基本信息</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <label>用户ID</label>
                    <span>{{ selectedUserForDetails.id }}</span>
                  </div>
                  <div class="info-item">
                    <label>姓名</label>
                    <span>{{ selectedUserForDetails.name }}</span>
                  </div>
                  <div class="info-item">
                    <label>邮箱</label>
                    <span>{{ selectedUserForDetails.email }}</span>
                  </div>
                  <div class="info-item">
                    <label>手机号</label>
                    <span>{{ selectedUserForDetails.phone || '未设置' }}</span>
                  </div>
                  <div class="info-item">
                    <label>注册时间</label>
                    <span>{{ formatFullDate(selectedUserForDetails.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <label>最后登录</label>
                    <span>
                      {{ selectedUserForDetails.lastLoginAt 
                        ? formatFullDate(selectedUserForDetails.lastLoginAt) 
                        : '从未登录' }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="info-section">
                <h4>账户状态</h4>
                <div class="status-info">
                  <span :class="['large-status-badge', getStatusClass(selectedUserForDetails.status)]">
                    {{ getStatusText(selectedUserForDetails.status) }}
                  </span>
                  <span :class="['large-role-badge', getRoleClass(selectedUserForDetails.role)]">
                    {{ getRoleText(selectedUserForDetails.role) }}
                  </span>
                </div>
              </div>
              
              <div class="info-section">
                <h4>个人简介</h4>
                <p class="user-bio">
                  {{ selectedUserForDetails.bio || '该用户还没有填写个人简介。' }}
                </p>
              </div>
              
              <div class="info-section">
                <h4>使用统计</h4>
                <div class="stats-row">
                  <div class="stat-item">
                    <span class="stat-number">{{ selectedUserForDetails.loginCount || 0 }}</span>
                    <span class="stat-label">登录次数</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ selectedUserForDetails.orderCount || 0 }}</span>
                    <span class="stat-label">订单数量</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">¥{{ selectedUserForDetails.totalSpent || 0 }}</span>
                    <span class="stat-label">消费总额</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="editUser(selectedUserForDetails)" class="edit-details-btn">
            编辑信息
          </button>
          <button @click="closeDetailsModal" class="close-details-btn">
            关闭
          </button>
        </div>
      </div>
    </div>

    <!-- 确认删除模态框 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="closeDeleteConfirm">
      <div class="modal small-modal" @click.stop>
        <div class="modal-header danger">
          <h3>确认删除用户</h3>
          <button @click="closeDeleteConfirm" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="delete-warning">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">
              <p>您即将删除用户 <strong>{{ userToDelete?.name }}</strong>。</p>
              <p>此操作不可撤销，将永久删除该用户的所有数据，包括：</p>
              <ul>
                <li>用户基本信息和资料</li>
                <li>历史订单和交易记录</li>
                <li>收藏和购物车内容</li>
                <li>评论和评分记录</li>
              </ul>
              <p>请输入用户姓名 <code>{{ userToDelete?.name }}</code> 以确认删除：</p>
            </div>
          </div>
          
          <input 
            v-model="deleteConfirmName"
            type="text"
            :placeholder="'请输入 ' + userToDelete?.name + ' 以确认'"
            class="confirm-input"
          >
        </div>
        
        <div class="modal-footer">
          <button @click="closeDeleteConfirm" class="cancel-btn">取消</button>
          <button 
            @click="confirmDelete" 
            :disabled="deleteConfirmName !== userToDelete?.name || deleting"
            class="delete-confirm-btn"
          >
            {{ deleting ? '删除中...' : '确认删除' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotification } from '@/composables/useNotification'
import { formatRelativeDate, formatFullDate } from '@/utils/dateUtils'
import { exportToCSV, exportToExcel } from '@/utils/exportUtils'
import { validateEmail, validatePhone } from '@/utils/validation'

// 状态管理
const userStore = useUserStore()
const { showSuccess, showError, showWarning } = useNotification()

// 响应式数据
const users = ref([])
const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('')
const sortField = ref('createdAt')
const sortDirection = ref('desc')
const currentPage = ref(1)
const pageSize = ref(20)
const selectedUsers = ref([])
const selectAll = ref(false)

// 模态框状态
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedUserForDetails = ref(null)
const userToDelete = ref(null)
const deleteConfirmName = ref('')
const submitting = ref(false)
const deleting = ref(false)

// 用户表单
const userForm = ref({
  id: null,
  name: '',
  email: '',
  phone: '',
  role: 'user',
  status: 'active',
  bio: ''
})

// 统计数据
const totalUsers = computed(() => users.value.length)
const activeUsers = computed(() => users.value.filter(u => u.status === 'active').length)
const newUsersThisMonth = computed(() => {
  const thisMonth = new Date()
  thisMonth.setDate(1)
  return users.value.filter(u => new Date(u.createdAt) >= thisMonth).length
})
const monthlyRevenue = computed(() => {
  return users.value.reduce((sum, user) => sum + (user.totalSpent || 0), 0).toLocaleString()
})

// 筛选和排序后的用户列表
const filteredUsers = computed(() => {
  let filtered = users.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.email.toLowerCase().includes(query)
    )
  }

  // 状态过滤
  if (statusFilter.value) {
    filtered = filtered.filter(user => user.status === statusFilter.value)
  }

  // 排序
  filtered.sort((a, b) => {
    let aVal = a[sortField.value]
    let bVal = b[sortField.value]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (sortDirection.value === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })

  return filtered
})

// 分页数据
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize.value))
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredUsers.value.slice(start, end)
})

// 可见页码
const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (current > 4) pages.push('...')
    
    const start = Math.max(2, current - 2)
    const end = Math.min(total - 1, current + 2)
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    if (current < total - 3) pages.push('...')
    pages.push(total)
  }
  
  return pages
})

// 生命周期
onMounted(() => {
  loadUsers()
})

// 监听器
watch(selectAll, (newVal) => {
  if (newVal) {
    selectedUsers.value = paginatedUsers.value.map(u => u.id)
  } else {
    selectedUsers.value = []
  }
})

watch([searchQuery, statusFilter], () => {
  currentPage.value = 1
})

// 方法定义
const loadUsers = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    users.value = await userStore.fetchUsers()
  } catch (error) {
    showError('加载用户数据失败：' + error.message)
  } finally {
    loading.value = false
  }
}

const searchUsers = () => {
  currentPage.value = 1
  // 搜索逻辑已在computed中处理
}

const refreshUserList = () => {
  loadUsers()
  selectedUsers.value = []
  selectAll.value = false
  showSuccess('用户列表已刷新')
}

const sortBy = (field) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

const getSortClass = (field) => {
  if (sortField.value !== field) return ''
  return sortDirection.value === 'asc' ? 'sort-asc' : 'sort-desc'
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedUsers.value = paginatedUsers.value.map(u => u.id)
  } else {
    selectedUsers.value = []
  }
}

const selectUser = (userId) => {
  const index = selectedUsers.value.indexOf(userId)
  if (index > -1) {
    selectedUsers.value.splice(index, 1)
  } else {
    selectedUsers.value.push(userId)
  }
  selectAll.value = selectedUsers.value.length === paginatedUsers.value.length
}

const toggleUserSelection = (userId) => {
  selectUser(userId)
}

const getStatusClass = (status) => {
  const classes = {
    active: 'status-active',
    inactive: 'status-inactive', 
    suspended: 'status-suspended',
    pending: 'status-pending'
  }
  return classes[status] || ''
}

const getStatusText = (status) => {
  const texts = {
    active: '活跃',
    inactive: '未激活',
    suspended: '已暂停', 
    pending: '待审核'
  }
  return texts[status] || status
}

const getRoleClass = (role) => {
  const classes = {
    user: 'role-user',
    premium: 'role-premium',
    admin: 'role-admin',
    super_admin: 'role-super-admin'
  }
  return classes[role] || ''
}

const getRoleText = (role) => {
  const texts = {
    user: '普通用户',
    premium: '高级用户',
    admin: '管理员',
    super_admin: '超级管理员'
  }
  return texts[role] || role
}

const handleAvatarError = (event) => {
  event.target.src = '/default-avatar.png'
}

const editUser = (user) => {
  userForm.value = { ...user }
  showEditModal.value = true
  showDetailsModal.value = false
}

const viewUserDetails = (user) => {
  selectedUserForDetails.value = user
  showDetailsModal.value = true
}

const suspendUser = async (user) => {
  try {
    await userStore.updateUserStatus(user.id, 'suspended')
    user.status = 'suspended'
    showSuccess(\`用户 \${user.name} 已被暂停\`)
  } catch (error) {
    showError('暂停用户失败：' + error.message)
  }
}

const activateUser = async (user) => {
  try {
    await userStore.updateUserStatus(user.id, 'active')
    user.status = 'active'
    showSuccess(\`用户 \${user.name} 已被激活\`)
  } catch (error) {
    showError('激活用户失败：' + error.message)
  }
}

const deleteUser = (user) => {
  userToDelete.value = user
  deleteConfirmName.value = ''
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (deleteConfirmName.value !== userToDelete.value?.name) return
  
  deleting.value = true
  try {
    await userStore.deleteUser(userToDelete.value.id)
    users.value = users.value.filter(u => u.id !== userToDelete.value.id)
    showSuccess(\`用户 \${userToDelete.value.name} 已被删除\`)
    closeDeleteConfirm()
  } catch (error) {
    showError('删除用户失败：' + error.message)
  } finally {
    deleting.value = false
  }
}

const exportUsers = async () => {
  try {
    const dataToExport = filteredUsers.value.map(user => ({
      'ID': user.id,
      '姓名': user.name,
      '邮箱': user.email,
      '手机': user.phone || '',
      '状态': getStatusText(user.status),
      '角色': getRoleText(user.role),
      '注册时间': formatFullDate(user.createdAt),
      '最后登录': user.lastLoginAt ? formatFullDate(user.lastLoginAt) : '从未登录'
    }))
    
    await exportToExcel(dataToExport, '用户列表导出')
    showSuccess('用户数据导出成功')
  } catch (error) {
    showError('导出失败：' + error.message)
  }
}

const bulkActivate = async () => {
  try {
    await userStore.bulkUpdateStatus(selectedUsers.value, 'active')
    users.value.forEach(user => {
      if (selectedUsers.value.includes(user.id)) {
        user.status = 'active'
      }
    })
    showSuccess(\`已激活 \${selectedUsers.value.length} 个用户\`)
    selectedUsers.value = []
    selectAll.value = false
  } catch (error) {
    showError('批量激活失败：' + error.message)
  }
}

const bulkSuspend = async () => {
  try {
    await userStore.bulkUpdateStatus(selectedUsers.value, 'suspended')
    users.value.forEach(user => {
      if (selectedUsers.value.includes(user.id)) {
        user.status = 'suspended'
      }
    })
    showSuccess(\`已暂停 \${selectedUsers.value.length} 个用户\`)
    selectedUsers.value = []
    selectAll.value = false
  } catch (error) {
    showError('批量暂停失败：' + error.message)
  }
}

const bulkExport = async () => {
  try {
    const selectedUserData = users.value
      .filter(user => selectedUsers.value.includes(user.id))
      .map(user => ({
        'ID': user.id,
        '姓名': user.name,
        '邮箱': user.email,
        '状态': getStatusText(user.status),
        '角色': getRoleText(user.role)
      }))
    
    await exportToExcel(selectedUserData, '选中用户导出')
    showSuccess(\`已导出 \${selectedUsers.value.length} 个用户的数据\`)
  } catch (error) {
    showError('导出失败：' + error.message)
  }
}

const bulkDelete = async () => {
  if (!confirm(\`确定要删除选中的 \${selectedUsers.value.length} 个用户吗？此操作不可撤销！\`)) {
    return
  }
  
  try {
    await userStore.bulkDeleteUsers(selectedUsers.value)
    users.value = users.value.filter(user => !selectedUsers.value.includes(user.id))
    showSuccess(\`已删除 \${selectedUsers.value.length} 个用户\`)
    selectedUsers.value = []
    selectAll.value = false
  } catch (error) {
    showError('批量删除失败：' + error.message)
  }
}

const submitUserForm = async () => {
  // 表单验证
  if (!userForm.value.name.trim()) {
    showError('请输入用户姓名')
    return
  }
  
  if (!validateEmail(userForm.value.email)) {
    showError('请输入有效的邮箱地址')
    return
  }
  
  if (userForm.value.phone && !validatePhone(userForm.value.phone)) {
    showError('请输入有效的手机号码')
    return
  }

  submitting.value = true
  try {
    if (showCreateModal.value) {
      const newUser = await userStore.createUser(userForm.value)
      users.value.unshift(newUser)
      showSuccess(\`用户 \${newUser.name} 创建成功\`)
    } else {
      const updatedUser = await userStore.updateUser(userForm.value)
      const index = users.value.findIndex(u => u.id === updatedUser.id)
      if (index > -1) {
        users.value[index] = updatedUser
      }
      showSuccess(\`用户 \${updatedUser.name} 更新成功\`)
    }
    closeModals()
  } catch (error) {
    showError((showCreateModal.value ? '创建' : '更新') + '用户失败：' + error.message)
  } finally {
    submitting.value = false
  }
}

const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  userForm.value = {
    id: null,
    name: '',
    email: '',
    phone: '',
    role: 'user',
    status: 'active',
    bio: ''
  }
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedUserForDetails.value = null
}

const closeDeleteConfirm = () => {
  showDeleteConfirm.value = false
  userToDelete.value = null
  deleteConfirmName.value = ''
}
</script>`,
    afterCode: `<!-- src/views/user/UserManagement.vue -->
<template>
  <div class="user-management">
    <div class="page-header">
      <h1>{{ t('user.management.title') }}</h1>
      <p class="subtitle">{{ t('user.management.subtitle') }}</p>
      
      <!-- 搜索和筛选区域 -->
      <div class="search-filters">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            :placeholder="t('user.search.placeholder')"
            class="search-input"
          >
          <button @click="searchUsers" class="search-btn">{{ t('common.search') }}</button>
        </div>
        
        <div class="filter-dropdown">
          <select v-model="statusFilter" class="status-filter">
            <option value="">{{ t('user.filter.allStatus') }}</option>
            <option value="active">{{ t('user.status.active') }}</option>
            <option value="inactive">{{ t('user.status.inactive') }}</option>
            <option value="suspended">{{ t('user.status.suspended') }}</option>
            <option value="pending">{{ t('user.status.pending') }}</option>
          </select>
        </div>
        
        <button @click="showCreateModal = true" class="create-btn">
          <span class="icon">+</span>
          {{ t('user.actions.create') }}
        </button>
      </div>
    </div>

    <!-- 用户统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon user-icon">👥</div>
        <div class="stat-info">
          <h3>{{ totalUsers }}</h3>
          <p>{{ t('user.stats.total') }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active-icon">✅</div>
        <div class="stat-info">
          <h3>{{ activeUsers }}</h3>
          <p>{{ t('user.stats.active') }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon new-icon">🆕</div>
        <div class="stat-info">
          <h3>{{ newUsersThisMonth }}</h3>
          <p>{{ t('user.stats.newThisMonth') }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon revenue-icon">💰</div>
        <div class="stat-info">
          <h3>{{ t('currency.symbol') }}{{ monthlyRevenue }}</h3>
          <p>{{ t('user.stats.monthlyRevenue') }}</p>
        </div>
      </div>
    </div>

    <!-- 用户列表表格 -->
    <div class="user-table-container">
      <div class="table-header">
        <h2>{{ t('user.table.title') }}</h2>
        <div class="table-actions">
          <button @click="exportUsers" class="export-btn">{{ t('user.actions.export') }}</button>
          <button @click="refreshUserList" class="refresh-btn">{{ t('common.refresh') }}</button>
        </div>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>{{ t('user.loading.users') }}</p>
      </div>

      <table v-else class="user-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" @change="toggleSelectAll">
            </th>
            <th @click="sortBy('name')">
              {{ t('user.fields.name') }}
              <span class="sort-indicator" :class="getSortClass('name')">↕️</span>
            </th>
            <th @click="sortBy('email')">
              {{ t('user.fields.email') }}
              <span class="sort-indicator" :class="getSortClass('email')">↕️</span>
            </th>
            <th>{{ t('user.fields.avatar') }}</th>
            <th @click="sortBy('status')">
              {{ t('user.fields.status') }}
              <span class="sort-indicator" :class="getSortClass('status')">↕️</span>
            </th>
            <th @click="sortBy('role')">
              {{ t('user.fields.role') }}
              <span class="sort-indicator" :class="getSortClass('role')">↕️</span>
            </th>
            <th @click="sortBy('createdAt')">
              {{ t('user.fields.createdAt') }}
              <span class="sort-indicator" :class="getSortClass('createdAt')">↕️</span>
            </th>
            <th @click="sortBy('lastLoginAt')">
              {{ t('user.fields.lastLogin') }}
              <span class="sort-indicator" :class="getSortClass('lastLoginAt')">↕️</span>
            </th>
            <th>{{ t('common.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in paginatedUsers" 
            :key="user.id"
            :class="{ 'selected': selectedUsers.includes(user.id) }"
            @click="selectUser(user.id)"
          >
            <td>
              <input 
                type="checkbox" 
                :checked="selectedUsers.includes(user.id)"
                @change="toggleUserSelection(user.id)"
                @click.stop
              >
            </td>
            <td class="user-name-cell">
              <div class="user-info">
                <strong>{{ user.name }}</strong>
                <small class="user-id">{{ t('user.fields.id') }}: {{ user.id }}</small>
              </div>
            </td>
            <td class="email-cell">{{ user.email }}</td>
            <td class="avatar-cell">
              <img 
                :src="user.avatar || '/default-avatar.png'" 
                :alt="t('user.avatar.alt', { name: user.name })"
                class="user-avatar"
                @error="handleAvatarError"
              >
            </td>
            <td class="status-cell">
              <span :class="['status-badge', getStatusClass(user.status)]">
                {{ t(\`user.status.\${user.status}\`) }}
              </span>
            </td>
            <td class="role-cell">
              <span :class="['role-badge', getRoleClass(user.role)]">
                {{ t(\`user.roles.\${user.role}\`) }}
              </span>
            </td>
            <td class="date-cell">
              <time :datetime="user.createdAt" :title="formatFullDate(user.createdAt)">
                {{ formatRelativeDate(user.createdAt) }}
              </time>
            </td>
            <td class="date-cell">
              <time 
                v-if="user.lastLoginAt" 
                :datetime="user.lastLoginAt"
                :title="formatFullDate(user.lastLoginAt)"
              >
                {{ formatRelativeDate(user.lastLoginAt) }}
              </time>
              <span v-else class="never-logged-in">{{ t('user.neverLoggedIn') }}</span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <button 
                  @click.stop="editUser(user)" 
                  class="action-btn edit-btn"
                  :title="t('user.actions.edit', { name: user.name })"
                >
                  ✏️
                </button>
                <button 
                  @click.stop="viewUserDetails(user)" 
                  class="action-btn view-btn"
                  :title="t('user.actions.view', { name: user.name })"
                >
                  👁️
                </button>
                <button 
                  v-if="user.status === 'active'"
                  @click.stop="suspendUser(user)" 
                  class="action-btn suspend-btn"
                  :title="t('user.actions.suspend', { name: user.name })"
                >
                  ⏸️
                </button>
                <button 
                  v-else-if="user.status === 'suspended'"
                  @click.stop="activateUser(user)" 
                  class="action-btn activate-btn"
                  :title="t('user.actions.activate', { name: user.name })"
                >
                  ✅
                </button>
                <button 
                  @click.stop="deleteUser(user)" 
                  class="action-btn delete-btn"
                  :title="t('user.actions.delete', { name: user.name })"
                >
                  🗑️
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <div class="pagination-info">
          {{ t('pagination.showing', { 
            start: (currentPage - 1) * pageSize + 1,
            end: Math.min(currentPage * pageSize, totalUsers),
            total: totalUsers 
          }) }}
        </div>
        <div class="pagination-controls">
          <button 
            @click="currentPage = 1" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            {{ t('pagination.first') }}
          </button>
          <button 
            @click="currentPage--" 
            :disabled="currentPage === 1"
            class="pagination-btn"
          >
            {{ t('pagination.previous') }}
          </button>
          
          <div class="page-numbers">
            <button
              v-for="page in visiblePages"
              :key="page"
              @click="currentPage = page"
              :class="['page-btn', { active: page === currentPage }]"
            >
              {{ page }}
            </button>
          </div>
          
          <button 
            @click="currentPage++" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            {{ t('pagination.next') }}
          </button>
          <button 
            @click="currentPage = totalPages" 
            :disabled="currentPage === totalPages"
            class="pagination-btn"
          >
            {{ t('pagination.last') }}
          </button>
        </div>
        <div class="page-size-selector">
          <label>{{ t('pagination.pageSize') }}：</label>
          <select v-model="pageSize" @change="currentPage = 1">
            <option value="10">{{ t('pagination.perPage', { count: 10 }) }}</option>
            <option value="20">{{ t('pagination.perPage', { count: 20 }) }}</option>
            <option value="50">{{ t('pagination.perPage', { count: 50 }) }}</option>
            <option value="100">{{ t('pagination.perPage', { count: 100 }) }}</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 批量操作栏 -->
    <div v-if="selectedUsers.length > 0" class="bulk-actions-bar">
      <div class="selected-info">
        {{ t('user.bulk.selected', { count: selectedUsers.length }) }}
      </div>
      <div class="bulk-actions">
        <button @click="bulkActivate" class="bulk-btn activate">{{ t('user.bulk.activate') }}</button>
        <button @click="bulkSuspend" class="bulk-btn suspend">{{ t('user.bulk.suspend') }}</button>
        <button @click="bulkExport" class="bulk-btn export">{{ t('user.bulk.export') }}</button>
        <button @click="bulkDelete" class="bulk-btn delete">{{ t('user.bulk.delete') }}</button>
      </div>
    </div>

    <!-- 创建/编辑用户模态框 -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ showCreateModal ? t('user.form.createTitle') : t('user.form.editTitle') }}</h3>
          <button @click="closeModals" class="close-btn">×</button>
        </div>
        
        <form @submit.prevent="submitUserForm" class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label for="userName">{{ t('user.form.name') }} *</label>
              <input 
                id="userName"
                v-model="userForm.name"
                type="text"
                required
                :placeholder="t('user.form.namePlaceholder')"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="userEmail">{{ t('user.form.email') }} *</label>
              <input 
                id="userEmail"
                v-model="userForm.email"
                type="email"
                required
                :placeholder="t('user.form.emailPlaceholder')"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="userPhone">{{ t('user.form.phone') }}</label>
              <input 
                id="userPhone"
                v-model="userForm.phone"
                type="tel"
                :placeholder="t('user.form.phonePlaceholder')"
                class="form-input"
              >
            </div>
            
            <div class="form-group">
              <label for="userRole">{{ t('user.form.role') }}</label>
              <select id="userRole" v-model="userForm.role" class="form-select">
                <option value="user">{{ t('user.roles.user') }}</option>
                <option value="premium">{{ t('user.roles.premium') }}</option>
                <option value="admin">{{ t('user.roles.admin') }}</option>
                <option value="super_admin">{{ t('user.roles.super_admin') }}</option>
              </select>
            </div>
            
            <div class="form-group">
              <label for="userStatus">{{ t('user.form.status') }}</label>
              <select id="userStatus" v-model="userForm.status" class="form-select">
                <option value="active">{{ t('user.status.active') }}</option>
                <option value="inactive">{{ t('user.status.inactive') }}</option>
                <option value="suspended">{{ t('user.status.suspended') }}</option>
                <option value="pending">{{ t('user.status.pending') }}</option>
              </select>
            </div>
            
            <div class="form-group full-width">
              <label for="userBio">{{ t('user.form.bio') }}</label>
              <textarea 
                id="userBio"
                v-model="userForm.bio"
                :placeholder="t('user.form.bioPlaceholder')"
                class="form-textarea"
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModals" class="cancel-btn">
              {{ t('common.cancel') }}
            </button>
            <button type="submit" class="submit-btn" :disabled="submitting">
              {{ submitting ? t('common.submitting') : (showCreateModal ? t('user.form.create') : t('user.form.save')) }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 用户详情模态框 -->
    <div v-if="showDetailsModal && selectedUserForDetails" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal large-modal" @click.stop>
        <div class="modal-header">
          <h3>{{ t('user.details.title', { name: selectedUserForDetails.name }) }}</h3>
          <button @click="closeDetailsModal" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="user-details">
            <div class="user-avatar-section">
              <img 
                :src="selectedUserForDetails.avatar || '/default-avatar.png'"
                :alt="t('user.avatar.alt', { name: selectedUserForDetails.name })"
                class="large-avatar"
              >
              <button class="change-avatar-btn">{{ t('user.details.changeAvatar') }}</button>
            </div>
            
            <div class="user-info-sections">
              <div class="info-section">
                <h4>{{ t('user.details.basicInfo') }}</h4>
                <div class="info-grid">
                  <div class="info-item">
                    <label>{{ t('user.fields.id') }}</label>
                    <span>{{ selectedUserForDetails.id }}</span>
                  </div>
                  <div class="info-item">
                    <label>{{ t('user.fields.name') }}</label>
                    <span>{{ selectedUserForDetails.name }}</span>
                  </div>
                  <div class="info-item">
                    <label>{{ t('user.fields.email') }}</label>
                    <span>{{ selectedUserForDetails.email }}</span>
                  </div>
                  <div class="info-item">
                    <label>{{ t('user.fields.phone') }}</label>
                    <span>{{ selectedUserForDetails.phone || t('user.notSet') }}</span>
                  </div>
                  <div class="info-item">
                    <label>{{ t('user.fields.createdAt') }}</label>
                    <span>{{ formatFullDate(selectedUserForDetails.createdAt) }}</span>
                  </div>
                  <div class="info-item">
                    <label>{{ t('user.fields.lastLogin') }}</label>
                    <span>
                      {{ selectedUserForDetails.lastLoginAt 
                        ? formatFullDate(selectedUserForDetails.lastLoginAt) 
                        : t('user.neverLoggedIn') }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="info-section">
                <h4>{{ t('user.details.accountStatus') }}</h4>
                <div class="status-info">
                  <span :class="['large-status-badge', getStatusClass(selectedUserForDetails.status)]">
                    {{ t(\`user.status.\${selectedUserForDetails.status}\`) }}
                  </span>
                  <span :class="['large-role-badge', getRoleClass(selectedUserForDetails.role)]">
                    {{ t(\`user.roles.\${selectedUserForDetails.role}\`) }}
                  </span>
                </div>
              </div>
              
              <div class="info-section">
                <h4>{{ t('user.details.bio') }}</h4>
                <p class="user-bio">
                  {{ selectedUserForDetails.bio || t('user.details.noBio') }}
                </p>
              </div>
              
              <div class="info-section">
                <h4>{{ t('user.details.statistics') }}</h4>
                <div class="stats-row">
                  <div class="stat-item">
                    <span class="stat-number">{{ selectedUserForDetails.loginCount || 0 }}</span>
                    <span class="stat-label">{{ t('user.stats.loginCount') }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ selectedUserForDetails.orderCount || 0 }}</span>
                    <span class="stat-label">{{ t('user.stats.orderCount') }}</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ t('currency.symbol') }}{{ selectedUserForDetails.totalSpent || 0 }}</span>
                    <span class="stat-label">{{ t('user.stats.totalSpent') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button @click="editUser(selectedUserForDetails)" class="edit-details-btn">
            {{ t('user.details.edit') }}
          </button>
          <button @click="closeDetailsModal" class="close-details-btn">
            {{ t('common.close') }}
          </button>
        </div>
      </div>
    </div>

    <!-- 确认删除模态框 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="closeDeleteConfirm">
      <div class="modal small-modal" @click.stop>
        <div class="modal-header danger">
          <h3>{{ t('user.delete.confirmTitle') }}</h3>
          <button @click="closeDeleteConfirm" class="close-btn">×</button>
        </div>
        
        <div class="modal-body">
          <div class="delete-warning">
            <div class="warning-icon">⚠️</div>
            <div class="warning-text">
              <p>{{ t('user.delete.warning', { name: userToDelete?.name }) }}</p>
              <p>{{ t('user.delete.irreversible') }}</p>
              <ul>
                <li>{{ t('user.delete.data.profile') }}</li>
                <li>{{ t('user.delete.data.orders') }}</li>
                <li>{{ t('user.delete.data.favorites') }}</li>
                <li>{{ t('user.delete.data.comments') }}</li>
              </ul>
              <p>{{ t('user.delete.confirmPrompt', { name: userToDelete?.name }) }}</p>
            </div>
          </div>
          
          <input 
            v-model="deleteConfirmName"
            type="text"
            :placeholder="t('user.delete.inputPlaceholder', { name: userToDelete?.name })"
            class="confirm-input"
          >
        </div>
        
        <div class="modal-footer">
          <button @click="closeDeleteConfirm" class="cancel-btn">{{ t('common.cancel') }}</button>
          <button 
            @click="confirmDelete" 
            :disabled="deleteConfirmName !== userToDelete?.name || deleting"
            class="delete-confirm-btn"
          >
            {{ deleting ? t('user.delete.deleting') : t('user.delete.confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/stores/user'
import { useNotification } from '@/composables/useNotification'
import { formatRelativeDate, formatFullDate } from '@/utils/dateUtils'
import { exportToCSV, exportToExcel } from '@/utils/exportUtils'
import { validateEmail, validatePhone } from '@/utils/validation'

// 国际化
const { t } = useI18n()

// 其余代码保持不变...
</script>`,
    config: `// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginsAutoI18n from 'vite-auto-i18n-plugin'
import { YoudaoTranslator } from 'vite-auto-i18n-plugin'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    vitePluginsAutoI18n({
      // 核心配置
      scanDirs: ['src'],                    // 扫描目录
      outDir: 'locales',                    // 输出目录
      languages: ['en-US', 'ja-JP', 'ko-KR'], // 目标语言
      
      // 翻译器配置
      translator: new YoudaoTranslator({
        appId: process.env.VITE_YOUDAO_APP_ID,
        appKey: process.env.VITE_YOUDAO_APP_KEY
      }),
      
      // Vue-i18n 深度集成
      vueI18nIntegration: {
        enabled: true,                      // 启用 Vue-i18n 集成
        globalInjection: true,              // 全局注入 $t 方法
        legacy: false,                      // 使用 Composition API 模式
        locale: 'zh-CN',                    // 默认语言
        fallbackLocale: 'en-US',            // 备用语言
        
        // 自动导入配置
        autoImport: {
          enabled: true,                    // 自动导入翻译文件
          loadingType: 'async',             // 异步加载方式
          preloadLocales: ['zh-CN', 'en-US'] // 预加载语言
        },
        
        // 路由国际化
        routing: {
          enabled: true,                    // 启用路由国际化
          strategy: 'prefix_except_default', // 路由策略
          locales: [
            { code: 'zh-CN', name: '中文', file: 'zh-CN.json' },
            { code: 'en-US', name: 'English', file: 'en-US.json' },
            { code: 'ja-JP', name: '日本語', file: 'ja-JP.json' },
            { code: 'ko-KR', name: '한국어', file: 'ko-KR.json' }
          ]
        }
      },
      
      // 高级扫描配置
      scanOptions: {
        include: ['**/*.vue', '**/*.js', '**/*.ts'], // 扫描文件类型
        exclude: ['**/node_modules/**', '**/dist/**'], // 排除目录
        
        // 自定义提取规则
        extractRules: [
          {
            pattern: /\\$t\\(['"]([^'"]+)['"].*?\\)/g,    // 标准 $t() 调用
            keyIndex: 1
          },
          {
            pattern: /t\\(['"]([^'"]+)['"].*?\\)/g,       // 组合式 API t() 调用  
            keyIndex: 1
          },
          {
            pattern: /\\$tc\\(['"]([^'"]+)['"].*?\\)/g,   // 复数形式
            keyIndex: 1
          }
        ]
      },
      
      // 文件生成配置
      generateOptions: {
        generateJSON: true,                 // 生成 JSON 文件
        generateTS: true,                   // 生成 TypeScript 类型定义
        generateDTS: true,                  // 生成 .d.ts 声明文件
        
        // JSON 格式化
        jsonOptions: {
          spaces: 2,                        // 缩进空格数
          sortKeys: true,                   // 按键名排序
          escapeUnicode: false              // 不转义 Unicode
        },
        
        // 命名空间配置
        namespace: {
          enabled: true,                    // 启用命名空间
          separator: '.',                   // 分隔符
          maxDepth: 4                       // 最大嵌套深度
        }
      },
      
      // 热重载配置
      hotReload: {
        enabled: true,                      // 启用热重载
        watchFiles: ['src/**/*.vue'],       // 监听文件变化
        autoRegenerate: true,               // 自动重新生成
        debounce: 500                       // 防抖延迟 (ms)
      },
      
      // 开发模式配置
      dev: {
        showMissingKeys: true,              // 显示缺失的键
        logLevel: 'info',                   // 日志级别
        overlay: true,                      // 显示错误覆盖层
        
        // 调试工具
        debug: {
          enabled: true,                    // 启用调试模式
          showExtractedKeys: true,          // 显示提取的键
          showTranslationProgress: true,    // 显示翻译进度
          saveDebugInfo: './debug-i18n.json' // 保存调试信息
        }
      },
      
      // 生产模式优化
      build: {
        minifyJSON: true,                   // 压缩 JSON 文件
        removeComments: true,               // 移除注释
        treeShaking: true,                  // 移除未使用的翻译
        
        // 代码分割
        codeSplitting: {
          enabled: true,                    // 启用代码分割
          strategy: 'locale',               // 按语言分割
          chunkSize: 'auto'                 // 自动计算块大小
        }
      }
    })
  ],
  
  // 路径别名配置
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@locales': path.resolve(__dirname, 'locales')
    }
  },
  
  // 环境变量
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  }
})

// .env 文件配置
/*
# .env.local
VITE_YOUDAO_APP_ID=your_app_id_here
VITE_YOUDAO_APP_KEY=your_app_key_here

# 支持的环境变量
VITE_I18N_LOCALE=zh-CN              # 默认语言
VITE_I18N_FALLBACK_LOCALE=en-US     # 备用语言
VITE_I18N_DEBUG=true                 # 调试模式
*/`,
    generatedFiles: {
      'locales/zh-CN.json': `{
  "user": {
    "management": {
      "title": "用户管理系统",
      "subtitle": "管理和维护平台用户信息"
    },
    "search": {
      "placeholder": "搜索用户姓名或邮箱..."
    },
    "filter": {
      "allStatus": "所有状态"
    },
    "actions": {
      "create": "创建新用户",
      "edit": "编辑 {name}",
      "view": "查看 {name} 的详情",
      "suspend": "暂停 {name} 的账户",
      "activate": "激活 {name} 的账户", 
      "delete": "删除 {name} 的账户",
      "export": "导出数据"
    },
    "status": {
      "active": "活跃用户",
      "inactive": "未激活",
      "suspended": "已暂停",
      "pending": "待审核"
    },
    "roles": {
      "user": "普通用户",
      "premium": "高级用户",
      "admin": "管理员", 
      "super_admin": "超级管理员"
    },
    "fields": {
      "id": "ID",
      "name": "姓名",
      "email": "邮箱",
      "avatar": "头像",
      "status": "状态",
      "role": "角色",
      "createdAt": "注册时间",
      "lastLogin": "最后登录",
      "phone": "手机号码"
    },
    "stats": {
      "total": "总用户数",
      "active": "活跃用户", 
      "newThisMonth": "本月新增",
      "monthlyRevenue": "月度收入",
      "loginCount": "登录次数",
      "orderCount": "订单数量",
      "totalSpent": "消费总额"
    },
    "table": {
      "title": "用户列表"
    },
    "loading": {
      "users": "正在加载用户数据..."
    },
    "bulk": {
      "selected": "已选择 {count} 个用户",
      "activate": "批量激活",
      "suspend": "批量暂停",
      "export": "导出选中",
      "delete": "批量删除"
    },
    "form": {
      "createTitle": "创建新用户",
      "editTitle": "编辑用户信息",
      "name": "姓名",
      "namePlaceholder": "请输入用户姓名",
      "email": "邮箱地址",
      "emailPlaceholder": "请输入邮箱地址",
      "phone": "手机号码",
      "phonePlaceholder": "请输入手机号码",
      "role": "用户角色",
      "status": "账户状态",
      "bio": "个人简介",
      "bioPlaceholder": "请输入个人简介（可选）",
      "create": "创建用户",
      "save": "保存修改"
    },
    "details": {
      "title": "{name} 的详细信息",
      "changeAvatar": "更换头像",
      "basicInfo": "基本信息",
      "accountStatus": "账户状态",
      "bio": "个人简介",
      "noBio": "该用户还没有填写个人简介。",
      "statistics": "使用统计",
      "edit": "编辑信息"
    },
    "delete": {
      "confirmTitle": "确认删除用户",
      "warning": "您即将删除用户 {name}。",
      "irreversible": "此操作不可撤销，将永久删除该用户的所有数据，包括：",
      "data": {
        "profile": "用户基本信息和资料",
        "orders": "历史订单和交易记录", 
        "favorites": "收藏和购物车内容",
        "comments": "评论和评分记录"
      },
      "confirmPrompt": "请输入用户姓名 {name} 以确认删除：",
      "inputPlaceholder": "请输入 {name} 以确认",
      "deleting": "删除中...",
      "confirm": "确认删除"
    },
    "avatar": {
      "alt": "{name} 的头像"
    },
    "neverLoggedIn": "从未登录",
    "notSet": "未设置"
  },
  "pagination": {
    "showing": "显示第 {start} - {end} 条，共 {total} 条记录",
    "first": "首页",
    "previous": "上一页", 
    "next": "下一页",
    "last": "末页",
    "pageSize": "每页显示",
    "perPage": "{count} 条"
  },
  "currency": {
    "symbol": "¥"
  },
  "common": {
    "search": "搜索",
    "refresh": "刷新",
    "actions": "操作",
    "cancel": "取消",
    "close": "关闭",
    "submitting": "提交中..."
  }
}`,
      'locales/en-US.json': `{
  "user": {
    "management": {
      "title": "User Management System",
      "subtitle": "Manage and maintain platform user information"
    },
    "search": {
      "placeholder": "Search by name or email..."
    },
    "filter": {
      "allStatus": "All Status"
    },
    "actions": {
      "create": "Create New User",
      "edit": "Edit {name}",
      "view": "View {name} Details",
      "suspend": "Suspend {name}'s Account",
      "activate": "Activate {name}'s Account",
      "delete": "Delete {name}'s Account", 
      "export": "Export Data"
    },
    "status": {
      "active": "Active",
      "inactive": "Inactive",
      "suspended": "Suspended",
      "pending": "Pending"
    },
    "roles": {
      "user": "User",
      "premium": "Premium User",
      "admin": "Administrator",
      "super_admin": "Super Administrator"
    },
    "fields": {
      "id": "ID",
      "name": "Name",
      "email": "Email",
      "avatar": "Avatar",
      "status": "Status",
      "role": "Role",
      "createdAt": "Created At",
      "lastLogin": "Last Login",
      "phone": "Phone"
    },
    "stats": {
      "total": "Total Users",
      "active": "Active Users",
      "newThisMonth": "New This Month",
      "monthlyRevenue": "Monthly Revenue",
      "loginCount": "Login Count",
      "orderCount": "Order Count", 
      "totalSpent": "Total Spent"
    },
    "table": {
      "title": "User List"
    },
    "loading": {
      "users": "Loading user data..."
    },
    "bulk": {
      "selected": "{count} users selected",
      "activate": "Bulk Activate",
      "suspend": "Bulk Suspend", 
      "export": "Export Selected",
      "delete": "Bulk Delete"
    },
    "form": {
      "createTitle": "Create New User",
      "editTitle": "Edit User Information",
      "name": "Name",
      "namePlaceholder": "Enter user name",
      "email": "Email Address",
      "emailPlaceholder": "Enter email address",
      "phone": "Phone Number",
      "phonePlaceholder": "Enter phone number",
      "role": "User Role",
      "status": "Account Status",
      "bio": "Bio",
      "bioPlaceholder": "Enter bio (optional)",
      "create": "Create User",
      "save": "Save Changes"
    },
    "details": {
      "title": "{name}'s Details",
      "changeAvatar": "Change Avatar",
      "basicInfo": "Basic Information",
      "accountStatus": "Account Status",
      "bio": "Bio",
      "noBio": "This user has not filled in their bio yet.",
      "statistics": "Usage Statistics",
      "edit": "Edit Information"
    },
    "delete": {
      "confirmTitle": "Confirm Delete User",
      "warning": "You are about to delete user {name}.",
      "irreversible": "This operation cannot be undone and will permanently delete all user data, including:",
      "data": {
        "profile": "User basic information and profile",
        "orders": "Historical orders and transaction records",
        "favorites": "Favorites and cart contents", 
        "comments": "Comments and rating records"
      },
      "confirmPrompt": "Please enter the user name {name} to confirm deletion:",
      "inputPlaceholder": "Enter {name} to confirm",
      "deleting": "Deleting...",
      "confirm": "Confirm Delete"
    },
    "avatar": {
      "alt": "{name}'s avatar"
    },
    "neverLoggedIn": "Never logged in",
    "notSet": "Not set"
  },
  "pagination": {
    "showing": "Showing {start} - {end} of {total} records",
    "first": "First",
    "previous": "Previous",
    "next": "Next", 
    "last": "Last",
    "pageSize": "Per page",
    "perPage": "{count} items"
  },
  "currency": {
    "symbol": "$"
  },
  "common": {
    "search": "Search",
    "refresh": "Refresh",
    "actions": "Actions",
    "cancel": "Cancel",
    "close": "Close",
    "submitting": "Submitting..."
  }
}`,
      'locales/ja-JP.json': `{
  "user": {
    "management": {
      "title": "ユーザー管理システム",
      "subtitle": "プラットフォームユーザー情報の管理と維持"
    },
    "search": {
      "placeholder": "名前またはメールで検索..."
    },
    "filter": {
      "allStatus": "全てのステータス"
    },
    "actions": {
      "create": "新規ユーザー作成",
      "edit": "{name}を編集",
      "view": "{name}の詳細を表示",
      "suspend": "{name}のアカウントを停止",
      "activate": "{name}のアカウントを有効化",
      "delete": "{name}のアカウントを削除",
      "export": "データエクスポート"
    },
    "status": {
      "active": "アクティブ",
      "inactive": "非アクティブ", 
      "suspended": "停止中",
      "pending": "承認待ち"
    },
    "roles": {
      "user": "一般ユーザー",
      "premium": "プレミアムユーザー",
      "admin": "管理者",
      "super_admin": "スーパー管理者"
    },
    "fields": {
      "id": "ID",
      "name": "名前",
      "email": "メール",
      "avatar": "アバター",
      "status": "ステータス",
      "role": "役割",
      "createdAt": "作成日時",
      "lastLogin": "最終ログイン",
      "phone": "電話番号"
    },
    "stats": {
      "total": "総ユーザー数",
      "active": "アクティブユーザー",
      "newThisMonth": "今月の新規",
      "monthlyRevenue": "月間収益",
      "loginCount": "ログイン回数",
      "orderCount": "注文数",
      "totalSpent": "総支出額"
    },
    "table": {
      "title": "ユーザーリスト"
    },
    "loading": {
      "users": "ユーザーデータを読み込み中..."
    },
    "bulk": {
      "selected": "{count}人のユーザーが選択されています",
      "activate": "一括有効化",
      "suspend": "一括停止",
      "export": "選択項目をエクスポート",
      "delete": "一括削除"
    },
    "form": {
      "createTitle": "新規ユーザー作成",
      "editTitle": "ユーザー情報編集", 
      "name": "名前",
      "namePlaceholder": "ユーザー名を入力",
      "email": "メールアドレス",
      "emailPlaceholder": "メールアドレスを入力",
      "phone": "電話番号",
      "phonePlaceholder": "電話番号を入力",
      "role": "ユーザー役割",
      "status": "アカウントステータス",
      "bio": "自己紹介",
      "bioPlaceholder": "自己紹介を入力（任意）",
      "create": "ユーザー作成",
      "save": "変更を保存"
    },
    "details": {
      "title": "{name}の詳細情報",
      "changeAvatar": "アバター変更",
      "basicInfo": "基本情報",
      "accountStatus": "アカウントステータス",
      "bio": "自己紹介",
      "noBio": "このユーザーはまだ自己紹介を記入していません。",
      "statistics": "使用統計",
      "edit": "情報を編集"
    },
    "delete": {
      "confirmTitle": "ユーザー削除の確認",
      "warning": "ユーザー{name}を削除しようとしています。",
      "irreversible": "この操作は元に戻せません。以下を含むすべてのユーザーデータが永久に削除されます：",
      "data": {
        "profile": "ユーザー基本情報とプロフィール",
        "orders": "注文履歴と取引記録",
        "favorites": "お気に入りとカート内容",
        "comments": "コメントと評価記録"
      },
      "confirmPrompt": "削除を確認するため、ユーザー名{name}を入力してください：",
      "inputPlaceholder": "確認のため{name}を入力",
      "deleting": "削除中...",
      "confirm": "削除確認"
    },
    "avatar": {
      "alt": "{name}のアバター"
    },
    "neverLoggedIn": "ログインしたことがありません",
    "notSet": "未設定"
  },
  "pagination": {
    "showing": "{total}件中{start} - {end}件を表示",
    "first": "最初",
    "previous": "前へ",
    "next": "次へ",
    "last": "最後",
    "pageSize": "1ページあたり",
    "perPage": "{count}件"
  },
  "currency": {
    "symbol": "¥"
  },
  "common": {
    "search": "検索",
    "refresh": "更新",
    "actions": "操作",
    "cancel": "キャンセル",
    "close": "閉じる",
    "submitting": "送信中..."
  }
}`
    },
  },
  {
    id: 'react-webpack',
    title: 'React + Webpack 项目',
    description: '在传统 Webpack 构建的 React 项目中集成自动国际化插件',
    framework: 'React',
    buildTool: 'Webpack',
    difficulty: 'intermediate',
    features: ['React Hooks', 'react-i18next', 'TypeScript支持', 'Webpack配置'],
    beforeCode: `// src/components/ProductCard.tsx
import React, { useState } from 'react'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onFavorite: (id: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onFavorite 
}) => {
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await onAddToCart(product)
      alert('商品已添加到购物车')
    } catch (error) {
      alert('添加失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="price">
          {product.onSale && <span className="original-price">原价: ¥{product.originalPrice}</span>}
          <span className="current-price">¥{product.price}</span>
          {product.onSale && <span className="discount">限时优惠</span>}
        </div>
        <div className="actions">
          <button 
            onClick={handleAddToCart} 
            disabled={loading || !product.inStock}
            className="add-to-cart"
          >
            {loading ? '添加中...' : product.inStock ? '加入购物车' : '缺货'}
          </button>
          <button 
            onClick={() => onFavorite(product.id)}
            className="favorite"
            aria-label="收藏商品"
          >
            ❤️
          </button>
        </div>
        {!product.inStock && <div className="stock-notice">该商品暂时缺货</div>}
      </div>
    </div>
  )
}

export default ProductCard`,
    afterCode: `// src/components/ProductCard.tsx  
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onFavorite: (id: string) => void
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart, 
  onFavorite 
}) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async () => {
    setLoading(true)
    try {
      await onAddToCart(product)
      alert(t('product.addedToCart'))
    } catch (error) {
      alert(t('product.addFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>
        <div className="price">
          {product.onSale && <span className="original-price">{t('product.originalPrice')}: ¥{product.originalPrice}</span>}
          <span className="current-price">¥{product.price}</span>
          {product.onSale && <span className="discount">{t('product.saleDiscount')}</span>}
        </div>
        <div className="actions">
          <button 
            onClick={handleAddToCart} 
            disabled={loading || !product.inStock}
            className="add-to-cart"
          >
            {loading 
              ? t('product.adding') 
              : product.inStock 
                ? t('product.addToCart') 
                : t('product.outOfStock')
            }
          </button>
          <button 
            onClick={() => onFavorite(product.id)}
            className="favorite"
            aria-label={t('product.favoriteLabel')}
          >
            ❤️
          </button>
        </div>
        {!product.inStock && <div className="stock-notice">{t('product.stockNotice')}</div>}
      </div>
    </div>
  )
}

export default ProductCard`,
    config: `// webpack.config.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { ViteAutoI18nPlugin } = require('vite-auto-i18n-plugin/webpack')
const { GoogleTranslator } = require('vite-auto-i18n-plugin')

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new ViteAutoI18nPlugin({
      scanDirs: ['src'],
      outDir: 'public/locales',
      languages: ['en-US', 'ko-KR', 'fr-FR'],
      translator: new GoogleTranslator({
        proxyOption: {
          host: '127.0.0.1',
          port: 7890
        }
      }),
      // React-i18next 集成
      reactI18nextIntegration: {
        enabled: true,
        namespaceSeparator: '.',
        keySeparator: '.'
      },
      // TypeScript 支持
      typescript: true
    })
  ]
}`,
    generatedFiles: {
      'public/locales/zh-CN.json': `{
  "product": {
    "addedToCart": "商品已添加到购物车",
    "addFailed": "添加失败，请重试",
    "originalPrice": "原价",
    "saleDiscount": "限时优惠",
    "adding": "添加中...",
    "addToCart": "加入购物车",
    "outOfStock": "缺货",
    "favoriteLabel": "收藏商品",
    "stockNotice": "该商品暂时缺货"
  }
}`,
      'public/locales/en-US.json': `{
  "product": {
    "addedToCart": "Product added to cart",
    "addFailed": "Failed to add, please try again",
    "originalPrice": "Original Price",
    "saleDiscount": "Limited Time Offer", 
    "adding": "Adding...",
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock",
    "favoriteLabel": "Favorite Product",
    "stockNotice": "This product is temporarily out of stock"
  }
}`
    }
  },
  {
    id: 'nuxt3',
    title: 'Nuxt 3 全栈项目',
    description: '在 Nuxt 3 全栈应用中实现服务端渲染 (SSR) 的国际化方案',
    framework: 'Nuxt',
    buildTool: 'Nuxt',
    difficulty: 'advanced',
    features: ['SSR支持', 'Nuxt-i18n', '动态路由', 'SEO优化'],
    beforeCode: `<!-- pages/blog/[slug].vue -->
<template>
  <div class="blog-post">
    <article v-if="post" class="article">
      <header class="article-header">
        <h1>{{ post.title }}</h1>
        <div class="article-meta">
          <time :datetime="post.publishedAt">
            发布于 {{ formatDate(post.publishedAt) }}
          </time>
          <span class="author">作者：{{ post.author.name }}</span>
          <span class="reading-time">预计阅读时间：{{ post.readingTime }}分钟</span>
        </div>
        <div class="tags">
          <span 
            v-for="tag in post.tags" 
            :key="tag.id"
            class="tag"
          >
            {{ tag.name }}
          </span>
        </div>
      </header>
      
      <div class="article-content" v-html="post.content"></div>
      
      <footer class="article-footer">
        <div class="share-section">
          <h3>分享文章</h3>
          <div class="share-buttons">
            <button @click="shareToWechat">微信分享</button>
            <button @click="shareToWeibo">微博分享</button>
            <button @click="copyLink">复制链接</button>
          </div>
        </div>
        
        <div class="comments-section">
          <h3>评论 ({{ post.commentCount }})</h3>
          <CommentForm @submit="handleComment" />
          <CommentList :comments="comments" />
        </div>
      </footer>
    </article>
    
    <div v-else class="loading">
      正在加载文章...
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const { data: post } = await $fetch(\`/api/posts/\${route.params.slug}\`)
const { data: comments } = await $fetch(\`/api/posts/\${route.params.slug}/comments\`)

// SEO Meta
useHead({
  title: post?.title || '文章详情',
  meta: [
    { name: 'description', content: post?.excerpt || '查看这篇精彩的文章' },
    { property: 'og:title', content: post?.title },
    { property: 'og:description', content: post?.excerpt },
    { property: 'og:image', content: post?.coverImage }
  ]
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

const shareToWechat = () => {
  // 微信分享逻辑
  alert('请在微信中打开分享')
}

const shareToWeibo = () => {
  // 微博分享逻辑
  const url = window.location.href
  window.open(\`https://service.weibo.com/share/share.php?url=\${url}\`)
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert('链接已复制到剪贴板')
  } catch (err) {
    alert('复制失败，请手动复制')
  }
}

const handleComment = (comment) => {
  // 处理评论提交
  console.log('新评论:', comment)
}
</script>`,
    afterCode: `<!-- pages/blog/[slug].vue -->
<template>
  <div class="blog-post">
    <article v-if="post" class="article">
      <header class="article-header">
        <h1>{{ post.title }}</h1>
        <div class="article-meta">
          <time :datetime="post.publishedAt">
            {{ t('blog.publishedAt') }} {{ formatDate(post.publishedAt) }}
          </time>
          <span class="author">{{ t('blog.author') }}：{{ post.author.name }}</span>
          <span class="reading-time">{{ t('blog.readingTime', { time: post.readingTime }) }}</span>
        </div>
        <div class="tags">
          <span 
            v-for="tag in post.tags" 
            :key="tag.id"
            class="tag"
          >
            {{ tag.name }}
          </span>
        </div>
      </header>
      
      <div class="article-content" v-html="post.content"></div>
      
      <footer class="article-footer">
        <div class="share-section">
          <h3>{{ t('blog.shareTitle') }}</h3>
          <div class="share-buttons">
            <button @click="shareToWechat">{{ t('blog.shareWechat') }}</button>
            <button @click="shareToWeibo">{{ t('blog.shareWeibo') }}</button>
            <button @click="copyLink">{{ t('blog.copyLink') }}</button>
          </div>
        </div>
        
        <div class="comments-section">
          <h3>{{ t('blog.comments', { count: post.commentCount }) }}</h3>
          <CommentForm @submit="handleComment" />
          <CommentList :comments="comments" />
        </div>
      </footer>
    </article>
    
    <div v-else class="loading">
      {{ t('blog.loading') }}
    </div>
  </div>
</template>

<script setup>
const { t, locale } = useI18n()
const route = useRoute()

const { data: post } = await $fetch(\`/api/posts/\${route.params.slug}\`)
const { data: comments } = await $fetch(\`/api/posts/\${route.params.slug}/comments\`)

// SEO Meta with i18n
useHead({
  title: post?.title || t('blog.defaultTitle'),
  meta: [
    { name: 'description', content: post?.excerpt || t('blog.defaultDescription') },
    { property: 'og:title', content: post?.title },
    { property: 'og:description', content: post?.excerpt },
    { property: 'og:image', content: post?.coverImage },
    { property: 'og:locale', content: locale.value }
  ]
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'long', 
    day: 'numeric'
  })
}

const shareToWechat = () => {
  alert(t('blog.wechatShareTip'))
}

const shareToWeibo = () => {
  const url = window.location.href
  window.open(\`https://service.weibo.com/share/share.php?url=\${url}\`)
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href)
    alert(t('blog.linkCopied'))
  } catch (err) {
    alert(t('blog.copyFailed'))
  }
}

const handleComment = (comment) => {
  console.log(t('blog.newComment'), comment)
}
</script>`,
    config: `// nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/i18n',
    'vite-auto-i18n-plugin/nuxt'
  ],
  
  // Nuxt i18n 配置
  i18n: {
    locales: [
      { code: 'zh-CN', name: '中文' },
      { code: 'en-US', name: 'English' },
      { code: 'ja-JP', name: '日本語' }
    ],
    defaultLocale: 'zh-CN',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root'
    }
  },
  
  // Auto i18n Plugin 配置  
  autoI18n: {
    scanDirs: ['pages', 'components', 'layouts'],
    outDir: 'locales',
    languages: ['en-US', 'ja-JP'],
    translator: new BaiduTranslator({
      appId: process.env.NUXT_BAIDU_APP_ID,
      appKey: process.env.NUXT_BAIDU_APP_KEY
    }),
    // Nuxt SSR 优化
    ssr: {
      enabled: true,
      generateAtBuild: true
    },
    // SEO 优化
    seo: {
      enabled: true,
      alternateLinks: true
    }
  }
})`,
    generatedFiles: {
      'locales/zh-CN.json': `{
  "blog": {
    "publishedAt": "发布于",
    "author": "作者",
    "readingTime": "预计阅读时间：{time}分钟",
    "shareTitle": "分享文章",
    "shareWechat": "微信分享",
    "shareWeibo": "微博分享", 
    "copyLink": "复制链接",
    "comments": "评论 ({count})",
    "loading": "正在加载文章...",
    "defaultTitle": "文章详情",
    "defaultDescription": "查看这篇精彩的文章",
    "wechatShareTip": "请在微信中打开分享",
    "linkCopied": "链接已复制到剪贴板",
    "copyFailed": "复制失败，请手动复制",
    "newComment": "新评论:"
  }
}`
    }
  }
]

export const frameworkGuides = [
  {
    framework: 'Vue 3',
    icon: '💚',
    description: '现代化的 Vue 3 项目集成指南',
    steps: [
      {
        title: '安装插件',
        command: 'npm install vite-auto-i18n-plugin vue-i18n@9 --save-dev',
        description: '安装国际化插件和 Vue-i18n'
      },
      {
        title: '配置 Vite',
        code: `import vitePluginsAutoI18n from 'vite-auto-i18n-plugin'

export default defineConfig({
  plugins: [
    vue(),
    vitePluginsAutoI18n({
      scanDirs: ['src'],
      outDir: 'locales',
      languages: ['en-US', 'ja-JP']
    })
  ]
})`,
        description: '在 vite.config.js 中添加插件配置'
      },
      {
        title: '初始化 Vue-i18n',
        code: `import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import zhCN from '../locales/zh-CN.json'

const i18n = createI18n({
  locale: 'zh-CN',
  messages: { 'zh-CN': zhCN }
})

app.use(i18n)`,
        description: '在 main.js 中设置 i18n 实例'
      }
    ]
  },
  {
    framework: 'React',
    icon: '⚛️',
    description: 'React 项目的国际化最佳实践',
    steps: [
      {
        title: '安装依赖',
        command: 'npm install vite-auto-i18n-plugin react-i18next i18next --save-dev',
        description: '安装必要的国际化依赖包'
      },
      {
        title: '配置构建工具',
        code: `const { ViteAutoI18nPlugin } = require('vite-auto-i18n-plugin/webpack')

module.exports = {
  plugins: [
    new ViteAutoI18nPlugin({
      scanDirs: ['src'],
      reactI18nextIntegration: { enabled: true }
    })
  ]
}`,
        description: 'Webpack 或 Vite 配置'
      },
      {
        title: '初始化 i18next',
        code: `import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zhCN from '../locales/zh-CN.json'

i18n.use(initReactI18next).init({
  lng: 'zh-CN',
  resources: { 'zh-CN': { translation: zhCN } }
})`,
        description: '配置 React-i18next'
      }
    ]
  },
  {
    framework: 'Nuxt 3',
    icon: '💚',
    description: 'Nuxt 3 全栈应用国际化方案',
    steps: [
      {
        title: '安装模块',
        command: 'npm install @nuxtjs/i18n vite-auto-i18n-plugin/nuxt --save-dev',
        description: '安装 Nuxt i18n 模块和自动化插件'
      },
      {
        title: '配置 nuxt.config.ts',
        code: `export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n', 'vite-auto-i18n-plugin/nuxt'],
  i18n: {
    locales: ['zh-CN', 'en-US'],
    defaultLocale: 'zh-CN'
  },
  autoI18n: {
    ssr: { enabled: true }
  }
})`,
        description: '配置 Nuxt 模块和 SSR 支持'
      }
    ]
  },
  {
    framework: 'Angular',
    icon: '🅰️',
    description: 'Angular 项目的国际化配置',
    steps: [
      {
        title: '安装 Angular i18n',
        command: 'ng add @angular/localize',
        description: '添加 Angular 官方国际化支持'
      },
      {
        title: '配置 webpack.config.js',
        code: `const { ViteAutoI18nPlugin } = require('vite-auto-i18n-plugin/webpack')

module.exports = {
  plugins: [
    new ViteAutoI18nPlugin({
      angularIntegration: { enabled: true },
      outDir: 'src/locale'
    })
  ]
}`,
        description: '集成自动翻译插件'
      }
    ]
  }
]

export const bestPractices = [
  {
    title: '🎯 合理的命名空间设计',
    description: '使用层次化的key结构提高维护性',
    example: {
      good: `{
  "user": {
    "profile": {
      "title": "用户资料",
      "form": {
        "name": "姓名",
        "email": "邮箱"
      }
    }
  }
}`,
      bad: `{
  "userProfileTitle": "用户资料",
  "userFormName": "姓名",
  "userFormEmail": "邮箱"
}`
    }
  },
  {
    title: '📝 支持参数化翻译',
    description: '使用插值语法处理动态内容',
    example: {
      good: `// 翻译文件
{
  "welcome": "欢迎 {{name}}，你有 {{count}} 条新消息"
}

// 使用
t('welcome', { name: '张三', count: 5 })`,
      bad: `// 硬编码拼接
"欢迎" + name + "，你有" + count + "条新消息"`
    }
  },
  {
    title: '🔄 处理复数形式',
    description: '不同语言的复数规则差异很大',
    example: {
      good: `{
  "itemCount": {
    "zero": "没有商品",
    "one": "1个商品", 
    "other": "{{count}}个商品"
  }
}`,
      bad: `{
  "itemCount": "{{count}}个商品"
}`
    }
  },
  {
    title: '🌐 考虑文化差异',
    description: '不仅是语言翻译，还要考虑文化适应',
    example: {
      good: `// 日期格式适应
const formatDate = (date) => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: locale === 'en-US' ? 'short' : 'long',
    day: 'numeric'
  })
}`,
      bad: `// 固定中文格式
const formatDate = (date) => {
  return date.replace(/-/g, '年').replace('年', '年') + '日'
}`
    }
  },
  {
    title: '⚡ 性能优化策略',
    description: '合理的翻译文件加载和缓存策略',
    example: {
      good: `// 按需加载
const loadLocale = async (locale) => {
  const messages = await import(\`../locales/\${locale}.json\`)
  i18n.setLocaleMessage(locale, messages.default)
}`,
      bad: `// 一次性加载所有语言
import zhCN from '../locales/zh-CN.json'
import enUS from '../locales/en-US.json'
import jaJP from '../locales/ja-JP.json'
// ... 更多语言`
    }
  }
]

export default {
  exampleProjects,
  frameworkGuides,
  bestPractices
}