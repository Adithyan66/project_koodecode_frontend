import httpClient from '../httpClient';
import type {
    SubmissionDetailResponse,
    SubmissionHistoryResponse,
} from '../../../types/problem';

export interface SubmissionListParams {
    page?: number;
    limit?: number;
}

export class ProblemSubmissionService {
    private static readonly BASE_URL = 'user/problems';

    static async getSubmissions(
        problemId: string,
        params: SubmissionListParams = {}
    ): Promise<SubmissionHistoryResponse> {
        try {
            const response = await httpClient.get(
                `${this.BASE_URL}/${problemId}/submissions`,
                { params }
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch problem submissions:', error);
            throw error;
        }
    }

    static async getSubmissionDetail(
        problemId: string,
        submissionId: string
    ): Promise<SubmissionDetailResponse> {
        try {
            const response = await httpClient.get(
                `${this.BASE_URL}/${problemId}/submissions/${submissionId}`
            );
            return response.data;
        } catch (error) {
            console.error('Failed to fetch submission detail:', error);
            throw error;
        }
    }
}

