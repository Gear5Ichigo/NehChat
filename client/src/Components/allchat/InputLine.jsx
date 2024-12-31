import { Form } from "react-bootstrap"

export default function InputLine({isUserMuted, message, showTyping, usersTyping, fileField,
    handleTyping,
    handleFileUpload,
    handlePaste,
    messageSubmit,
}) {
    return (<>
        <div className="">

            <div style={ {display:showTyping} } > <b> {usersTyping} </b> </div>

            <Form onSubmit={messageSubmit} className="d-flex">

                {isUserMuted?
                (<>
                    <Form.Control
                    type="text"
                    placeholder="You have been indefinitely muted by the State"
                    className="bg-secondary-subtle"
                    disabled
                    />
                </>) : (<>
                    <Form.Control
                    type="file"
                    className="w-25"
                    onChange={handleFileUpload}
                    value={fileField}
                    />

                    <Form.Control
                    type="text"
                    maxLength={200}
                    value={message}
                    onChange={ handleTyping }
                    onPaste={ handlePaste }
                    placeholder="Message here..."
                    className="bg-secondary-subtle"
                    />

                    <Form.Control type="submit" style={ {width: "15.25%", fontSize: "1em"} } value="Submit" className="btn btn-primary"/>
                </>)}

            </Form>

        </div>
    </>)
}