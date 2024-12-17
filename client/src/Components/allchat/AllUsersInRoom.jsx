export default function AllUsersInRoom({allUsers}) {
    return (
    <>
        <div style={{width:"220px"}}>
            <h6> Users in Room </h6>
            {allUsers.map((user, index)=>(<>
                <div key={index}>
                    <b style={{color:user.color}}> {user.username} </b>
                </div>
            </>))}
        </div>
    </>
    )
}