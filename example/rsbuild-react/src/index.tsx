import ReactDOM from 'react-dom/client'
import React from 'react'
import '../lang/index.js' // 📍 必须在第一行引入语言配置文件
import App from './App'

const rootEl = document.getElementById('root')
if (rootEl) {
    const root = ReactDOM.createRoot(rootEl)
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    )
}
