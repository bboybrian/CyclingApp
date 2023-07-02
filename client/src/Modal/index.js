import { createPortal } from "react-dom"
import "./Modal.css";

const Modal = ({children, open, onClose}) => {
    return open ? createPortal(
        <div className="modalContainer" onClick={() => onClose(false)}>
            <div onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.getElementById("modal")
    ) : <></>
}

export default Modal;