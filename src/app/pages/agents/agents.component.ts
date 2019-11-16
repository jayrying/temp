import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agents',
  templateUrl: './agents.component.html',
  styleUrls: ['./agents.component.scss']
})
export class AgentsComponent implements OnInit {
  public agents=[];
  constructor(public appService:AppService,private apiservice:ApiService) { }

  ngOnInit() {
    
  this.agents = this.appService.getAgents();
  //this.getukagent();
    //this.getagents();
  }
getagents(){
  
  this.apiservice.get("apigetagents").subscribe((res:any)=>{
    console.log(res)
    res.data.forEach(item =>{
      this.agents.push( { 
        id: item.id,
        fullName: item.name,
        desc: item.description,            
        organization: item.comanyName,
        email: item.primaryEmail,
        phone: item.phone,
        social: {
          
          skype: item.skype,
          whatsapp: item.whatsapp,
          website: item.website
        },
        ratingsCount: 6,
        ratingsValue: 480,
        image:`${environment.crmurl}${item.image} `
    },)
    })
    console.log("res",this.agents)
  })
}

}
