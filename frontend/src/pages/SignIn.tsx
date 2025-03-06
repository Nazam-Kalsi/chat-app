import React from 'react';
import { Link } from 'react-router';

const submit = async(e:any) => {
	if(!e.currentTarget){return;}
	e.preventDefault();
	console.log(e.currentTarget.elements.name.value);
    const dataToSend = {
      userName: e.currentTarget.elements.name.value,
      password: e.currentTarget.elements.password.value,
    };

	const res = await fetch(`http://localhost:3000/api/user/sign-in`,{
		method: 'POST',
		credentials: 'include',
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Credentials": "true",
			
		  },
		  body: JSON.stringify(dataToSend),
	});
	if(!res){
		throw Error('something went wrong.')
	}

	const data = await res.json();
	console.log(data);
};

export default function Login() {
	return (
		<div className="wrapper signIn">
			<div className="form">
				<div className="heading">LOGIN</div>
				<form onSubmit={submit}>
					<div>
						<label htmlFor="name">Name</label>
						<input type="text" id="name" placeholder="Enter your name" />
					</div>
					<div>
						<label htmlFor="password">Password</label>
						<input type="test" id="password" placeholder="Enter you password" />
					</div>
					<button type="submit">
						Submit
					</button>
				</form>
				<p>
					Don't have an account ? <Link to="/sign-up"> Sign In </Link>
				</p>
			</div>
		</div>
	);
}
