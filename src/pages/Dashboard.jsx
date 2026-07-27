import { 
useEffect,
useState
} from "react";


import {
useAuthState
} from "react-firebase-hooks/auth";


import {
auth,
db
} from "../services/firebase";


import {
doc,
getDoc,
collection,
query,
where,
getDocs,
limit
} from "firebase/firestore";


import {
useNavigate
} from "react-router-dom";





function Dashboard(){



const [user]=useAuthState(auth);


const navigate=useNavigate();



const [profile,setProfile]=useState({

name:"",
education:"",
goal:""

});


const [stats,setStats]=useState({

notes:0,
quiz:0,
flashcards:0,
plans:0

});



const [recentNotes,setRecentNotes]=useState([]);


const [loading,setLoading]=useState(true);








const loadDashboard=async()=>{


if(!auth.currentUser)
return;



const uid=auth.currentUser.uid;



try{


setLoading(true);




// PROFILE


const profileSnap=await getDoc(

doc(
db,
"users",
uid
)

);



if(profileSnap.exists()){


setProfile(profileSnap.data());


}






// NOTES


const notesSnap=await getDocs(

query(

collection(db,"notes"),

where(
"userId",
"==",
uid
)

)

);





// QUIZ


const quizSnap=await getDocs(

query(

collection(db,"quizzes"),

where(
"userId",
"==",
uid
)

)

);





// FLASHCARDS


const flashSnap=await getDocs(

query(

collection(db,"flashcards"),

where(
"userId",
"==",
uid
)

)

);






// PLANS


const planSnap=await getDocs(

query(

collection(db,"studyPlans"),

where(
"userId",
"==",
uid
)

)

);







setStats({

notes:notesSnap.size,

quiz:quizSnap.size,

flashcards:flashSnap.size,

plans:planSnap.size

});








// RECENT NOTES


const recentSnap=await getDocs(

query(

collection(db,"notes"),

where(
"userId",
"==",
uid
),

limit(5)

)

);



setRecentNotes(

recentSnap.docs.map(doc=>(

{
id:doc.id,
...doc.data()

}

))

);



}

catch(error){

console.log(
"Dashboard Error:",
error
);


}

finally{


setLoading(false);


}



};








useEffect(()=>{


if(user){

loadDashboard();

}


},[user]);







const total=

stats.notes+
stats.quiz+
stats.flashcards+
stats.plans;



const progress=Math.min(

Math.round(
(total/20)*100
),

100

);







return(


<div className="
min-h-screen
bg-gradient-to-br
from-slate-950
via-indigo-950
to-purple-900
p-6
pt-28
">


<div className="
max-w-7xl
mx-auto
">








{/* HEADER */}


<div className="
bg-white/90
backdrop-blur-xl
rounded-[40px]
p-8
shadow-2xl
mb-8
flex
flex-col
md:flex-row
items-center
gap-6
">



<div className="
w-28
h-28
rounded-full
bg-gradient-to-r
from-indigo-600
to-purple-600
flex
items-center
justify-center
text-6xl
shadow-xl
">

🤖

</div>






<div>


<h1 className="
text-4xl
font-extrabold
text-gray-800
">

Welcome Back, 

<span className="
text-indigo-600
">

{" "}
{profile.name || 
user?.email?.split("@")[0]
}

</span>

 👋

</h1>




<p className="
text-gray-500
mt-3
">

📧 {user?.email}

</p>




<div className="
flex
gap-3
mt-4
flex-wrap
">


<span className="
bg-indigo-100
text-indigo-700
px-4
py-2
rounded-xl
font-semibold
">

🎓 {profile.education || "Student"}

</span>




<span className="
bg-purple-100
text-purple-700
px-4
py-2
rounded-xl
font-semibold
">

🎯 {profile.goal || "Learning"}

</span>



</div>



</div>



</div>









{/* AI MESSAGE */}


<div className="
bg-gradient-to-r
from-indigo-600
to-purple-700
text-white
rounded-[35px]
p-8
shadow-xl
mb-8
">


<h2 className="
text-3xl
font-bold
">

🚀 Keep Growing With AI

</h2>


<p className="
mt-3
text-lg
">

Your personal AI learning assistant is ready.
Create notes, quizzes and smart revision material.

</p>


</div>









{/* STATS */}


<div className="
grid
md:grid-cols-2
lg:grid-cols-4
gap-6
mb-8
">



<Stat
icon="📚"
title="Notes"
value={stats.notes}
/>



<Stat
icon="📝"
title="AI Quiz"
value={stats.quiz}
/>



<Stat
icon="🎴"
title="Flashcards"
value={stats.flashcards}
/>



<Stat
icon="📅"
title="Plans"
value={stats.plans}
/>



</div>










{/* PROGRESS */}


<div className="
bg-white/90
rounded-[35px]
p-8
shadow-xl
mb-8
">


<h2 className="
text-2xl
font-bold
text-indigo-700
">

📈 Learning Progress

</h2>




<div className="
h-6
bg-gray-200
rounded-full
mt-5
overflow-hidden
">


<div

className="
h-full
bg-gradient-to-r
from-indigo-600
to-purple-600
rounded-full
transition-all
"

style={{

width:`${progress}%`

}}

/>



</div>




<p className="
mt-4
font-bold
text-lg
">

{progress}% Completed 🎯

</p>



</div>










{/* RECENT */}


<div className="
bg-white/90
rounded-[35px]
p-8
shadow-xl
mb-8
">


<h2 className="
text-2xl
font-bold
text-indigo-700
mb-5
">

🕒 Recent Learning

</h2>




{

loading?


<p>
Loading...
</p>


:


recentNotes.length===0?


<p className="
text-gray-500
">

No activity yet 🚀

</p>



:


recentNotes.map(note=>(


<div

key={note.id}

className="
bg-gray-100
rounded-2xl
p-4
mb-3
"

>


<h3 className="
font-bold
">

📚 {note.question || "AI Note"}

</h3>



<p className="
text-gray-500
">

Saved successfully ✅

</p>


</div>


))


}



</div>









{/* ACTIONS */}



<div className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-6
">


<Action
title="🤖 AI Studio"
text="Generate Notes, Quiz & Flashcards"
click={()=>navigate("/scanner")}
/>


<Action
title="👤 Profile"
text="Manage your learning profile"
click={()=>navigate("/profile")}
/>


<Action
title="📚 Notes"
text="View saved notes"
click={()=>navigate("/notes")}
/>


<Action
title="📝 Quiz"
text="Practice MCQs"
click={()=>navigate("/quizzes")}
/>


<Action
title="🎴 Flashcards"
text="Revision cards"
click={()=>navigate("/flashcards")}
/>


<Action
title="📅 Planner"
text="Smart study schedule"
click={()=>navigate("/planner")}
/>



</div>







</div>

</div>


);


}









function Stat({icon,title,value}){


return(

<div className="
bg-white/90
rounded-[30px]
p-6
shadow-xl
hover:scale-105
transition
">


<h2 className="
text-4xl
font-bold
text-indigo-700
">

{icon} {value}

</h2>


<p className="
mt-3
font-semibold
text-gray-600
">

{title}

</p>


</div>

);


}







function Action({title,text,click}){


return(

<button

onClick={click}

className="
bg-white/90
rounded-[30px]
p-6
shadow-xl
text-left
hover:scale-105
transition
"


>


<h2 className="
text-xl
font-bold
text-indigo-700
">

{title}

</h2>


<p className="
mt-3
text-gray-600
">

{text}

</p>


</button>


);


}





export default Dashboard;