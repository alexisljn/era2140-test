import {ModalProps} from "../../types/CommonTypes";

function Modal({hideModal}: Partial<ModalProps>) {

    return (
        <>
            <div className="modal-background">
                <div className="modal">
                    <div className="modal-header">
                        <p className="modal-title">Transaction in progress</p>
                        <button className="modal-cross" onClick={hideModal}>╳</button>
                    </div>
                    <div className="modal-spinner"><div className="lds-dual-ring"></div></div>
                    <p className="modal-text">This modal will close automatically when transaction will be confirmed.</p>
                </div>
            </div>

        </>
    )
}

export {Modal};