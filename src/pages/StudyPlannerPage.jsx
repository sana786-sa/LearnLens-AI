import { useState } from "react";

import { askGemini } from "../services/gemini";

import { auth, db } from "../services/firebase";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";



function StudyPlanner(){


const [subject,setSubject]=useState("");

const [examDate,setExamDate]=useState("");

const [hours,setHours]=useState("");

const [plan,setPlan]=useState("");

const [loading,setLoading]=useState(false);

const [message,setMessage]=useState("");







const generatePlan = async()=>{


if(!subject.trim() || !examDate || !hours){


setMessage(
"Please complete all fields ❌"
);

return;

}



if(!auth.currentUser){


setMessage(
"Please login first ❌"
);

return;

}




setLoading(true);

setPlan("");

setMessage("");




try{


const result = await askGemini(

`
You are an expert AI study coach.

Create a personalized study plan.

Subject:
${subject}

Exam Date:
${examDate}

Daily Study Hours:
${hours} hours


Include:

📅 Daily Timetable

📚 Topic Distribution

📝 Practice Strategy

🔁 Revision Plan

🧠 Weak Area Improvement

🎯 Exam Day Strategy

💡 Motivation Tips


Make it realistic and student friendly.
`

);





setPlan(result);





await addDoc(

collection(db,"studyPlans"),

{


userId:auth.currentUser.uid,

email:auth.currentUser.email,

subject,

examDate,

dailyHours:Number(hours),

plan:result,

favorite:false,

createdAt:serverTimestamp()

}


);




setMessage(
"AI Study Plan Created Successfully ✅"
);



}

catch(error){


console.log(error);


setMessage(
"Failed to create plan ❌"
);


}

finally{


setLoading(false);


}



};







const clearPlan=()=>{


setSubject("");

setExamDate("");

setHours("");

setPlan("");

setMessage("");



};








return(



<div className="
min-h-screen
bg-gradient-to-br
from-slate-900
via-indigo-900
to-purple-900
p-6
pt-28
">







<div className="
max-w-6xl
mx-auto
grid
lg:grid-cols-3
gap-8
">







{/* LEFT PANEL */}


<div className="
lg:col-span-1
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-[35px]
p-8
shadow-2xl
text-white
">





<div className="
text-5xl
mb-5
">

📅

</div>




<h1 className="
text-3xl
font-bold
">

AI Study Planner

</h1>




<p className="
text-gray-300
mt-3
">

Create personalized study schedules powered by Gemini AI.

</p>





<div className="
mt-8
space-y-4
">



<input

type="text"

placeholder="📚 Subject (Biology, Physics...)"

className="
w-full
p-4
rounded-2xl
bg-white/90
text-gray-800
outline-none
"

value={subject}

onChange={(e)=>setSubject(e.target.value)}

/>





<input

type="date"

className="
w-full
p-4
rounded-2xl
bg-white/90
text-gray-800
outline-none
"

value={examDate}

onChange={(e)=>setExamDate(e.target.value)}

/>







<input

type="number"

placeholder="⏰ Daily Study Hours"

className="
w-full
p-4
rounded-2xl
bg-white/90
text-gray-800
outline-none
"

value={hours}

onChange={(e)=>setHours(e.target.value)}

/>







<div className="
flex
gap-3
mt-5
">



<button

onClick={generatePlan}

disabled={loading}

className="
flex-1
bg-gradient-to-r
from-indigo-500
to-purple-600
text-white
py-3
rounded-2xl
font-bold
hover:scale-105
transition
"

>


{

loading

?

"🤖 Creating..."

:

"✨ Generate"

}



</button>






<button

onClick={clearPlan}

className="
bg-white/20
px-5
rounded-2xl
hover:bg-white/30
"

>

Clear

</button>



</div>





{

message &&

<p className="
mt-5
font-semibold
text-green-300
">

{message}

</p>


}




</div>




</div>










{/* RIGHT PANEL */}


<div className="
lg:col-span-2
bg-white/95
rounded-[35px]
shadow-2xl
p-8
">





<h2 className="
text-3xl
font-bold
text-indigo-700
mb-6
">

🚀 Your AI Generated Study Roadmap

</h2>







{

!plan ?


<div className="
h-96
flex
items-center
justify-center
text-center
text-gray-400
">


<div>


<div className="
text-6xl
mb-4
">

🧠

</div>


<p className="
text-xl
">

Generate your personalized AI study plan

</p>


</div>


</div>






:


<div className="
bg-gradient-to-br
from-indigo-50
to-purple-50
rounded-3xl
p-6
border
">




<p className="
whitespace-pre-line
leading-8
text-gray-700
">

{plan}

</p>





</div>



}








</div>








</div>





</div>



);


}



export default StudyPlanner;