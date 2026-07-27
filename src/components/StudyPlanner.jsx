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

const [saved,setSaved]=useState(false);







const generatePlan = async()=>{


if(!subject.trim() || !examDate || !hours){


setMessage(
"Please fill all fields ❌"
);


return;


}





if(hours<=0){


setMessage(
"Study hours must be greater than 0 ❌"
);


return;


}





if(!auth.currentUser){


setMessage(
"Please login first ❌"
);


return;


}





try{


setLoading(true);

setPlan("");

setMessage("");

setSaved(false);






const result = await askGemini(

`

You are an expert AI study coach.


Create a personalized study plan.


Subject:

${subject}



Exam Date:

${examDate}



Daily Available Study Hours:

${hours}



Create:


📅 Daily Study Schedule


📚 Topic Breakdown


📝 Revision Timeline


🧠 Practice Questions Strategy


🎯 Exam Preparation Tips


💡 Motivation Advice



Make the plan realistic and suitable for students.



`

);






setPlan(result);








await addDoc(

collection(db,"studyPlans"),

{


userId:auth.currentUser.uid,


email:auth.currentUser.email,


subject:subject,


examDate:examDate,


hours:Number(hours),


plan:result,


favorite:false,


type:"studyPlan",


createdAt:serverTimestamp()


}

);







setSaved(true);



setMessage(

"AI Study Plan created successfully ✅"

);



}

catch(error){


console.log(

"Study Planner Error:",

error

);



setMessage(

"Unable to create study plan ❌"

);



}

finally{


setLoading(false);


}



};









const copyPlan=()=>{


navigator.clipboard.writeText(plan);


setMessage(

"Study Plan copied 📋"

);


};









const clearPlan=()=>{


setSubject("");

setExamDate("");

setHours("");

setPlan("");

setMessage("");

setSaved(false);


};









return(



<div className="bg-white rounded-3xl shadow-xl p-8 mt-8">





<h1 className="text-3xl font-bold text-blue-700 mb-6">

📅 AI Study Planner

</h1>









<input


type="text"


placeholder="Enter Subject e.g. Biology"


className="w-full border rounded-xl p-4 mb-4"


value={subject}


onChange={(e)=>setSubject(e.target.value)}


/>










<input


type="date"


className="w-full border rounded-xl p-4 mb-4"


value={examDate}


onChange={(e)=>setExamDate(e.target.value)}


/>









<input


type="number"


placeholder="Daily study hours"


className="w-full border rounded-xl p-4 mb-5"


value={hours}


onChange={(e)=>setHours(e.target.value)}


/>









<div className="flex gap-4 flex-wrap">





<button


disabled={loading}


onClick={generatePlan}


className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-full"


>


{

loading

?

"🤖 Creating Plan..."

:

"✨ Generate Plan"

}


</button>








<button


onClick={clearPlan}


className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-full"


>


Clear


</button>





</div>









{

message &&


<p className="mt-5 font-semibold text-green-600">

{message}

</p>


}









{

plan &&


<div className="mt-8">





<div className="flex justify-between items-center mb-4">



<h2 className="text-2xl font-bold text-blue-700">

📚 Your AI Study Plan

</h2>





<button


onClick={copyPlan}


className="bg-indigo-600 text-white px-5 py-2 rounded-xl"


>

📋 Copy

</button>



</div>









<div className="bg-blue-50 p-6 rounded-2xl">


<p className="whitespace-pre-line leading-8 text-gray-700">

{plan}

</p>


</div>





</div>



}








{

saved &&


<p className="mt-5 text-blue-700 font-semibold">

📌 Plan saved in My Study Plans

</p>


}







</div>



);


}


export default StudyPlanner;