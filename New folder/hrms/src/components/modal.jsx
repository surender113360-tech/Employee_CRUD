 function Modal({title,onClose,children}){
    return(
    <div className="modal-backdrop" onMouseDown={onClose}>
        <section className="modal" onMouseDown={e=>e.stopPropagation()}>
            <div className="modal-head">
                <h2>{title}</h2>
                <button className="icon-btn" onClick={onclose}>x</button>
                </div>
                {children}
        </section>
    </div>)
}

export default Modal