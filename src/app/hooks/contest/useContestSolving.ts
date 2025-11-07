
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import type { ProblemData, SampleTestCase, RunCodeResponse, SubmissionResponse, ContestSubmissionData } from '../../../types/contest-problems';
import { fetchContestProblemDetail, runCodeApi, submitContestCodeApi, autoSubmitContestCodeApi } from '../../../services/axios/user/contest-problem';
import { useAppSelector } from '../../hooks';
import { getLanguageId, languageMap } from '../../../utils/problem-related';



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
    const [activeTab, setActiveTab] = useState<'testcase' | 'result'>('testcase');
    const [activeTestCase, setActiveTestCase] = useState(1);
    const [isRunning, setIsRunning] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showHints, setShowHints] = useState(false);
    const [languages, setLanguages] = useState<{ value: string; label: string }[]>([]);
    const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
    const [showSubmissionModal, setShowSubmissionModal] = useState(false);
    const [showAutoSubmitModal, setShowAutoSubmitModal] = useState(false);

    const editorRef = useRef<any>(null);
    const { contestNumber } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const userId = useAppSelector(store=>store.user.user?.id);

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
        } catch (err) {
            // Error already toasted in API
        } finally {
            setIsRunning(false);
        }
    };


    const submitCode = useCallback(async (autoSubmit = false) => {
        if (!problemData || !contestNumber) return;
        setIsSubmitting(true);
        setSubmissionResults(null);
        setContestSubmissionData(null);
        
        if (autoSubmit) {
            await autoSubmitContestCodeApi(contestNumber, code, getLanguageId(selectedLanguage), userId);
            setShowAutoSubmitModal(true);
            setIsSubmitting(false);
            return;
        }
        
        try {
            const results = await submitContestCodeApi(
                contestNumber,
                code,
                getLanguageId(selectedLanguage),
                false 
            );
            setSubmissionResults(results.result);
            setContestSubmissionData(results);
            setShowSubmissionModal(true);
            setActiveTab('result');
        } catch (err) {
            // Error already toasted in API
        } finally {
            setIsSubmitting(false);
        }
    }, [problemData, contestNumber, code, selectedLanguage, userId]);

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

    const handleCloseAutoSubmitModal = useCallback(() => {
        setShowAutoSubmitModal(false);
        if (contestNumber) {
            navigate(`/contest/${contestNumber}`, { replace: true });
        } else {
            navigate('/', { replace: true });
        }
    }, [contestNumber, navigate]);

    // Entry guard: only allow if navigated via Enter button
    useEffect(() => {
        const fromEnter = (location.state as any)?.fromEnter === true;
        let sessionAllowed = false;
        try {
            sessionAllowed = window.sessionStorage.getItem(`contest:${contestNumber}:entered`) === '1';
        } catch {
            // Ignore sessionStorage errors
        }
        if (!fromEnter && !sessionAllowed) {
            // Replace history to prevent back navigation into this page
            if (contestNumber) {
                navigate(`/contest/${contestNumber}`, { replace: true });
            } else {
                navigate('/', { replace: true });
            }
        }
    }, [location.state, contestNumber, navigate]);

    // Handle visibility change for auto-submit
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                submitCode(true);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [submitCode]);

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
        showAutoSubmitModal,
        handleCloseAutoSubmitModal,
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