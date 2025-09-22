
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import type { ProblemData, SampleTestCase, RunCodeResponse, SubmissionResponse, ContestSubmissionData } from '../../../types/contest-problems';
import { fetchContestProblemDetail, runCodeApi, submitContestCodeApi } from '../../../services/axios/user/contest-problem';

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
    85: { value: 'dart', label: 'Dart' },
};


export const useContestSolving = () => {

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [code, setCode] = useState('');
    const [problemData, setProblemData] = useState<ProblemData | null>(null);
    const [sampleTestCases, setSampleTestCases] = useState<SampleTestCase[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [runCodeResults, setRunCodeResults] = useState<RunCodeResponse | null>(null);
    const [submissionResults, setSubmissionResults] = useState<SubmissionResponse | null>(null);
    const [contestSubmissionData, setContestSubmissionData] = useState<ContestSubmissionData | null>(null);
    const [activeTab, setActiveTab] = useState('testcase');
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [languages, setLanguages] = useState<{ value: string; label: string }[]>([]);
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);

    const editorRef = useRef<any>(null);
    const { contestNumber } = useParams();
    const navigate = useNavigate();

    const getFunctionSeparator = (language: string): string => {
        switch (language) {
            case 'python':
                return ':';
            default:
                return '';
        }
    };

    const getDefaultBody = (language: string, returnType: string): string => {
        switch (language) {
            case 'python':
                return '        pass';
            case 'c':
                return returnType.includes('*') ? ' {\n    // Your code here\n    return NULL;\n}' : ' {\n    // Your code here\n    return 0;\n}';
            default:
                return ' {\n    // Your code here\n}';
        }
    };

    const getLanguageId = (language: string): number | undefined => {
        switch (language.toLowerCase()) {
            case 'c': return 50;
            case 'cpp': case 'c++': return 54;
            case 'java': return 62;
            case 'javascript': case 'js': return 63;
            case 'python': case 'py': return 71;
            case 'typescript': case 'ts': return 74;
            case 'csharp': case 'c#': return 51;
            case 'go': return 60;
            case 'ruby': return 72;
            case 'swift': return 83;
            case 'kotlin': return 78;
            case 'php': return 68;
            case 'rust': return 73;
            case 'dart': return 85;
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
                const separator = getFunctionSeparator(newLanguage);
                const defaultBody = getDefaultBody(newLanguage, problemData.returnType);
                const userCode = `${template.userFunctionSignature}${separator}\n${defaultBody}`;
                setCode(template.userFunctionSignature.replace(template.placeholder, userCode));
            }
        }
    };

    const handleTimeUp = () => {
        console.log('Time is up! Auto-submitting solution...');
        if (problemData) {
            submitCode();
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
        if (!problemData || !contestNumber) return;
        setIsSubmitting(true);
        setSubmissionResults(null);
        setContestSubmissionData(null);
        try {
            const results = await submitContestCodeApi(contestNumber, code, getLanguageId(selectedLanguage));
            setSubmissionResults(results.result);
            setContestSubmissionData(results);
            setShowSubmissionModal(true);
            if (results.result.overallVerdict === 'Accepted') {
                toast.success(`✅ Accepted! ${results.result.testCasesPassed}/${results.result.totalTestCases} test cases passed`);
            } else {
                toast.error(`❌ ${results.result.overallVerdict} - ${results.result.testCasesPassed}/${results.result.totalTestCases} test cases passed`);
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
                const separator = getFunctionSeparator(selectedLanguage);
                const defaultBody = getDefaultBody(selectedLanguage, problemData.returnType);
                const userCode = `${template.userFunctionSignature}${separator}\n${defaultBody}`;
                setCode(template.userFunctionSignature.replace(template.placeholder, userCode));
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
                if (!contestNumber) throw new Error('Invalid contest number');
                const data = await fetchContestProblemDetail(contestNumber);
                setProblemData(data.problem);
                setSampleTestCases(data.sampleTestCases || []);
                setRemainingSeconds(data.timeRemaining || null);
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
                        const separator = getFunctionSeparator(firstLang);
                        const defaultBody = getDefaultBody(firstLang, data.problem.returnType);
                        const userCode = `${template.userFunctionSignature}${separator}\n${defaultBody}`;
                        setCode(template.userFunctionSignature.replace(template.placeholder, userCode));
                    }
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch contest problem data');
                if (contestNumber) navigate(`/contest/${contestNumber}`);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [contestNumber, navigate]);

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
        contestSubmissionData,
        activeTab,
        setActiveTab,
        activeTestCase,
        setActiveTestCase,
        isRunning,
        isSubmitting,
        showHints,
        setShowHints,
        languages,
        remainingSeconds,
        showSubmissionModal,
        setShowSubmissionModal,
        editorRef,
        handleEditorDidMount,
        handleLanguageChange,
        runCode,
        submitCode,
        resetCode,
        getTestCaseStatus,
        handleTimeUp,
    };
};