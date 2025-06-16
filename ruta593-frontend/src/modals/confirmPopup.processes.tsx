import { ReactNode } from 'react';

interface ConfirmPopupProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: () => void;
    children: ReactNode;
}

const ConfirmPopup = ({ title, isOpen, onClose, onSave, children }: ConfirmPopupProps) => {
    if (!isOpen) return null;

    return (
        <dialog open className="modal modal-bottom sm:modal-middle">
            <div className="modal-box rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h3 className="font-bold text-lg text-black dark:text-white">{title}</h3>
                <div className="py-4">{children}</div>
                <div className="modal-action">
                    <button className="btn bg-primary text-white hover:bg-primary-dark" onClick={onSave}>
                        Confirmar Pago
                    </button>
                    <button className="btn bg-gray-500 text-white hover:bg-gray-700" onClick={onClose}>
                        Cerrar
                    </button>
                </div>
            </div>
        </dialog>
    );
};

export default ConfirmPopup;
