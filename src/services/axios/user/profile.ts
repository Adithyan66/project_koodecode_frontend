import httpClient from '../httpClient';
import type { ApiUserProfileResponse } from '../../../types/profile';

export const profileService = {
  async getUserProfile(): Promise<ApiUserProfileResponse> {
    const response = await httpClient.get<ApiUserProfileResponse>('/user');
    return response.data;
  },
};

