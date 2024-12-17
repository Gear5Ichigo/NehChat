export default function AllUsersInRoom({allUsers}) {
    return (
    <>
        <div style={{width:"220px"}}>
            {allUsers.map((user, index)=>(<>
                <h6> Users in Room </h6>
                <div key={index}>
                    <b style={{color:user.color}}> {user.username} </b>
                </div>
            </>))}
        </div>
    </>
    )
}