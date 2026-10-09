import axios from 'axios';

// Hàm để lấy token (giả sử bạn có một API để lấy token)
const getAuthToken = async () => {
    try {
        const response = await axios.post('http://127.0.0.1:9000/get-token/', {
            username: 'admin@medusa-test.com',
            password: 'supersecret',
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching auth token:', error);
        throw error;
    }
};

// Thiết lập Axios Interceptor để thêm token vào tất cả các yêu cầu
const setupAxiosInterceptors = (token) => {
    axios.interceptors.request.use(
        (config) => {
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

// Hàm khởi tạo xác thực
const initializeAuth = async () => {
    try {
        const token = await getAuthToken();
        setupAxiosInterceptors(token);
        console.log('Axios interceptors set up successfully');
    } catch (error) {
        console.error('Error initializing authentication:', error);
    }
};

export default initializeAuth;
