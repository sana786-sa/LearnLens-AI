import { useState } from "react";

import {
  signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../services/firebase";

import { useNavigate } from "react-router-dom";



function Login(){


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [showPassword,setShowPassword]=useState(false);

const [message,setMessage]=useState("");

const [loading,setLoading]=useState(false);


const navigate=useNavigate();





const handleLogin=async()=>{


if(!email || !password){

setMessage(
"Please enter email and password ❌"
);

return;

}





try{


setLoading(true);

setMessage("");



await signInWithEmailAndPassword(

auth,

email,

password

);



setMessage(
"Login successful ✅"
);



setTimeout(()=>{

navigate("/dashboard");

},800);



}



catch(error){


console.log(
"Login Error:",
error.code
);



if(error.code==="auth/invalid-credential"){

setMessage(
"Invalid email or password ❌"
);

}

else if(error.code==="auth/user-not-found"){

setMessage(
"Account not found ❌"
);

}

else if(error.code==="auth/wrong-password"){

setMessage(
"Wrong password ❌"
);

}

else{

setMessage(
"Login failed ❌"
);

}



}



finally{


setLoading(false);


}



};









return(


<div className="
relative
min-h-screen
overflow-hidden
bg-gradient-to-br
from-indigo-700
via-purple-700
to-pink-600
flex
items-center
justify-center
p-6
">







{/* Background Animation */}


<div className="
absolute
top-10
left-10
w-72
h-72
bg-purple-400
rounded-full
blur-3xl
opacity-40
animate-pulse
">

</div>



<div className="
absolute
bottom-10
right-10
w-72
h-72
bg-pink-400
rounded-full
blur-3xl
opacity-40
animate-pulse
">

</div>









<div className="
relative
z-10
w-full
max-w-md
bg-white/80
backdrop-blur-xl
rounded-[35px]
shadow-2xl
p-8
">







<div className="
text-center
mb-8
">


<div className="
w-24
h-24
mx-auto
rounded-full
bg-gradient-to-r
from-indigo-600
to-purple-600
flex
items-center
justify-center
text-5xl
shadow-xl
">

🚀

</div>





<h1 className="
text-3xl
font-bold
text-gray-800
mt-5
">

LearnLens AI

</h1>




<p className="
text-gray-500
mt-2
">

Your Smart AI Learning Companion

</p>



</div>









<label className="
font-semibold
text-gray-700
">

📧 Email

</label>



<input


type="email"


placeholder="Enter your email"


value={email}


onChange={(e)=>setEmail(e.target.value)}


className="
w-full
mt-2
mb-5
px-4
py-3
rounded-xl
border
focus:ring-4
focus:ring-indigo-200
outline-none
transition
"


/>









<label className="
font-semibold
text-gray-700
">

🔒 Password

</label>




<div className="relative">


<input


type={
showPassword
?
"text"
:
"password"
}


placeholder="Enter your password"


value={password}


onChange={(e)=>setPassword(e.target.value)}


className="
w-full
mt-2
px-4
py-3
pr-12
rounded-xl
border
focus:ring-4
focus:ring-purple-200
outline-none
"


/>




<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

className="
absolute
right-4
top-5
"

>

{

showPassword
?
"🙈"
:
"👁️"

}


</button>


</div>









<button


onClick={handleLogin}


disabled={loading}


className="
w-full
mt-6
bg-gradient-to-r
from-indigo-600
to-purple-600
text-white
py-3
rounded-xl
font-bold
shadow-lg
hover:scale-105
transition
disabled:bg-gray-400
"


>


{

loading

?

"🔄 Logging in..."

:

"🚀 Login"

}


</button>










{

message &&


<p className={`

mt-5

text-center

font-semibold

${
message.includes("successful")
?
"text-green-600"
:
"text-red-600"
}

`}>

{message}

</p>


}









<p className="
text-center
mt-7
text-gray-600
">


Don't have an account?


<button


onClick={()=>navigate("/signup")}


className="
ml-2
text-indigo-600
font-bold
hover:underline
"


>

Signup

</button>


</p>










<p className="
text-center
text-xs
text-gray-400
mt-6
">

Powered by Gemini AI • Firebase • LearnLens AI

</p>





</div>


</div>


);


}



export default Login;