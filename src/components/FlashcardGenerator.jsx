import { useState } from "react";

import { askGemini } from "../services/gemini";

import { auth, db } from "../services/firebase";

import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";



function FlashcardGenerator(){


const [topic,setTopic]=useState("");

const [count,setCount]=useState(10);

const [flashcards,setFlashcards]=useState("");

const [loading,setLoading]=useState(false);

const [message,setMessage]=useState("");

const [saved,setSaved]=useState(false);







const generateFlashcards = async()=>{


if(!topic.trim()){

setMessage(
"Please enter topic first ❌"
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

setFlashcards("");

setMessage("");

setSaved(false);





const prompt = `


You are an expert AI tutor.


Create ${count} study flashcards.


Topic:

${topic}



Format:


Card 1:

Question:

Answer:



Card 2:

Question:

Answer:



Rules:

- Keep questions exam focused.
- Keep answers short and easy.
- Use student friendly language.
- Do not repeat cards.


`;







const result = await askGemini(prompt);




setFlashcards(result);






// SAVE FIREBASE


await addDoc(

collection(db,"flashcards"),

{


userId:auth.currentUser.uid,

email:auth.currentUser.email,

topic:topic,

cards:result,

cardCount:Number(count),

favorite:false,

type:"flashcard",

createdAt:serverTimestamp()


}

);







setSaved(true);


setMessage(
"Flashcards generated and saved successfully ✅"
);




}

catch(error){


console.log(
"Flashcard Error:",
error
);


setMessage(
"Flashcard generation failed ❌"
);



}

finally{


setLoading(false);


}


};










const copyFlashcards=()=>{


navigator.clipboard.writeText(

flashcards

);


setMessage(
"Copied to clipboard 📋"
);


};









const clearFlashcards=()=>{


setTopic("");

setFlashcards("");

setMessage("");

setSaved(false);


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
text-green-700
mb-6
">

🎴 AI Flashcard Generator

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

Number of Flashcards

</label>





<select


value={count}


onChange={(e)=>setCount(Number(e.target.value))}


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
5 Flashcards
</option>


<option value={10}>
10 Flashcards
</option>


<option value={15}>
15 Flashcards
</option>


</select>









<div className="flex gap-4">



<button


disabled={loading}


onClick={generateFlashcards}


className="
bg-green-600
hover:bg-green-700
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

"🤖 Creating..."

:

"✨ Generate Flashcards"

}


</button>








<button


onClick={clearFlashcards}


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
text-indigo-600
">

{message}

</p>


}











{

flashcards &&


<div className="mt-8">





<div className="
flex
justify-between
items-center
mb-4
">


<h2 className="
text-2xl
font-bold
text-green-700
">

🎴 Your Flashcards

</h2>






<button


onClick={copyFlashcards}


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
bg-green-50
p-6
rounded-2xl
">


<p className="
whitespace-pre-line
leading-8
">

{flashcards}

</p>


</div>





</div>


}









{

saved &&


<p className="
mt-5
text-green-600
font-semibold
">

🔥 Saved in My Flashcards

</p>


}







</div>


);


}



export default FlashcardGenerator;