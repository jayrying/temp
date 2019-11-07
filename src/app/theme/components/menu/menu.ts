import { Menu } from './menu.model';

export const horizontalMenuItems = [ 
    new Menu (1, 'Home', '/', null, null, false, 0),
    new Menu (2, 'Rent', '/properties/Purpose=Rent', null, null, false, 0), 
    new Menu (3, 'Buy', '/properties/Purpose=Buy', null, null, false, 0), 
    new Menu (4, 'Luxury Travel', '/luxurytravel', null, null, false, 0), 
    new Menu (5, 'Agents', '/agents', null, null, false, 0), 
    new Menu (6, 'About Us', '/about', null, null, false, 0),   
    new Menu (7, 'Market Trends', '/market-trends', null, null, false, 0),   
]

export const verticalMenuItems = [ 
    new Menu (1, 'Home', '/', null, null, false, 0),
    new Menu (2, 'Rent', '/properties/Purpose=Rent', null, null, false, 0), 
    new Menu (3, 'Buy', '/properties/Purpose=Buy', null, null, false, 0), 
    new Menu (4, 'Luxury Travel', '/luxurytravel', null, null, false, 0), 
    new Menu (5, 'Agents', '/agents', null, null, false, 0), 
    new Menu (6, 'About Us', '/about', null, null, false, 0),   
]