export class propertysmall {
    public id: number;
    public address:string;
    public bedroom:number;
    public bathroom:number;
    public description: string;
    public date:string;
    public images: string[];
    public location: string;
    public purpose:string;
    public price: string;
    public size: string;
    public tags:string[];
}

export class property {
    public id: number;
    public askingPrice: number;
    public address:string;
    public bedRoom:number;
    public bathRoom:number;
    public basement:boolean;
    public broadbandInternetAccess:boolean;
    public builtinYear:number;
    public bbqarea:boolean;
    public centralAc:boolean;
    public cornerPlot:boolean;
    public createdDate:string;
    public dinningRoom: number;
    public description: string;
    public fkCityIdName:string;
    public fkLocationIdNameWithParentName:string;
    public flooring:string;
    public floors:number;
    public furnishing:string;
    public garage:boolean;
    public garden:boolean;
    public kitchen:number;
    public images: string[];
    public landType: string;
    public mls: string;
    public map:string;
    public purpose:string;
    public parkingSpace: number;
    public propertyType: string;
    public size: string;
    public suiGasSupply:string;
    public saunaRoom:boolean;
    public satelliteOrCableTvReady:boolean;
    public waterSupply;
    public agentName: string;
    public agentImagePath: string;
    public agentPhoneNumber: string;
    public agentPersonalDescription: string;
}