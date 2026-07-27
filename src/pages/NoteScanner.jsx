import { useState } from "react";

import ImageUploader from "../components/ImageUploader";

import {
  askGemini,
  askGeminiWithImage
} from "../services/gemini";


import {
  auth,
  db
} from "../services/firebase";


import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";


import {
  useAuthState
} from "react-firebase-hooks/auth";


import {
  useNavigate
} from "react-router-dom";





function NoteScanner(){


const [user]=useAuthState(auth);

const navigate=useNavigate();




const [question,setQuestion]=useState("");

const [answer,setAnswer]=useState("");

const [image,setImage]=useState(null);

const [loading,setLoading]=useState(false);

const [message,setMessage]=useState("");








// ================= AI EXPLANATION =================


const handleAskAI=async()=>{


if(!question && !image){

setMessage(
"Please enter topic or upload image ❌"
);

return;

}



try{


setLoading(true);

setAnswer("");

setMessage("");



let result;



if(image){


result = await askGeminiWithImage(

`
Analyze this study note image.

Explain in simple student friendly language.

Give:

📚 Main Topic

⭐ Important Points

📝 Short Summary

💡 Examples

🎯 Exam Tips

`,

image

);



}

else{


result = await askGemini(

`
Explain this topic:

${question}


Give:

📚 Main Topic

⭐ Important Points

📝 Summary

💡 Examples

🎯 Exam Tips


Keep explanation simple.
`

);


}



setAnswer(result);



}

catch(error){


console.log(
"AI Error:",
error
);


setMessage(
"AI Error ❌"
);


}

finally{


setLoading(false);


}


};









// ================= SAVE NOTE =================



const saveNote=async()=>{


if(!answer)
return;



try{


await addDoc(

collection(db,"notes"),

{


userId:auth.currentUser.uid,

email:auth.currentUser.email,

question:
question || "Image Note",

answer:answer,

favorite:false,

type:"explanation",

createdAt:serverTimestamp()


}

);



setMessage(
"Note saved successfully ✅"
);



}

catch(error){


console.log(
"Save Error:",
error
);


setMessage(
"Save failed ❌"
);


}


};









// ================= CLEAR =================


const clearAll=()=>{


setQuestion("");

setAnswer("");

setImage(null);

setMessage("");


};
return(


<div className="
min-h-screen
pt-28
p-6
bg-gradient-to-br
from-slate-950
via-indigo-950
to-purple-900
">


<div className="
max-w-6xl
mx-auto
">






{/* HEADER */}

<div className="
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-[35px]
p-8
shadow-2xl
mb-8
text-white
">


<div className="
flex
items-center
gap-5
">


<div className="
w-20
h-20
rounded-3xl
bg-gradient-to-r
from-indigo-500
to-purple-600
flex
items-center
justify-center
text-5xl
shadow-xl
">

🤖

</div>



<div>


<h1 className="
text-4xl
font-extrabold
">

LearnLens AI Scanner

</h1>


<p className="
text-gray-300
mt-2
">

Convert your notes into AI powered learning material

</p>


<p className="
text-indigo-300
mt-2
text-sm
">

👤 {user?.email}

</p>


</div>


</div>


</div>









<div className="
grid
lg:grid-cols-2
gap-8
">







{/* INPUT SECTION */}


<div className="
bg-white
rounded-[35px]
p-8
shadow-2xl
">


<h2 className="
text-2xl
font-bold
text-indigo-700
mb-5
">

📸 Upload Notes

</h2>





<ImageUploader

onImageSelect={(file)=>setImage(file)}

/>









<textarea

rows="5"

placeholder="
Enter topic or paste your notes...
"

className="
w-full
mt-6
border
rounded-2xl
p-5
outline-none
focus:ring-4
focus:ring-indigo-200
"

value={question}

onChange={(e)=>setQuestion(e.target.value)}

/>








<div className="
flex
gap-4
mt-6
">



<button

onClick={handleAskAI}

disabled={loading}

className="
flex-1
bg-gradient-to-r
from-indigo-600
to-purple-600
text-white
py-3
rounded-2xl
font-bold
shadow-lg
hover:scale-105
transition
"

>


{

loading

?

"🤖 Analyzing..."

:

"✨ Explain With AI"

}


</button>






<button

onClick={clearAll}

className="
bg-gray-600
text-white
px-6
rounded-2xl
font-bold
"

>

Clear

</button>



</div>







{

message &&


<p className="
mt-5
text-green-600
font-bold
">

{message}

</p>


}




</div>












{/* AI OUTPUT */}



<div className="
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-[35px]
p-8
shadow-2xl
text-white
">


<h2 className="
text-3xl
font-bold
mb-6
">

🧠 AI Explanation

</h2>






{

answer ?


<div>


<p className="
whitespace-pre-line
leading-8
text-gray-200
">

{answer}

</p>





<button

onClick={saveNote}

className="
mt-6
bg-green-500
px-6
py-3
rounded-xl
font-bold
hover:scale-105
transition
"

>

💾 Save Note

</button>



</div>



:


<div className="
text-center
py-20
text-gray-300
">


<div className="
text-6xl
">

✨

</div>


<p className="
mt-5
text-lg
">

AI explanation will appear here

</p>


</div>


}





</div>







</div>









{/* AI TOOLS */}



<div className="
grid
md:grid-cols-3
gap-6
mt-10
">






<button

onClick={()=>navigate("/generate-quiz")}

className="
bg-gradient-to-r
from-green-500
to-emerald-600
text-white
rounded-3xl
p-6
shadow-xl
hover:scale-105
transition
"

>


<h2 className="
text-xl
font-bold
">

📝 Create Quiz

</h2>


<p className="mt-2">

Generate AI MCQs

</p>


</button>








<button

onClick={()=>navigate("/generate-flashcards")}

className="
bg-gradient-to-r
from-pink-500
to-rose-600
text-white
rounded-3xl
p-6
shadow-xl
hover:scale-105
transition
"

>


<h2 className="
text-xl
font-bold
">

🎴 Flashcards

</h2>


<p className="mt-2">

Smart revision cards

</p>


</button>








<button

onClick={()=>navigate("/planner")}

className="
bg-gradient-to-r
from-blue-500
to-cyan-600
text-white
rounded-3xl
p-6
shadow-xl
hover:scale-105
transition
"

>


<h2 className="
text-xl
font-bold
">

📅 Study Planner

</h2>


<p className="mt-2">

AI study schedule

</p>


</button>





</div>





</div>


</div>


);


}


export default NoteScanner;