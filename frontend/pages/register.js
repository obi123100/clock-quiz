import Head from "next/head";
import { useState,useEffect } from "react";
import styles from "../styles/Home.module.css";
import {useRouter} from "next/router";
import cookies from 'js-cookie'


export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const router = useRouter();

    useEffect(() => {
        let token = cookies.get('token')
        if (typeof(token) != "undefined") {
        router.push('/');
        }
    }, [])

    const submit = async (e) => {
        e.preventDefault();

        await fetch('http://127.0.0.1:5000/create_user', {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                email,
                password
            })
        }).then(response => response.text())
        .then(async (result) => {
            console.log(result)
            await router.push('/login');
        })
        .catch(error => console.log('error', error));

        
    }


    return (
    <div className="">
        <Head>
        <title>Register</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className={styles.vertical_center}>
        <div className="jumbotron card p-5 col-4 m-auto">
            <h3 className="text-center"> Register </h3>
            <form onSubmit={submit}>
                <div className="form-group">
                    <label for="inputName">Full Name</label>
                    <input type="text" className="form-control" id="inputName" required
                        onChange={e => setName(e.target.value)}/>
                    
                </div>
                <div className="form-group">
                    <label for="inputEmail">Email address</label>
                    <input type="email" className="form-control" id="inputEmail" required
                        onChange={e => setEmail(e.target.value)}/>
                    
                </div>
                <div className="form-group">
                    <label for="inputPassword">Password</label>
                    <input type="password" className="form-control" id="inputPassword" required
                        onChange={e => setPassword(e.target.value)}/>
                </div>
                
                <button type="submit" className="btn btn-primary mt-2">Login</button>
            </form>
        </div>
        </main>

        
    </div>
    );
}
