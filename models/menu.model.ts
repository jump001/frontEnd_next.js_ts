export interface DataMenu {
    location:  Location;
    _id:       string;
    name:      string;
    photo:     string;
    createdAt: Date;
    updatedAt: Date;
    menus:     Menu[];
    id:        string;
}

export interface Location {
    lat: number;
    lgn: number;
}

export interface Menu {
    _id:       string;
    name:      string;
    price:     number;
    shop:      string;
    price_vat: number;
    id:        string;
}