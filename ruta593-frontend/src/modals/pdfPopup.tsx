import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import Ruta593Logo from "../images/ruta593-logo/mountain.png";
import { TicketData } from '../types/ticket';
import { IMAGE_URL } from '../helpers/Constants';

Modal.setAppElement('#root');

interface PdfModalProps {
    tickets: TicketData[];
}

const PDFPopup: React.FC<PdfModalProps> = ({ tickets }) => {
    const [showPDF, setShowPDF] = useState(false);
    const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);


    useEffect(() => {
        if (tickets.length > 0) {
            generatePDF(tickets);
        }
    }, [tickets]);

    const generatePDF = async (tickets: TicketData[]) => {
        const doc = new jsPDF({
            format: [80, 160],
            unit: 'mm',
        });

        for (const ticket of tickets) {
            await generateTicketPage(doc, ticket);

            if (ticket !== tickets[tickets.length - 1]) {
                doc.addPage();
            }
        }

        const pdfBlob = doc.output('blob');
        setPdfBlob(pdfBlob);
        setShowPDF(true);
    };

    const generateTicketPage = async (doc: jsPDF, data: TicketData) => {
        const addCenteredText = (text: string, y: number, fontSize: number = 10) => {
            doc.setFontSize(fontSize);
            doc.text(text, 40, y, { align: 'center' });
        };

        const lineHeight = 4;
        doc.addImage(Ruta593Logo, 'PNG', 15, 0, 50, 40);
        let currentY = 25;
        currentY += lineHeight * 3;
        addCenteredText('Av. Cevallos y Quito', currentY, 8);
        currentY += lineHeight;
        addCenteredText('RUC: 1818181818001', currentY, 8);
        currentY += lineHeight;
        addCenteredText('Teléfono: (03) 2 742 358', currentY, 8);
        currentY += lineHeight * 1.5;

        doc.line(5, currentY, 75, currentY);
        currentY += 6;

        addCenteredText('BOLETO DE VIAJE', currentY, 10);
        currentY += lineHeight;

        doc.line(5, currentY, 75, currentY);
        currentY += lineHeight;

        doc.setFontSize(8);
        doc.text(`${data.tipoDocumento}:  ${data.numeroDocumento}`, 5, currentY);
        currentY += lineHeight;
        doc.text(`Pasajero: ${data.nombres} ${data.apellidos}`, 5, currentY);
        currentY += lineHeight;
        doc.text(`Asiento: ${data.seats.join(', ')}`, 5, currentY)
        currentY += lineHeight;
        doc.text(`Fecha: ${data.dia}`, 5, currentY);
        currentY += lineHeight;
        doc.text(`Hora Salida: ${data.horaSalida}`, 5, currentY);
        currentY += lineHeight;
        doc.text(`Hora Llegada: ${data.horaLlegada}`, 5, currentY);
        currentY += lineHeight;
        doc.text(`Bus: ${data.placa}`, 5, currentY);
        currentY += lineHeight;
        doc.text(`Origen: ${data.terminal}`, 5, currentY);
        currentY += lineHeight;
        doc.text(`Destino: ${data.destino}`, 5, currentY);
        currentY += lineHeight;
        doc.text(`Hora de Emisión: ${new Date().getHours().toString()}:${new Date().getMinutes().toString()}`, 5, currentY);
        currentY += lineHeight;
        doc.text(`Total: $${data.price}`, 5, currentY);
        currentY += 5;
        const qrCodeDataUrl = await QRCode.toDataURL(`${data.ticketCode}`);
        doc.addImage(qrCodeDataUrl, 'PNG', 25, currentY, 30, 30);
        currentY += 30;
        doc.line(5, currentY, 75, currentY);
        currentY += lineHeight;

        doc.setFontSize(6);
        addCenteredText('Este documento es un comprobante de pago válido.', currentY, 6);
        currentY += lineHeight;
        addCenteredText('Conserve este boleto para cualquier reclamo posterior.', currentY, 6);
        currentY += lineHeight;
        addCenteredText('Gracias por viajar con Ruta593', currentY, 6);
    };

    const closeModal = () => {
        setShowPDF(false);
        setPdfBlob(null);
    };

    return (
        <>
            {showPDF && pdfBlob && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[101]"
                >
                    <div
                        className="relative w-full max-w-screen-lg max-h-screen bg-white dark:bg-boxdark p-4 rounded-md shadow-lg overflow-auto"
                        // style={{ width: '50vw', height: '70vh' }}
                        style={{
                            width: '50vw',
                            height: '70vh',
                            maxWidth: '50vw',
                            maxHeight: '90vh',
                        }}
                    >
                        <iframe
                            src={URL.createObjectURL(pdfBlob)}
                            style={{ width: '100%', height: '90%' }}
                            title="Boleto PDF"
                            className="border border-gray-300 rounded-md"
                        ></iframe>
                        <button
                            onClick={closeModal}
                            className="mt-4 w-full py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default PDFPopup;