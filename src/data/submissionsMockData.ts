import type { SubmissionResponse } from '../types/problem';

export const mockSubmissionsHistory: SubmissionResponse[] = [
    {
        id: 'sub_001',
        language: {
            id: 63,
            name: 'JavaScript'
        },
        overallVerdict: 'Accepted',
        problemId: 'prob_123',
        score: 100,
        status: 'completed',
        submittedAt: '2025-10-29T20:28:00Z',
        testCasesPassed: 3,
        totalExecutionTime: 99,
        totalTestCases: 3,
        userId: 'user_123',
        code: `function twoSum(nums, target) {
    const map = new Map();
    
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        
        map.set(nums[i], i);
    }
    
    return [];
}`,
        runtimeDistribution: {
            data: [
                { runtime: 16, percentage: 2 },
                { runtime: 32, percentage: 5 },
                { runtime: 48, percentage: 8 },
                { runtime: 63, percentage: 12 },
                { runtime: 79, percentage: 18 },
                { runtime: 95, percentage: 40 },
                { runtime: 111, percentage: 10 },
                { runtime: 127, percentage: 5 }
            ],
            userRuntime: 99,
            beats: 80.91
        },
        memoryDistribution: {
            data: [
                { memory: 7.5, percentage: 3 },
                { memory: 8.0, percentage: 10 },
                { memory: 8.5, percentage: 22 },
                { memory: 8.89, percentage: 30 },
                { memory: 9.5, percentage: 20 },
                { memory: 10.0, percentage: 12 },
                { memory: 10.5, percentage: 3 }
            ],
            userMemory: 8.89,
            beats: 22.06
        },
        maxMemoryUsage: 0
    },
    {
        id: 'sub_002',
        language: {
            id: 71,
            name: 'Python'
        },
        overallVerdict: 'Wrong Answer',
        problemId: 'prob_123',
        score: 33,
        status: 'completed',
        submittedAt: '2025-10-29T19:15:00Z',
        testCaseResults: [
            {
                testCaseId: 'tc_2',
                input: '{"nums":[3,2,4],"target":6}',
                expectedOutput: '[1,2]',
                actualOutput: '[]',
                status: 'failed',
                executionTime: 98,
                memoryUsage: 9100,
                judge0Token: 'token_5',
                errorMessage: null
            }
        ],
        testCasesPassed: 1,
        totalExecutionTime: 105,
        totalTestCases: 3,
        userId: 'user_123',
        code: `def twoSum(nums, target):
    result = []
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                result.append([i, j])
    return result[0] if result else []`,
        maxMemoryUsage: 0
    },
    {
        id: 'sub_003',
        language: {
            id: 63,
            name: 'JavaScript'
        },
        overallVerdict: 'Time Limit Exceeded',
        problemId: 'prob_123',
        score: 0,
        status: 'completed',
        submittedAt: '2025-10-29T18:45:00Z',
        testCaseResults: [
            {
                testCaseId: 'tc_2',
                input: '{"nums":[3,2,4],"target":6}',
                expectedOutput: '[1,2]',
                actualOutput: '',
                status: 'error',
                executionTime: 2000,
                memoryUsage: 9500,
                judge0Token: 'token_8',
                errorMessage: 'Time Limit Exceeded'
            }
        ],
        testCasesPassed: 1,
        totalExecutionTime: 2000,
        totalTestCases: 3,
        userId: 'user_123',
        code: `function twoSum(nums, target) {
    for (let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j];
            }
        }
    }
    return [];
}`,
        maxMemoryUsage: 0
    },
    {
        id: 'sub_004',
        language: {
            id: 54,
            name: 'C++'
        },
        overallVerdict: 'Runtime Error',
        problemId: 'prob_123',
        score: 0,
        status: 'completed',
        submittedAt: '2025-10-29T17:30:00Z',
        testCaseResults: [
            {
                testCaseId: 'tc_1',
                input: '{"nums":[2,7,11,15],"target":9}',
                expectedOutput: '[0,1]',
                actualOutput: '',
                status: 'error',
                executionTime: 45,
                memoryUsage: 7500,
                judge0Token: 'token_9',
                errorMessage: 'Segmentation fault (core dumped)\nLine 12: vector index out of range'
            }
        ],
        testCasesPassed: 0,
        totalExecutionTime: 45,
        totalTestCases: 3,
        userId: 'user_123',
        code: `#include <vector>
#include <unordered_map>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`,
        maxMemoryUsage: 0
    },
    {
        id: 'sub_005',
        language: {
            id: 71,
            name: 'Python'
        },
        overallVerdict: 'Accepted',
        problemId: 'prob_123',
        score: 100,
        status: 'completed',
        submittedAt: '2025-10-28T14:20:00Z',
        testCasesPassed: 3,
        totalExecutionTime: 120,
        totalTestCases: 3,
        userId: 'user_123',
        code: `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []`,
        runtimeDistribution: {
            data: [
                { runtime: 80, percentage: 5 },
                { runtime: 100, percentage: 15 },
                { runtime: 120, percentage: 45 },
                { runtime: 140, percentage: 20 },
                { runtime: 160, percentage: 10 },
                { runtime: 180, percentage: 5 }
            ],
            userRuntime: 120,
            beats: 65.50
        },
        memoryDistribution: {
            data: [
                { memory: 9.0, percentage: 8 },
                { memory: 10.0, percentage: 25 },
                { memory: 10.2, percentage: 35 },
                { memory: 10.5, percentage: 20 },
                { memory: 11.0, percentage: 12 }
            ],
            userMemory: 10.2,
            beats: 68.75
        },
        maxMemoryUsage: 0
    }
];

export const getMockSubmissionHistory = async (): Promise<SubmissionResponse[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockSubmissionsHistory);
        }, 300);
    });
};
