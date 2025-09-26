import type { Constraint } from "../types/problem";

export const getLanguageId = (language: string): number | undefined => {
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


export const languageMap: Record<number, { value: string; label: string }> = {

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



export const formatConstraints = (constraints: Constraint[]): string[] => {
    return constraints.map(constraint => {
        let formatted = `${constraint.parameterName}: ${constraint.type}`;
        if (constraint.type === 'array') {
            if (constraint.minLength !== undefined && constraint.maxLength !== undefined) {
                formatted += ` (length: ${constraint.minLength} <= length <= ${constraint.maxLength})`;
            } else if (constraint.minLength !== undefined) {
                formatted += ` (length >= ${constraint.minLength})`;
            } else if (constraint.maxLength !== undefined) {
                formatted += ` (length <= ${constraint.maxLength})`;
            }
        } else {
            if (constraint.minValue !== undefined && constraint.maxValue !== undefined) {
                formatted += ` (${constraint.minValue} <= value <= ${constraint.maxValue})`;
            } else if (constraint.minValue !== undefined) {
                formatted += ` (>= ${constraint.minValue})`;
            } else if (constraint.maxValue !== undefined) {
                formatted += ` (<= ${constraint.maxValue})`;
            }
        }
        return formatted;
    });
};
