# Submission API Request/Response Samples

## API Endpoint
```
POST /user/problems/submit
```

## Request Body
```json
{
  "problemId": "prob_123",
  "sourceCode": "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}",
  "languageId": 63
}
```

---

## Success Response (Accepted)

### HTTP Status: 200 OK

```json
{
  "success": true,
  "message": "Submission evaluated successfully",
  "data": {
    "id": "sub_001",
    "language": {
      "id": 63,
      "name": "JavaScript"
    },
    "overallVerdict": "Accepted",
    "problemId": "prob_123",
    "score": 100,
    "status": "completed",
    "submittedAt": "2025-10-29T20:28:00Z",
    "testCasesPassed": 3,
    "totalExecutionTime": 99,
    "totalTestCases": 3,
    "userId": "user_123",
    "code": "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}",
    "runtimeDistribution": {
      "data": [
        { "runtime": 16, "percentage": 2 },
        { "runtime": 32, "percentage": 5 },
        { "runtime": 48, "percentage": 8 },
        { "runtime": 63, "percentage": 12 },
        { "runtime": 79, "percentage": 18 },
        { "runtime": 95, "percentage": 40 },
        { "runtime": 111, "percentage": 10 },
        { "runtime": 127, "percentage": 5 }
      ],
      "userRuntime": 99,
      "beats": 80.91
    },
    "memoryDistribution": {
      "data": [
        { "memory": 7.5, "percentage": 3 },
        { "memory": 8.0, "percentage": 10 },
        { "memory": 8.5, "percentage": 22 },
        { "memory": 8.89, "percentage": 30 },
        { "memory": 9.5, "percentage": 20 },
        { "memory": 10.0, "percentage": 12 },
        { "memory": 10.5, "percentage": 3 }
      ],
      "userMemory": 8.89,
      "beats": 22.06
    }
  }
}
```

**Note:** For accepted submissions:
- `testCaseResults` is not included
- `code` contains the submitted source code
- `runtimeDistribution` and `memoryDistribution` contain performance graph data

---

## Failure Response (Wrong Answer)

### HTTP Status: 200 OK

```json
{
  "success": true,
  "message": "Submission evaluated successfully",
  "data": {
    "id": "sub_002",
    "language": {
      "id": 71,
      "name": "Python"
    },
    "overallVerdict": "Wrong Answer",
    "problemId": "prob_123",
    "score": 33,
    "status": "completed",
    "submittedAt": "2025-10-29T19:15:00Z",
    "testCaseResults": [
      {
        "testCaseId": "tc_2",
        "input": "{\"nums\":[3,2,4],\"target\":6}",
        "expectedOutput": "[1,2]",
        "actualOutput": "[]",
        "status": "failed",
        "executionTime": 98,
        "memoryUsage": 9100,
        "judge0Token": "token_xyz222",
        "errorMessage": null
      }
    ],
    "testCasesPassed": 1,
    "totalExecutionTime": 105,
    "totalTestCases": 3,
    "userId": "user_123",
    "code": "def twoSum(nums, target):\n    result = []\n    for i in range(len(nums)):\n        for j in range(i + 1, len(nums)):\n            if nums[i] + nums[j] == target:\n                result.append([i, j])\n    return result[0] if result else []"
  }
}
```

**Note:** For failed submissions:
- `testCaseResults` contains only the **first failed test case**
- `code` contains the submitted source code
- `runtimeDistribution` and `memoryDistribution` are not included

---

## Response Fields

- `id`: Unique submission ID
- `language`: Language object with `id` and `name`
- `overallVerdict`: Overall verdict (e.g., "Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error", "Compilation Error")
- `problemId`: Problem ID
- `score`: Score percentage (0-100)
- `status`: Submission status (usually "completed")
- `submittedAt`: ISO 8601 timestamp
- `testCaseResults`: (Optional) Array containing only the first failed test case. Not included for accepted submissions.
  - `testCaseId`: Test case identifier
  - `input`: JSON stringified input
  - `expectedOutput`: JSON stringified expected output
  - `actualOutput`: JSON stringified actual output (empty if error)
  - `status`: "failed" or "error"
  - `executionTime`: Milliseconds
  - `memoryUsage`: Kilobytes
  - `judge0Token`: Judge0 execution token
  - `errorMessage`: null or error string
- `testCasesPassed`: Number of passed test cases
- `totalExecutionTime`: Maximum execution time in milliseconds
- `totalTestCases`: Total number of test cases
- `userId`: User ID
- `code`: (Optional) The submitted source code. Included for all submissions.
- `runtimeDistribution`: (Optional) Performance distribution data. Only included for accepted submissions.
  - `data`: Array of distribution points with `runtime` (ms) and `percentage`
  - `userRuntime`: User's runtime in milliseconds
  - `beats`: Percentage of submissions this beats
- `memoryDistribution`: (Optional) Memory distribution data. Only included for accepted submissions.
  - `data`: Array of distribution points with `memory` (MB) and `percentage`
  - `userMemory`: User's memory usage in MB
  - `beats`: Percentage of submissions this beats
