import Link from "next/link";
import { useState } from "react";
import cookies from 'js-cookie'
import {useRouter} from "next/router";

export default function Layout({ children }) {
   
    let token = true;
    if (typeof(cookies.get('token')) == "undefined") {
        token = false
    }

    const router = useRouter();
    const handleLogout = () => {
        cookies.remove('token')
        router.push('/login');
    }

    return (
        <>
            <nav className="navbar navbar-expand-md navbar-dark bg-dark ">
                <div className="container-fluid">
                    <Link href="/">
                        <a className="navbar-brand">Home</a>
                    </Link>

                    <div>
                    <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        <li className="nav-item">
                            <a href="/register" className="nav-link active" >Sign Up</a>
                        </li>
                        
                       <li className="nav-item">
                            <a href="/login" className="nav-link active" >Login</a>
                        </li>
                        <li className="nav-item">
                            <a onClick={handleLogout} className="nav-link active" >Logout</a>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>

            <main>{children}</main>

            <footer>
            <div class="footer-copyright text-center py-3 fixed-bottom">© 2022 Copyright
                <a href="/"> clockin.com</a>
            </div>
            </footer>

            
            
        </>
    )
    }