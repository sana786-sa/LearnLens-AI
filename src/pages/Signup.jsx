import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import {
  auth,
  db
} from "../services/firebase";

import {
  doc,
  setDoc,
  serverTimestamp
} from "firebase/firestore";

import {
  useNavigate
} from "react-router-dom";



function Signup(){


const [name,setName]=useState("");

const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const [education,setEducation]=useState("");

const [goal,setGoal]=useState("");

const [showPassword,setShowPassword]=useState(false);

const [message,setMessage]=useState("");

const [loading,setLoading]=useState(false);


const navigate=useNavigate();





const validatePassword=(pass)=>{

return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#]).{8,}$/.test(pass);

};







const handleSignup=async()=>{


if(
!name ||
!email ||
!password ||
!education ||
!goal
){

setMessage(
"Please fill all fields ❌"
);

return;

}



if(!validatePassword(password)){


setMessage(
"Password must contain 8+ characters with uppercase, lowercase, number and symbol ❌"
);

return;

}




try{


setLoading(true);

setMessage("");



const result =
await createUserWithEmailAndPassword(

auth,

email,

password

);



const user=result.user;





await setDoc(

doc(db,"users",user.uid),

{

name:name,

email:email,

education:education,

goal:goal,

createdAt:serverTimestamp()

}

);




// logout after signup

await signOut(auth);



setMessage(
"Account created successfully ✅ Please login"
);



setTimeout(()=>{

navigate("/");

},1500);



}



catch(error){


console.log(
"Signup Error:",
error.code
);



if(error.code==="auth/email-already-in-use"){


setMessage(
"Email already registered ❌"
);


}

else if(error.code==="auth/invalid-email"){


setMessage(
"Invalid email address ❌"
);


}

else if(error.code==="auth/weak-password"){


setMessage(
"Weak password ❌"
);


}

else{


setMessage(
"Signup failed ❌"
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





<div className="text-center mb-7">


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

📚

</div>




<h1 className="
text-3xl
font-bold
mt-5
">

LearnLens AI

</h1>



<p className="text-gray-500 mt-2">

Create your smart AI learning profile 🚀

</p>


</div>








<input

placeholder="👤 Full Name"

value={name}

onChange={(e)=>setName(e.target.value)}

className="
w-full
mb-4
p-3
rounded-xl
border
outline-none
focus:ring-4
focus:ring-indigo-200
"

/>







<input

type="email"

placeholder="📧 Email Address"

value={email}

onChange={(e)=>setEmail(e.target.value)}

className="
w-full
mb-4
p-3
rounded-xl
border
outline-none
focus:ring-4
focus:ring-indigo-200
"

/>







<div className="relative">


<input

type={
showPassword
?
"text"
:
"password"
}

placeholder="🔒 Strong Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

className="
w-full
p-3
rounded-xl
border
outline-none
"

/>


<button

type="button"

onClick={()=>setShowPassword(!showPassword)}

className="
absolute
right-4
top-3
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





<p className="
text-xs
text-gray-500
mt-2
mb-4
">

Password: 8+ chars, A-Z, a-z, number & special symbol

</p>









<select

value={education}

onChange={(e)=>setEducation(e.target.value)}

className="
w-full
mb-4
p-3
rounded-xl
border
"

>


<option value="">
🎓 Select Education
</option>


<option>
School
</option>


<option>
College
</option>


<option>
University
</option>


<option>
MDCAT Preparation
</option>


</select>







<select

value={goal}

onChange={(e)=>setGoal(e.target.value)}

className="
w-full
mb-6
p-3
rounded-xl
border
"

>


<option value="">
🎯 Select Learning Goal
</option>


<option>
Exam Preparation
</option>


<option>
Concept Learning
</option>


<option>
Making Notes
</option>


<option>
Daily Study
</option>


</select>







<button

onClick={handleSignup}

disabled={loading}

className="
w-full
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
"

>


{

loading

?

"Creating Account..."

:

"🚀 Create Account"

}


</button>







{

message &&


<p className={`
mt-5
text-center
font-semibold

${
message.includes("successfully")
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
mt-6
text-gray-600
">


Already have account?


<button

onClick={()=>navigate("/")}

className="
ml-2
text-indigo-600
font-bold
"

>

Login

</button>


</p>







<p className="
text-center
text-xs
text-gray-400
mt-5
">

Powered by Gemini AI • Firebase • LearnLens AI

</p>





</div>


</div>


);


}


export default Signup;