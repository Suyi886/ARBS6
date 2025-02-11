export const config = {
    apiBaseUrl: process.env.VUE_APP_API_BASE_URL || 'http://localhost:3000/api',
    wsUrl: process.env.VUE_APP_WS_URL || 'ws://localhost:3000',
    uploadUrl: process.env.VUE_APP_UPLOAD_URL || 'http://localhost:3000/api/upload'
}; 