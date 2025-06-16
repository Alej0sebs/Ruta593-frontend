export type SeatConfigT = {
    id: string,
    type: string,
    name: string,
    position: { "x": number, "y": number },
    additionalCost?:number,
    status?: string
};

export type ClientT={
    dni:string,
    name:string,
    last_name:string,
    exist?:boolean //uso para saber si el cliente fue encontrado en la BD para no hacer inserciones innecesarias o evitar errores
}

export type SelectedSeatT={
    seatId:string,
    additionalCost:number,
    statusSeat:string,
    destination?:string,
    client?:ClientT,
    priceDestination?: number,
    discount?:number
};

export type LayoutBusT = {
    id: number,
    name: string,
    cooperative_id: string,
    layout: {},
};

export type CitiesT = {
    id: string,
    name: string,
    province_id: string
};

export type UserT = {
    dni: string,
    name: string,
    last_name: string,
    full_name: string,
    user_name: string,
    email: string,
    phone: string,
    address: string,
    password: string,
    role_id: string
    cooperative_id: string
};


export type TypeBusT = {
    bus_number: string,
    license_plate: string,
    chassis_vin: string,
    bus_manufacturer: string,
    model: string,
    year: number,
    capacity: number,
    bus_structure_id: number
};

export type BusStructureT = {
    id: string;
    name: string;
};
export type TypeBusStationT = {

    city_id: string,
    name: string,
    address: string,
    phone: string,
    open_time: string,
    close_time: string

};


export type CityBusStationT = {
    id: string,
    name: string
};

export type BusStationT = {
    id: string,
    name: string
    city_bus_station: CityBusStationT
};

export type UserSignUpT = Pick<UserT, 'email' | 'user_name' | 'password'>;


export type UserLocalStorageT = Pick<UserT, 'full_name' | 'role_id' | 'cooperative_id'>;

// export type CreateUser=Pick<UserT,'dni'|'name'|'last_name'|'user_name'|'email'|'phone'|'address'|'role_id'|'cooperative_id'>

export type CreateUserT = Omit<UserT, 'password'>;

export type CreateBusT = Pick<TypeBusT, 'bus_number' | 'license_plate' | 'chassis_vin' | 'bus_manufacturer' |
    'model' | 'year' | 'capacity' | 'bus_structure_id'>;

export type createBusStationT = Omit<TypeBusStationT, 'id'>;

export type timeDatePriceT = {
    date: string,
    departure_time: string,
    arrival_time: string,
    routeID: string,
    price: string,
};

export type timeAndPriceT = {
    departure_time: string,
    arrival_time: string,
    price: number,
};

export type FrequencyT = {
    bus_id: string,
    route_id: string,
    departure_time: string,
    date: string,
    arrival_time: string,
    driver_id: string,
    price: number,
    status: boolean
};

export type FrequencyListObjectT = {
    id: string;
    date: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    status: boolean;
    bus_number: number;
    departure_station_id: number;
    departure_station_name: string;
    departure_city_name: string;
    license_plate: string;
    arrival_station_id: number;
    arrival_station_name: string;
    arrival_city_name: string;
    cooperative_name: string;
    stop_station_ids: string;
    stop_station_names: string;
    stop_city_names: string;
};

export type FrequencyListT = {
    id: string;
    date: string;
    departure_time: string;
    arrival_time: string;
    price: number;
    status: boolean;
    bus_number: number;
    departure_station_id: number;
    departure_station_name: string;
    departure_city_name: string;
    license_plate: string;
    arrival_station_id: number;
    arrival_station_name: string;
    arrival_city_name: string;
    cooperative_name: string;
    stop_station_ids: string;
    stop_station_names: string;
    stop_city_names: string;
}[];


export type editFrequencyT = Partial<FrequencyT> & { id: string, license_plate?: string, driver_dni?: string };


export type SeatsStructureT = {
    frequency_id: string,
    bus_id: number,
    bus_structure_id: number
};

export type PositionT = {
    x: number,
    y: number
};

export type BusLayoutConfigurationT = {
    id: string;
    type: string;
    name: string;
    position: PositionT;
    status: string;
    additionalCost?: number;
}


export type TicketsListT = {
    station_id: string,
    user_id: string,
    serial_number: string;
    status: string;
    station_name?: string;
  user_name?: string;
}
export type LinkCooperativesT = {
  station_id: number;
  cooperative_id: string;
  city_name: string;
  name: string;
};



export type TicketClientInformationT = {
    serial_id: number;
    serial_number: number;
    frequency_id: string;
    price: number;
    departure_station: number;
    arrival_station: number;
    date: Date;
    selectedSeats: SelectedSeatT[];
    cooperative_id: string;
    payment_method: string;
};

export type UpdateSeatClientT = {
    seatId: string,
    client: ClientT,
    destination: string,
    priceDestination: number,
    discount:number
};


export type clientTicketT = {
    client_dni: string,
    client_name: string,
    ticket_code: string,
    seat_id: string,
};

export type cooperativeT = {
    id:string,
    name:string,
    address:string,
    phone:string,
    email:string,
    logo?:string,
};

export type SeatType ={
    id: string;
    name: string;
    special_caracter:string;
    description?:string;
    additional_cost?:number;
}









































































