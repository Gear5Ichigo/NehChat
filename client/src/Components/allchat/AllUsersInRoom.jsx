export default function AllUsersInRoom({allUsers}) {
    return (
    <>
        <div style={{width:"220px"}}>
            <h6> Users in Room </h6>
            {allUsers.map((item, index)=>(
                <div key={index}>
                    <b style={{color:item[0].color}}> {item[0].username} </b>
                </div>
            ))}
        </div>
    </>
    )
}