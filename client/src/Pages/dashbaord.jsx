import { useEffect } from "react";

export function Dashboard() {

    useEffect( () => {
        fetch('/api/authenticate')
        .then(res => res.json())
        .then(data => {
            if (!data.res) window.location.href = '/'
        })
    })

    return (
        <>
            <ul>
                <li> <a href="/allchat"> All Chat </a> </li>
                <li> <a href="/settings"> Settings </a> </li>
                <li>
                    <form action="/api/users/logout" method="post">
                        <input type="submit" className="btn btn-link" style={{padding: 0}} value={"Log Out"} />
                    </form>
                </li>
            </ul>
        </>
    );
}