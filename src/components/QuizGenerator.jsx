import { useState } from "react";

import { askGemini } from "../services/gemini";

import { auth, db } from "../services/firebase";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";



function QuizGenerator(){


const [topic,setTopic]=useState("");

const [quiz,setQuiz]=useState("");

const [questionCount,setQuestionCount]=useState(5);

const [loading,setLoading]=useState(false);

const [message,setMessage]=useState("");





const generateQuiz = async()=>{


if(!topic.trim()){

setMessage("Please enter topic first ❌");

return;

}



if(!auth.currentUser){

setMessage("Please login first ❌");

return;

}



try{


setLoading(true);

setQuiz("");

setMessage("");




const prompt = `

You are an expert AI tutor.

Create ${questionCount} MCQ questions.


Topic:
${topic}


Follow this format:


Question 1:

A)

B)

C)

D)


Correct Answer:

Explanation:



Rules:

- Student friendly language
- Exam focused questions
- Simple explanation
- No repeated questions
- Provide accurate answers


`;





const result = await askGemini(prompt);




setQuiz(result);




// SAVE QUIZ IN FIREBASE

await addDoc(

collection(db,"quizzes"),

{

userId: auth.currentUser.uid,

email: auth.currentUser.email,

topic: topic,

quiz: result,

questionCount: Number(questionCount),

favorite:false,

type:"quiz",

createdAt:serverTimestamp()

}

);



setMessage(
"AI Quiz generated and saved successfully ✅"
);



}

catch(error){


console.log(
"Quiz Generate Error:",
error
);


setMessage(
"Quiz generation failed ❌"
);


}

finally{


setLoading(false);


}


};







const copyQuiz=()=>{


navigator.clipboard.writeText(quiz);


setMessage(
"Quiz copied 📋"
);


};








const clearQuiz=()=>{


setTopic("");

setQuiz("");

setMessage("");

};








return(


<div className="
bg-white
rounded-3xl
shadow-xl
p-8
mt-8
">





<h1 className="
text-3xl
font-bold
text-purple-700
mb-6
">

🧠 AI Quiz Generator

</h1>







<input

type="text"

placeholder="Enter topic e.g Biology"

value={topic}

onChange={(e)=>setTopic(e.target.value)}

className="
w-full
border
rounded-xl
p-4
mb-5
"

/>







<label className="font-semibold">

Number of Questions

</label>





<select

value={questionCount}

onChange={(e)=>setQuestionCount(Number(e.target.value))}

className="
w-full
border
rounded-xl
p-3
mt-2
mb-5
"

>


<option value={5}>
5 MCQs
</option>


<option value={10}>
10 MCQs
</option>


<option value={15}>
15 MCQs
</option>


</select>









<div className="flex gap-4">



<button

disabled={loading}

onClick={generateQuiz}

className="
bg-purple-600
hover:bg-purple-700
disabled:bg-gray-400
text-white
px-8
py-3
rounded-full
"

>


{

loading

?

"🤖 Creating Quiz..."

:

"✨ Generate Quiz"

}



</button>








<button

onClick={clearQuiz}

className="
bg-gray-500
text-white
px-6
py-3
rounded-full
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
text-green-600
">

{message}

</p>


}









{

quiz &&


<div className="
mt-8
">




<div className="
flex
justify-between
items-center
mb-4
">


<h2 className="
text-2xl
font-bold
text-purple-700
">

📝 Generated Quiz

</h2>





<button

onClick={copyQuiz}

className="
bg-indigo-600
text-white
px-5
py-2
rounded-xl
"

>

📋 Copy

</button>




</div>








<div className="
bg-purple-50
p-6
rounded-2xl
">


<p className="
whitespace-pre-line
leading-8
">

{quiz}

</p>



</div>





</div>


}





</div>


);


}



export default QuizGenerator;