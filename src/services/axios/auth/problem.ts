

import httpClient from '../httpClient';
import { toast } from 'react-toastify';
import type { ApiResponse, RunCodeResponse, SubmissionResponse } from '../../../types/problem';

export const fetchProblemDetail = async (slug: string): Promise<ApiResponse['data']> => {
    try {
        const response = await httpClient.get(`user/problems/${slug}/detail`);
        if (!response.data.success) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.data.data;
    } catch (err: any) {
        toast.error('Failed to fetch problem data: ' + (err.response?.data?.message || err.message));
        throw err;
    }
};

export const runCodeApi = async (problemId: string, sourceCode: string, languageId: number | undefined, testCaseIds: string[]): Promise<RunCodeResponse> => {
    try {
        const response = await httpClient.post(`user/problems/test-case`, {
            problemId,
            sourceCode,
            languageId,
            testCases: testCaseIds
        });
        if (!response.data.success) {
            throw new Error('Failed to run code');
        }
        return response.data.data;
    } catch (err: any) {
        toast.error('Error running code: ' + (err.response?.data?.message || err.message));
        throw err;
    }
};

export const submitCodeApi = async (problemId: string, sourceCode: string, languageId: number | undefined): Promise<SubmissionResponse> => {
    try {
        const response = await httpClient.post(`user/problems/submit`, {
            problemId,
            sourceCode,
            languageId
        });
        if (!response.data.success) {
            throw new Error('Submission failed');
        }
        return response.data.data;
    } catch (err: any) {
        toast.error('Submission error: ' + (err.response?.data?.message || err.message));
        throw err;
    }
};