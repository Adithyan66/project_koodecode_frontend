
import { AdminPanel } from "../../components/admin/AdminPanel";
import { ContestListing } from "../../components/admin/contests/contestListing/ContestListing";
import { ProblemListing } from "../../components/admin/problems/ProblemListing";

// Types
interface Problem {
    id: number;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    acceptance: number;
    submissions: number;
    createdAt: string;
    status: 'Active' | 'Draft' | 'Archived';
}




// Mock data for problems
const mockProblems: Problem[] = [
    { id: 1, title: "Two Sum", difficulty: "Easy", category: "Array", acceptance: 87.2, submissions: 1234567, createdAt: "2024-01-15", status: "Active" },
    { id: 2, title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", acceptance: 65.3, submissions: 987654, createdAt: "2024-01-14", status: "Active" },
    { id: 3, title: "Longest Substring Without Repeating", difficulty: "Medium", category: "String", acceptance: 58.7, submissions: 876543, createdAt: "2024-01-13", status: "Active" },
    { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Array", acceptance: 34.2, submissions: 543210, createdAt: "2024-01-12", status: "Active" },
    { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", category: "String", acceptance: 42.1, submissions: 654321, createdAt: "2024-01-11", status: "Draft" },
    { id: 6, title: "Reverse Integer", difficulty: "Easy", category: "Math", acceptance: 76.8, submissions: 432109, createdAt: "2024-01-10", status: "Active" },
    { id: 7, title: "String to Integer (atoi)", difficulty: "Medium", category: "String", acceptance: 39.4, submissions: 321098, createdAt: "2024-01-09", status: "Active" },
    { id: 8, title: "Palindrome Number", difficulty: "Easy", category: "Math", acceptance: 82.1, submissions: 210987, createdAt: "2024-01-08", status: "Active" },
    { id: 9, title: "Regular Expression Matching", difficulty: "Hard", category: "Dynamic Programming", acceptance: 28.9, submissions: 109876, createdAt: "2024-01-07", status: "Archived" },
    { id: 10, title: "Container With Most Water", difficulty: "Medium", category: "Two Pointers", acceptance: 61.5, submissions: 98765, createdAt: "2024-01-06", status: "Active" },
    { id: 11, title: "Integer to Roman", difficulty: "Medium", category: "Math", acceptance: 67.3, submissions: 87654, createdAt: "2024-01-05", status: "Active" },
    { id: 12, title: "Roman to Integer", difficulty: "Easy", category: "Math", acceptance: 89.1, submissions: 76543, createdAt: "2024-01-04", status: "Active" },
];




const  ContestListingPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100">
        <AdminPanel />
      </div>
      <div className="flex-1 p-4">
        <ContestListing problems={mockProblems}/>
      </div>
    </div>
  );
};



export default ContestListingPage;