import { create } from 'zustand';
import { SelectedSeatT, UpdateSeatClientT } from '../types';
import { devtools } from 'zustand/middleware';

interface SeatStore {
    selectedSeats: SelectedSeatT[];
    setSelectedSeats: (seats: SelectedSeatT[]) => void;
    addSeat: (seat: SelectedSeatT) => void;
    updateSeatClient: (updateSeatClient:UpdateSeatClientT) => void;
    removeSeat: (seatId: string) => void;
    clearSeats: () => void;
}

//Creacion del store de los asientos seleccionados
export const useSelectedSeatsStore = create<SeatStore>()(
    devtools((set) => ({
        selectedSeats: [],

        setSelectedSeats: (seats: SelectedSeatT[]) =>
            set({ selectedSeats: seats }, false, 'setSelectedSeats'),

        addSeat: (seat: SelectedSeatT) =>
            set((state) => {
                if(seat.statusSeat === 'f'){
                    return {selectedSeats:[...state.selectedSeats, seat]};
                };
                return state;
            }),
        //Poner el destino
        updateSeatClient: ({seatId, client, destination, priceDestination, discount}:UpdateSeatClientT) =>
            set(
                (state) => ({
                    selectedSeats: state.selectedSeats.map((seat) =>
                        seat.seatId === seatId ? { ...seat, client, destination, priceDestination, discount } : seat
                    ),
                }),
                false,
                'updateSeatClient'
            ),

        removeSeat: (seatId: string) =>
            set(
                (state) => ({
                    selectedSeats: state.selectedSeats.filter((seat) => seat.seatId !== seatId),
                }),
                false,
                'removeSeat'
            ),

        clearSeats: () => set({ selectedSeats: [] }, false, 'clearSeats'),
    }))
);