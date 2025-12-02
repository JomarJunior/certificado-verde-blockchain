import { httpClient } from "./http-client";

const BASE_PATH = '/health';

export interface HealthStatus {
    status: 'healthy' | 'unhealthy';
}

export const healthApi = {
    checkHealth: async (): Promise<HealthStatus> => {
        const response = await httpClient.get<HealthStatus>(`${BASE_PATH}`);
        return response.data;
    }
};
