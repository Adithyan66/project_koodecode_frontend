import type { Constraint } from "../types/problem";


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
