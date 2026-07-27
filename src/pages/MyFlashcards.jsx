import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs
} from "firebase/firestore";

import {
  db,
  auth
} from "../services/firebase";

import {
  useAuthState
} from "react-firebase-hooks/auth";



function MyFlashcards(){


const [user]=useAuthState(auth);


const [flashcards,setFlashcards]=useState([]);

const [loading,setLoading]=useState(true);

const [error,setError]=useState("");

const [search,setSearch]=useState("");

const [activeCard,setActiveCard]=useState(null);





const loadFlashcards=async()=>{


if(!auth.currentUser)
return;



try{


setLoading(true);


const uid=auth.currentUser.uid;



const q=query(

collection(db,"flashcards"),

where(
"userId",
"==",
uid
)

);



const snapshot=await getDocs(q);



const data=snapshot.docs.map(doc=>(

{
id:doc.id,
...doc.data()
}

));



setFlashcards(data);



}

catch(err){


console.log(
"Flashcard Error:",
err
);


setError(
"Unable to load flashcards ❌"
);


}

finally{


setLoading(false);


}



};






useEffect(()=>{


if(user){

loadFlashcards();

}


},[user]);







const filteredCards = flashcards.filter(card=>{


return(

card.topic || ""

)
.toLowerCase()
.includes(
search.toLowerCase()
);


});







return(



<div className="
min-h-screen
bg-gradient-to-br
from-slate-900
via-purple-900
to-indigo-900
p-6
pt-28
">





<div className="
max-w-7xl
mx-auto
">







{/* HEADER */}


<div className="
bg-white/10
backdrop-blur-xl
border
border-white/20
rounded-3xl
p-8
shadow-2xl
mb-8
text-white
">



<h1 className="
text-4xl
font-extrabold
">

🎴 My AI Flashcards

</h1>



<p className="
mt-3
text-white/70
">

Revise your concepts with Gemini AI powered flashcards 🚀

</p>




<div className="
mt-6
flex
gap-4
flex-wrap
">



<input

value={search}

onChange={(e)=>setSearch(e.target.value)}

placeholder="
🔍 Search topic...
"

className="
flex-1
min-w-[250px]
bg-white/20
border
border-white/30
rounded-xl
px-5
py-3
text-white
placeholder-white/60
outline-none
"

/>




<button

onClick={loadFlashcards}

className="
bg-indigo-500
hover:bg-indigo-600
px-6
py-3
rounded-xl
font-bold
transition
"

>

🔄 Refresh

</button>



</div>



</div>









{
error &&

<div className="
bg-red-500
text-white
p-4
rounded-xl
mb-5
">

{error}

</div>

}









{
loading ?


<div className="
bg-white/10
backdrop-blur-xl
rounded-3xl
p-10
text-center
text-white
text-xl
">

<div className="
text-5xl
animate-spin
mb-5
">

⚙️

</div>


Loading Flashcards...


</div>






:


filteredCards.length===0 ?



<div className="
bg-white/10
backdrop-blur-xl
rounded-3xl
p-10
text-center
text-white
">

<h2 className="
text-3xl
font-bold
">

📂 No Flashcards Found

</h2>


<p className="
mt-3
text-white/70
">

Generate flashcards from AI Scanner first.

</p>


</div>






:





<div className="
grid
md:grid-cols-2
lg:grid-cols-3
gap-6
">







{

filteredCards.map(card=>(



<div

key={card.id}

onClick={()=>setActiveCard(

activeCard===card.id
?
null
:
card.id

)}

className="
cursor-pointer
bg-gradient-to-br
from-pink-500
via-purple-600
to-indigo-700
rounded-3xl
p-6
shadow-2xl
text-white
hover:scale-105
transition
duration-300
"

>





<h2 className="
text-2xl
font-bold
mb-4
">

🎯 {card.topic || "AI Flashcard"}

</h2>







<div className="
bg-white
text-gray-800
rounded-2xl
p-5
min-h-[180px]
">




{

activeCard===card.id ?


<div>


<h3 className="
font-bold
text-purple-700
mb-3
">

📖 Answer

</h3>


<p className="
whitespace-pre-line
leading-7
">

{card.cards}

</p>



</div>



:




<div>


<h3 className="
font-bold
text-indigo-700
mb-3
">

❓ Question

</h3>


<p>

Click to reveal flashcard

</p>



</div>



}





</div>









<div className="
mt-5
flex
justify-between
text-sm
">

<span>

🎴 Cards: {card.cardCount || "AI"}

</span>



<span>

🤖 Gemini

</span>



</div>





</div>



))


}




</div>






}




</div>



</div>



);


}



export default MyFlashcards;