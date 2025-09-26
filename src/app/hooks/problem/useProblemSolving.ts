

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ProblemData, SampleTestCase, RunCodeResponse, SubmissionResponse, TestCaseResult } from '../../../types/problem';
import { fetchProblemDetail, runCodeApi, submitCodeApi } from '../../../services/axios/auth/problem';

const languageMap: Record<number, { value: string; label: string }> = {

    50: { value: 'c', label: 'C' },
    51: { value: 'csharp', label: 'C#' },
    54: { value: 'cpp', label: 'C++' },
    60: { value: 'go', label: 'Go' },
    62: { value: 'java', label: 'Java' },
    63: { value: 'javascript', label: 'JavaScript' },
    68: { value: 'php', label: 'PHP' },
    71: { value: 'python', label: 'Python' },
    72: { value: 'ruby', label: 'Ruby' },
    73: { value: 'rust', label: 'Rust' },
    74: { value: 'typescript', label: 'TypeScript' },
    78: { value: 'kotlin', label: 'Kotlin' },
    83: { value: 'swift', label: 'Swift' },
};

export const useProblemSolving = () => {

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [problemData, setProblemData] = useState<ProblemData | null>(null);
    const [sampleTestCases, setSampleTestCases] = useState<SampleTestCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [runCodeResults, setRunCodeResults] = useState<RunCodeResponse | null>(null);
    const [submissionResults, setSubmissionResults] = useState<SubmissionResponse | null>(null);
    const [activeTab, setActiveTab] = useState('testcase');
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [languages, setLanguages] = useState<{ value: string; label: string }[]>([]);

    const editorRef = useRef<any>(null);
    const { slug } = useParams();


    const getLanguageId = (language: string): number | undefined => {
        switch (language.toLowerCase()) {
            case "c": return 50;
            case "cpp": case "c++": return 54;
            case "java": return 62;
            case "javascript": case "js": return 63;
            case "python": case "py": return 71;
            case "typescript": case "ts": return 74;
            case "csharp": case "c#": return 51;
            case "go": return 60;
            case "ruby": return 72;
            case "swift": return 83;
            case "kotlin": return 78;
            case "php": return 68;
            case "rust": return 73;
            default: return undefined;
        }
    };

    const handleEditorDidMount = (editor: any) => {
        editorRef.current = editor;
    };

    const handleLanguageChange = (newLanguage: string) => {
        setSelectedLanguage(newLanguage);
        if (problemData) {
            const langId = getLanguageId(newLanguage);
            const template = problemData.templates[langId!.toString()];
            if (template) {
                setCode(template.userFunctionSignature);
            }
        }
    };

    const runCode = async () => {
        if (!problemData) return;
        setIsRunning(true);
        setActiveTab('result');
        setRunCodeResults(null);
        try {
            const testCaseIds = sampleTestCases.map(tc => tc.id);
            const results = await runCodeApi(problemData.id, code, getLanguageId(selectedLanguage), testCaseIds);
            setRunCodeResults(results);
            toast.success(`${results.passedTestCases}/${results.totalTestCases} test cases passed`);
        } catch (err) {
            // Error already toasted in API
        } finally {
            setIsRunning(false);
        }
    };

    const submitCode = async () => {
        if (!problemData) return;
        setIsSubmitting(true);
        setSubmissionResults(null);
        try {
            const results = await submitCodeApi(problemData.id, code, getLanguageId(selectedLanguage));
            setSubmissionResults(results);
            if (results.overallVerdict === 'Accepted') {
                toast.success(`✅ Accepted! ${results.testCasesPassed}/${results.totalTestCases} test cases passed`);
            } else {
                toast.error(`❌ ${results.overallVerdict} - ${results.testCasesPassed}/${results.totalTestCases} test cases passed`);
            }
            setActiveTab('result');
        } catch (err) {
            // Error already toasted in API
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetCode = () => {
        if (problemData) {
            const langId = getLanguageId(selectedLanguage);
            const template = problemData.templates[langId!.toString()];
            if (template) {
                setCode(template.userFunctionSignature)
            }
        }
    };

    const getTestCaseStatus = (testCaseId: string): 'passed' | 'failed' | 'neutral' => {
        if (!runCodeResults) return 'neutral';
        const result = runCodeResults.testCaseResults.find(r => r.testCaseId === testCaseId);
        return result ? result.status === 'passed' ? 'passed' : 'failed' : 'neutral';
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (!slug) throw new Error('No slug provided');
                const data = await fetchProblemDetail(slug);
                setProblemData(data.problem);
                setSampleTestCases(data.sampleTestCases || []);
                const supported = data.problem.supportedLanguages;
                const availLanguages = supported
                    .map(id => languageMap[id])
                    .filter((l): l is { value: string; label: string } => l !== undefined);
                setLanguages(availLanguages);
                if (availLanguages.length > 0) {
                    const firstLang = availLanguages[0].value;
                    setSelectedLanguage(firstLang);
                    const langId = getLanguageId(firstLang);
                    const template = data.problem.templates[langId!.toString()];
                    if (template) {
                        setCode(template.userFunctionSignature)
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch problem data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    return {
        selectedLanguage,
        code,
        setCode,
        problemData,
        sampleTestCases,
        loading,
        error,
        runCodeResults,
        submissionResults,
        activeTab,
        setActiveTab,
        activeTestCase,
        setActiveTestCase,
        isRunning,
        isSubmitting,
        showHints,
        setShowHints,
        languages,
        editorRef,
        handleEditorDidMount,
        handleLanguageChange,
        runCode,
        submitCode,
        resetCode,
        getTestCaseStatus,
    };
};