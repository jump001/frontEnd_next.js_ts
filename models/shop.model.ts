
export interface Shops {
    id?:       string;
    name:     string;
    photo:    string;
    location: Location;
}

export interface Location {
    lat: number;
    lgn: number;
}
