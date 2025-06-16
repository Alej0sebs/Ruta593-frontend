import { useState } from "react";
import { IoTrashOutline } from "react-icons/io5";

interface deleteProps {
    id: string;
    onConfirm: (id: string) => void; // Callback para confirmacion de la accion 
    title: string;
    message: string;
}

const DeletePopup = ({ id, title, message, onConfirm }: deleteProps) => {
    const [isOpen , setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal= () => setIsOpen(false);

    const handleConfirm=()=>{
        onConfirm(id);
        closeModal();
    };
    
    return (
        <>
            {/* Botón para abrir el modal */}
            <button className="hover:text-primary" onClick={openModal}>
                <IoTrashOutline />
            </button>

            {isOpen && (
                <dialog open className="modal modal-bottom sm:modal-middle text-white">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">{title}</h3>
                        <p className="py-4">{message}</p>
                        <div className="modal-action">
                            <button className="btn text-white" onClick={handleConfirm}>
                                Confirmar
                            </button>
                            <button className="btn text-white" onClick={closeModal}>
                                Cerrar
                            </button>
                        </div>
                    </div>
                </dialog>
            )}
        </>
    );

}

export default DeletePopup;