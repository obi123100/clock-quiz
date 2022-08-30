import Head from "next/head";
import List_item from '../components/list_item'
import { useState, useEffect } from "react";
import {useRouter} from "next/router";
import cookies from 'js-cookie'


export default function Home() {

    const [entry, setEntry] = useState('');
    const [allData, setAllData] = useState([]);

    const url = 'http://127.0.0.1:5000'

    const router = useRouter();

    useEffect(() => {
        let token = cookies.get('token')
        
        if (typeof(token) == "undefined") {
            router.push('/login');
        }
    }, [])


    const submit = async (e) => {
        e.preventDefault();

        await fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json','Authorization': 'Bearer ' + cookies.get('token')},
            body: JSON.stringify({
                entry
            })
        }).then(response => response.text())
        .then(async (result) => {
            
            setAllData(JSON.parse(result))
        })
        .catch(error => console.log('error', error));

        
    }

    const fetchEntries = async () => {

        await fetch(url, {
            method: 'GET',
            headers: {'Content-Type': 'application/json','Authorization': 'Bearer ' + cookies.get('token')}
        }).then(response => response.text())
        .then(async (result) => {
            
            if (result['msg'] || result['message']){ 
                cookies.remove('token')
            }else{
                setAllData(JSON.parse(result))
                console.log(JSON.parse(result));
            }
        
        })
        .catch(error => console.log('error', error));

        
    }

    const updateEntry = async (id,start_date, end_time) => {
        
        let d1 = new Date(start_date);
        let d2 = new Date(end_time);
        let same = d1.getTime() === d2.getTime();
        

        if (d2.getTime() > d1.getTime()){
            await fetch(`${url}/${id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json','Authorization': 'Bearer ' + cookies.get('token')},
                body: JSON.stringify({
                    end_time
                })
            }).then(response => response.text())
            .then(async (result) => {
    
                setAllData(JSON.parse(result))
            
                
            })
            .catch(error => console.log('error', error));
        }else{
            alert('End Date Must be greater than start date')
        }



        
    }

    function createEntry(entry) {
        return (
        
            <List_item
            key={entry.id}
            id={entry.id}
            start_date={entry.start_date}
            end_date={entry.end_date}
            updateEntry = {updateEntry}
            />
        );
    }

    console.log(allData)
    useEffect(() => {
        fetchEntries()
    },[]);
    
    return (
    <div className="container">
        <Head>
        <title>Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
        </Head>

        <main >
            <h1 className="mt-3 mb-3">
                Welcome to <a href="https://nextjs.org">Clock In</a>   
            </h1>

            <div className="">
                
                <form onSubmit={submit} className="needs-validation">
                
                    <div className="row">
                        
                    

                        <div className="col-md-5 mb-3">
                            <label for="inputDatetime">Entry Details</label>
                            <input type="datetime-local" className="form-control" required id="inputDatetime" onChange={e => setEntry(e.target.value)}/>
                        </div>

                        <div className="col-md-2 mb-3 mt-4">
                            <button className="btn btn-primary" type="submit">Clock In</button>
                        </div>

                        <div className="jumbotron mt-5">
                            <ul class="list-group">
                                <li className="list-group-item d-flex justify-content-between align-items-center"> <h4>Entry Details<i className="bi bi-clock m-1"></i></h4> <h4>Exit Details<i className="bi bi-clock-fill m-1"></i></h4> </li>
                                {allData['id']!=0?allData.map(createEntry):[]}
                                
                            </ul>
                        </div>
                    </div>
                </form>
                
            
            </div>


        </main>

        
    </div>
    );
}
