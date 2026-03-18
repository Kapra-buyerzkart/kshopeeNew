// src/api/apiClient.ts
import axios from 'axios';
import Config from "react-native-config";

const BASE_URL = Config.API_URL; // Example for local development //'https://dummy.restapiexample.com/api/v1'
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
