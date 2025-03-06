import { Link } from "react-router";

export default function Signup() {
  interface FormElements extends HTMLFormControlsCollection {
    name: HTMLInputElement;
    email: HTMLInputElement;
    password: HTMLInputElement;
  }

  interface SignUpFormElement extends HTMLFormElement {
    readonly elements: FormElements;
  }

  const submit = async (e: React.FormEvent<SignUpFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget.elements.name.value);
    const dataToSend = {
      userName: e.currentTarget.elements.name.value,
      email: e.currentTarget.elements.email.value,
      password: e.currentTarget.elements.password.value,
    };
    try {
      const res = await fetch(`http://localhost:3000/api/user/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      console.log(res)
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      const data = await res.json();
      // console.log(data);
    } catch (error: any) {      
        console.log("Unexpected Error:", error.message);      
    }
  };
  return (
    <div className="wrapper signUp">
      <div className="form">
        <div className="heading">CREATE AN ACCOUNT</div>
        <form onSubmit={submit}>
          <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" placeholder="Enter your name" />
          </div>
          <div>
            <label htmlFor="name">E-Mail</label>
            <input type="text" id="email" placeholder="Enter your mail" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter you password"
            />
          </div>
          <button type="submit">Submit</button>
        </form>
        <p>
          Have an account ? <Link to="/sign-in"> Login </Link>
        </p>
      </div>
    </div>
  );
}
