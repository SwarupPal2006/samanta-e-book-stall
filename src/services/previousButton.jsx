import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import "../Styles/PreviousButton.css";
export default function Previous() {
    const navigate = useNavigate();
    return (
        <button className="back-btn" onClick={() => navigate(-1)}>
         <ArrowLeft size={25} /> 
      </button>
    );
}
