import { AdminPanel } from "../../components/admin/AdminPanel";
import AddProblem from "../../components/admin/problems/AddProblem";



const  AddProblemPage: React.FC = () => {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100">
        <AdminPanel />
      </div>
      <div className="flex-1 p-4">
        <AddProblem/>
      </div>
    </div>
  );
};



export default AddProblemPage;