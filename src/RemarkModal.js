import React from 'react'
import "./RemarkModal.css"

function RemarkModal(props)
{
    function handleRejectOrCancel(e)
    {
            props.handleFinalReject(e.target.innerHTML,document.getElementById("remark-input").value);  
    }

    let description = "Enter Remark for rejecting ID:"+props.id;

    return (
        <div className="modal">
            <section className="modal-main">
                <label htmlFor="remark-input">{description}</label><br />
                <input id="remark-input" type="text" placeholder="Enter Here"></input><br />
                <div className="reject-cancel-buttons">
                    <button onClick={handleRejectOrCancel} className="reject-button">Reject</button>
                    <button onClick={handleRejectOrCancel} className="cancel-button">Cancel</button>
                </div>
            </section>
        </div>
    );
}

export default RemarkModal;