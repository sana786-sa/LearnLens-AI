import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";


// Pages
import Dashboard from "./pages/Dashboard";
import NoteScanner from "./pages/NoteScanner";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import MyNotes from "./pages/MyNotes";
import MyFlashcards from "./pages/MyFlashcards";
import MyQuizzes from "./pages/MyQuizzes";

import History from "./pages/History";
import StudyPlannerPage from "./pages/StudyPlannerPage";

import Profile from "./pages/Profile";


// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import QuizGenerator from "./components/QuizGenerator";
import FlashcardGenerator from "./components/FlashcardGenerator";





function NotFound(){


const navigate = useNavigate();



return(

<div className="
min-h-screen
bg-gradient-to-br
from-indigo-700
via-purple-700
to-pink-600
flex
items-center
justify-center
p-5
">


<div className="
bg-white
rounded-3xl
shadow-2xl
p-10
text-center
">


<h1 className="
text-6xl
font-bold
text-indigo-700
">

404

</h1>


<p className="
text-xl
mt-4
text-gray-600
">

Page Not Found 😢

</p>


<p className="
text-gray-400
mt-2
">

The page you are looking for does not exist.

</p>



<button

onClick={()=>navigate("/dashboard")}

className="
mt-6
bg-indigo-600
hover:bg-indigo-700
text-white
px-6
py-3
rounded-xl
font-bold
transition
"

>

Go Dashboard

</button>


</div>


</div>

);


}









function App(){


return(


<BrowserRouter>


<Navbar />


<Routes>





{/* PUBLIC ROUTES */}


<Route

path="/"

element={<Login />}

/>



<Route

path="/signup"

element={<Signup />}

/>









{/* DASHBOARD */}


<Route

path="/dashboard"

element={

<ProtectedRoute>

<Dashboard />

</ProtectedRoute>

}

/>









{/* PROFILE */}


<Route

path="/profile"

element={

<ProtectedRoute>

<Profile />

</ProtectedRoute>

}

/>









{/* AI SCANNER */}


<Route

path="/scanner"

element={

<ProtectedRoute>

<NoteScanner />

</ProtectedRoute>

}

/>









{/* QUIZ GENERATOR */}


<Route

path="/generate-quiz"

element={

<ProtectedRoute>

<QuizGenerator />

</ProtectedRoute>

}

/>









{/* FLASHCARD GENERATOR */}


<Route

path="/generate-flashcards"

element={

<ProtectedRoute>

<FlashcardGenerator />

</ProtectedRoute>

}

/>









{/* NOTES */}


<Route

path="/notes"

element={

<ProtectedRoute>

<MyNotes />

</ProtectedRoute>

}

/>









{/* FLASHCARDS */}


<Route

path="/flashcards"

element={

<ProtectedRoute>

<MyFlashcards />

</ProtectedRoute>

}

/>









{/* QUIZZES */}


<Route

path="/quizzes"

element={

<ProtectedRoute>

<MyQuizzes />

</ProtectedRoute>

}

/>









{/* STUDY PLANNER */}


<Route

path="/planner"

element={

<ProtectedRoute>

<StudyPlannerPage />

</ProtectedRoute>

}

/>









{/* HISTORY */}


<Route

path="/history"

element={

<ProtectedRoute>

<History />

</ProtectedRoute>

}

/>









{/* 404 */}


<Route

path="*"

element={<NotFound />}

/>



</Routes>


</BrowserRouter>


);


}



export default App;