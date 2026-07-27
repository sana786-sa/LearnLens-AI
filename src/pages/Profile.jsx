import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc
} from "firebase/firestore";

import {
  auth,
  db
} from "../services/firebase";

import {
  useAuthState
} from "react-firebase-hooks/auth";



function Profile(){


const [user]=useAuthState(auth);


const [profile,setProfile]=useState({});


const [stats,setStats]=useState({

notes:0,
quizzes:0,
flashcards:0,
plans:0

});


const [loading,setLoading]=useState(true);





const loadProfile = async()=>{


if(!auth.currentUser)
return;


const uid = auth.currentUser.uid;



try{


// USER DATA

const userDoc = await getDoc(

doc(
db,
"users",
uid
)

);



if(userDoc.exists()){

setProfile(userDoc.data());

}





// NOTES COUNT

const notes = await getDocs(

query(

collection(db,"notes"),

where(
"userId",
"==",
uid
)

)

);




// QUIZ COUNT

const quizzes = await getDocs(

query(

collection(db,"quizzes"),

where(
"userId",
"==",
uid
)

)

);




// FLASHCARD COUNT

const flashcards = await getDocs(

query(

collection(db,"flashcards"),

where(
"userId",
"==",
uid
)

)

);




// PLANS COUNT

const plans = await getDocs(

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

notes:notes.size,

quizzes:quizzes.size,

flashcards:flashcards.size,

plans:plans.size

});




}

catch(error){

console.log(
"Profile Error:",
error
);


}

finally{

setLoading(false);

}


};






useEffect(()=>{


if(user){

loadProfile();

}


},[user]);





return(


<div className="
min-h-screen
pt-28
p-6
bg-gradient-to-br
from-indigo-700
via-purple-700
to-pink-600
">



<div className="
max-w-5xl
mx-auto
bg-white/90
backdrop-blur-xl
rounded-3xl
shadow-2xl
p-8
">





{/* HEADER */}


<div className="
text-center
">


<div className="
w-32
h-32
mx-auto
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

👤

</div>



<h1 className="
text-4xl
font-bold
text-indigo-700
mt-5
">

{profile.name || "Student"}

</h1>



<p className="
text-gray-500
mt-2
">

{profile.email || user?.email}

</p>



<div className="
inline-block
mt-4
bg-indigo-100
text-indigo-700
px-6
py-2
rounded-full
font-bold
">

🚀 LearnLens AI Learner

</div>



</div>







{/* INFORMATION */}



<div className="
grid
md:grid-cols-2
gap-6
mt-10
">



<div className="
bg-indigo-50
rounded-3xl
p-6
">

<h2 className="
text-xl
font-bold
text-indigo-700
">

🎓 Education

</h2>


<p className="
mt-3
font-semibold
">

{profile.education || "Not Added"}

</p>


</div>







<div className="
bg-purple-50
rounded-3xl
p-6
">

<h2 className="
text-xl
font-bold
text-purple-700
">

🎯 Goal

</h2>


<p className="
mt-3
font-semibold
">

{profile.goal || "Not Added"}

</p>


</div>



</div>









{/* STATS */}



<h2 className="
text-3xl
font-bold
text-indigo-700
mt-10
mb-6
">

📊 Learning Statistics

</h2>





{

loading ?


<div className="
text-center
font-bold
text-xl
">

Loading...

</div>



:

<div className="
grid
md:grid-cols-4
gap-5
">



<Card

icon="📚"

title="Notes"

value={stats.notes}

/>



<Card

icon="📝"

title="Quiz"

value={stats.quizzes}

/>



<Card

icon="🎴"

title="Flashcards"

value={stats.flashcards}

/>



<Card

icon="📅"

title="Plans"

value={stats.plans}

/>



</div>


}





{/* ACCOUNT INFO */}



<div className="
mt-10
bg-gradient-to-r
from-indigo-600
to-purple-700
text-white
rounded-3xl
p-6
">


<h2 className="
text-2xl
font-bold
">

✨ AI Learning Profile

</h2>


<p className="
mt-3
">

Keep learning and improve your skills with LearnLens AI 🚀

</p>



</div>






</div>



</div>


);


}








function Card({

icon,

title,

value

}){


return(


<div className="
bg-white
rounded-3xl
shadow-xl
p-6
text-center
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





export default Profile;