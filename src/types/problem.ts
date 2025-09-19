
export interface TestCaseResult {
    testCaseId: string;
    input: string;
    expectedOutput: string;
    actualOutput: string;
    status: 'passed' | 'failed' | 'error';
    executionTime: number;
    memoryUsage: number;
    judge0Token: string;
    errorMessage: string | null;
}

export interface RunCodeResponse {
    verdict: string;
    status: string;
    score: number;
    totalTime: number;
    maxMemory: number;
    testCaseResults: TestCaseResult[];
    totalTestCases: number;
    passedTestCases: number;
    failedTestCases: number;
}

export interface SubmissionResponse {
    id: string;
    language: {
        id: number;
        name: string;
    };
    overallVerdict: string;
    problemId: string;
    score: number;
    status: string;
    submittedAt: string;
    testCaseResults: TestCaseResult[];
    testCasesPassed: number;
    totalExecutionTime: number;
    totalTestCases: number;
    userId: string;
}

export interface Parameter {
    name: string;
    type: string;
    description?: string;
    _id?: string;
}

export interface Constraint {
    parameterName: string;
    type: string;
    minValue?: number;
    maxValue?: number;
    minLength?: number;
    maxLength?: number;
    _id?: string;
}

export interface Example {
    input: string;
    output: any;
    explanation?: string;
    isSample: boolean;
}

export interface SampleTestCase {
    problemId: string;
    inputs: Record<string, any>;
    expectedOutput: any;
    isSample: boolean;
    id: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProblemData {
    problemNumber: number;
    title: string;
    slug: string;
    difficulty: string;
    tags: string[];
    description: string;
    constraints: Constraint[];
    examples: Example[];
    likes: string[];
    totalSubmissions: number;
    acceptedSubmissions: number;
    hints: string[];
    companies: string[];
    isActive: boolean;
    createdBy: string;
    functionName: string;
    returnType: string;
    parameters: Parameter[];
    id: string;
    createdAt: string;
    updatedAt: string;
    supportedLanguages: number[];
    templates: Record<string, {
        templateCode: string;
        userFunctionSignature: string;
        placeholder: string;
        _id?: string;
    }>;
}

export interface ApiResponse {
    success: boolean;
    message: string;
    data: {
        problem: ProblemData;
        sampleTestCases: SampleTestCase[];
    };
}