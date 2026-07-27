import { useEffect, useState } from "react";

import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from "firebase/firestore";

import { db, auth } from "../services/firebase";



function MyQuizzes(){


const [quizzes,setQuizzes]=useState([]);

const [search,setSearch]=useState("");

const [favoriteOnly,setFavoriteOnly]=useState(false);

const [loading,setLoading]=useState(true);

const [message,setMessage]=useState("");

const [openQuiz,setOpenQuiz]=useState(null);






const fetchQuizzes=async()=>{


if(!auth.currentUser) return;


try{


setLoading(true);


const q=query(

collection(db,"quizzes"),

where(
"userId",
"==",
auth.currentUser.uid
)

);



const snapshot=await getDocs(q);



let data=snapshot.docs.map(doc=>(

{
id:doc.id,
...doc.data()
}

));



data.sort((a,b)=>{

const aTime=a.createdAt?.seconds || 0;
const bTime=b.createdAt?.seconds || 0;

return bTime-aTime;

});



setQuizzes(data);



}

catch(error){

console.log(error);

setMessage(
"Unable to load quizzes ❌"
);

}

finally{

setLoading(false);

}


};






useEffect(()=>{

fetchQuizzes();

},[]);







const deleteQuiz=async(id)=>{


const confirmDelete=window.confirm(
"Delete this quiz?"
);


if(!confirmDelete)return;


try{


await deleteDoc(

doc(db,"quizzes",id)

);



setQuizzes(prev=>
prev.filter(
quiz=>quiz.id!==id
)
);



setMessage(
"Quiz deleted successfully ✅"
);



}

catch(error){

console.log(error);

}


};







const favoriteQuiz=async(quiz)=>{


try{


await updateDoc(

doc(db,"quizzes",quiz.id),

{

favorite:!quiz.favorite

}

);



fetchQuizzes();


}

catch(error){

console.log(error);

}


};









const filteredQuizzes=quizzes.filter(quiz=>{


const text=

(quiz.topic || "") +

(quiz.quiz || "");



const searchMatch=

text.toLowerCase()
.includes(
search.toLowerCase()
);



const favoriteMatch=

favoriteOnly

?

quiz.favorite

:

true;



return searchMatch && favoriteMatch;


});







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
">



<div className="
bg-white/90
backdrop-blur-xl
rounded-[35px]
shadow-2xl
p-8
">





<div className="
flex
justify-between
items-center
flex-wrap
gap-5
">


<div>


<h1 className="
text-4xl
font-extrabold
text-green-700
">

📝 My AI Quiz Center

</h1>


<p className="
text-gray-500
mt-2
">

Practice smarter with AI generated quizzes 🚀

</p>


<div className="
mt-3
inline-block
bg-green-100
text-green-700
px-4
py-2
rounded-full
font-bold
">

Total Quizzes: {quizzes.length}

</div>


</div>





<button

onClick={fetchQuizzes}

className="
bg-indigo-600
hover:bg-indigo-700
text-white
px-6
py-3
rounded-2xl
shadow-lg
transition
"

>

🔄 Refresh

</button>



</div>        {/* SEARCH AREA */}


        <div className="
        mt-8
        flex
        gap-4
        flex-wrap
        ">


        <input


        type="text"


        placeholder="🔍 Search quizzes..."


        value={search}


        onChange={(e)=>setSearch(e.target.value)}


        className="
        flex-1
        border
        rounded-2xl
        p-4
        outline-none
        focus:ring-2
        focus:ring-indigo-500
        "


        />






        <button


        onClick={()=>setFavoriteOnly(!favoriteOnly)}


        className="
        bg-yellow-500
        hover:bg-yellow-600
        text-white
        px-6
        py-3
        rounded-2xl
        font-bold
        transition
        "


        >


        {


        favoriteOnly

        ?

        "⭐ Show All"

        :

        "⭐ Favorites"


        }


        </button>



        </div>







        {

        message &&


        <div className="
        mt-5
        bg-green-100
        text-green-700
        p-4
        rounded-xl
        font-semibold
        ">

        {message}

        </div>


        }









        {


        loading ?


        <div className="
        text-center
        py-16
        ">


        <div className="
        text-5xl
        animate-spin
        ">

        ⚙️

        </div>


        <p className="
        mt-5
        text-xl
        font-bold
        text-indigo-700
        ">

        Loading AI Quizzes...

        </p>


        </div>





        :



        filteredQuizzes.length===0 ?



        <div className="
        text-center
        py-16
        ">


        <h2 className="
        text-3xl
        font-bold
        text-gray-600
        ">

        📂 No Quiz Found

        </h2>


        <p className="
        text-gray-500
        mt-3
        ">

        Create quizzes from AI Scanner 🚀

        </p>


        </div>







        :





        <div className="
        grid
        md:grid-cols-2
        gap-6
        mt-8
        ">



        {


        filteredQuizzes.map(quiz=>(



        <div

        key={quiz.id}

        className="
        bg-gradient-to-br
        from-green-50
        to-indigo-50
        rounded-3xl
        p-6
        shadow-xl
        hover:scale-[1.02]
        transition
        "


        >






        <div className="
        flex
        justify-between
        items-center
        ">



        <h2 className="
        text-2xl
        font-bold
        text-green-700
        ">

        🎯 {quiz.topic || "AI Quiz"}

        </h2>






        <button


        onClick={()=>favoriteQuiz(quiz)}


        className="
        text-4xl
        hover:scale-125
        transition
        "


        >


        {

        quiz.favorite

        ?

        "⭐"

        :

        "☆"


        }


        </button>



        </div>









        <div className="
        mt-4
        bg-white
        rounded-2xl
        p-4
        shadow-inner
        ">


        <p className="
        text-gray-600
        ">

        🤖 Gemini AI Generated Quiz

        </p>


        </div>









        <button


        onClick={()=>setOpenQuiz(

        openQuiz===quiz.id

        ?

        null

        :

        quiz.id

        )}



        className="
        mt-5
        w-full
        bg-green-600
        hover:bg-green-700
        text-white
        py-3
        rounded-xl
        font-bold
        transition
        "


        >


        {


        openQuiz===quiz.id

        ?

        "Hide Quiz ▲"

        :

        "View Quiz ▶"


        }


        </button>









        {


        openQuiz===quiz.id &&



        <div className="
        mt-5
        bg-gray-50
        rounded-2xl
        p-5
        border
        ">


        <h3 className="
        font-bold
        text-indigo-700
        text-lg
        mb-3
        ">

        📝 Questions & Answers

        </h3>



        <p className="
        whitespace-pre-line
        leading-8
        text-gray-700
        ">

        {quiz.quiz}

        </p>


        </div>



        }









        <button


        onClick={()=>deleteQuiz(quiz.id)}


        className="
        mt-5
        bg-red-500
        hover:bg-red-600
        text-white
        px-6
        py-3
        rounded-xl
        font-bold
        transition
        "


        >

        🗑 Delete Quiz


        </button>








        </div>



        ))



        }



        </div>



        }



        </div>


        </div>


        </div>


);


}



export default MyQuizzes;