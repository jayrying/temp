import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs'; 
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppService } from 'src/app/app.service'; 
import { Settings, AppSettings } from 'src/app/app.settings'; 
import { Property, Pagination } from 'src/app/app.models'; 
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-agent',
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentComponent implements OnInit {
  private sub: any;
  public agent:any={
        
    id:0,
    fullName: '',
    desc: '',            
    organization: '',
    email: '',
    phone: '',
    social: {
      
      skype: '',
      whatsapp: '',
      website: ''
    },
    ratingsCount: 6,
    ratingsValue: 480,
    image:` `

};
  public agentId: any;
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen:boolean = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation:true
  };
  public properties: Property[];
  public viewType: string = 'grid';
  public viewCol: number = 33.3;
  public count: number = 12;
  public sort: string;
  public searchFields: any;
  public removedSearchField: string;
  public pagination:Pagination = new Pagination(1, this.count, null, 2, 0, 0); 
  public message:string;
  public watcher: Subscription;
  public settings: Settings
  public contactForm: FormGroup;

  constructor(public appSettings:AppSettings, 
              public appService:AppService, 
              private activatedRoute: ActivatedRoute, 
              public mediaObserver: MediaObserver,
              public fb: FormBuilder,
              public apiservice:ApiService) {
    this.settings = this.appSettings.settings;    
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => { 
      if (change.mqAlias == 'xs') {
        this.sidenavOpen = false;
        this.viewCol = 100;
      }
      else if(change.mqAlias == 'sm'){
        this.sidenavOpen = false;
        this.viewCol = 50;
      }
      else if(change.mqAlias == 'md'){
        this.viewCol = 50;
        this.sidenavOpen = true;
      }
      else{
        this.viewCol = 33.3;
        this.sidenavOpen = true;
      }
    });
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => { 
      
      this.agentId = params['id'];
      this.getAgentById(params['id']); 
      this.getProperties();
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.watcher.unsubscribe();
  } 

  public getAgentById(id){
    // this.apiservice.post(`apigetagent?agentid=${id}`,id).subscribe((item:any)=>{

    //   this.agent={
        
    //       id: item.data.id,
    //       fullName: item.data.name,
    //       desc: item.data.description,            
    //       organization: item.data.comanyName,
    //       email: item.data.primaryEmail,
    //       phone: item.data.phone,
    //       social: {
            
    //         skype: item.data.skype,
    //         whatsapp: item.data.whatsapp,
    //         website: item.data.website
    //       },
    //       ratingsCount: 6,
    //       ratingsValue: 480,
    //       image:`${environment.crmurl}${item.data.image} `
      
    //   }
    //   console.log("item",this.agent)

    // })
    this.agent = this.appService.getAgents().filter(agent=> agent.id == id)[0]; 
  }
   

  public getProperties(){   
    this.appService.getPropertiesByAgentId(this.agentId).subscribe(data => { 
      let result = this.filterData(data); 
      if(result.data.length == 0){
        this.properties.length = 0;
        this.pagination = new Pagination(1, this.count, null, 2, 0, 0);  
        this.message = 'No Results Found';
        return false;
      } 
      this.properties = result.data; 
      this.pagination = result.pagination;
      this.message = null;
    })
  }

  public resetPagination(){ 
    if(this.paginator){
      this.paginator.pageIndex = 0;
    }
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  public filterData(data){
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }

  public searchClicked(){ 
    this.properties.length = 0;
    this.getProperties(); 
    window.scrollTo(0,0);  
  }
  public searchChanged(event){
    event.valueChanges.subscribe(() => {   
      this.resetPagination(); 
      this.searchFields = event.value;
      setTimeout(() => {      
        this.removedSearchField = null;
      });
      if(!this.settings.searchOnBtnClick){     
        this.properties.length = 0;  
      }            
    }); 
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => { 
      if(!this.settings.searchOnBtnClick){     
        this.getProperties(); 
      }
    });       
  } 
  public removeSearchField(field){ 
    this.message = null;   
    this.removedSearchField = field; 
  } 


  public changeCount(count){
    this.count = count;   
    this.properties.length = 0;
    this.resetPagination();
    this.getProperties();
  }
  public changeSorting(sort){    
    this.sort = sort; 
    this.properties.length = 0;
    this.getProperties();
  }
  public changeViewType(obj){ 
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol; 
  } 


  public onPageChange(e){ 
    this.pagination.page = e.pageIndex + 1;
    this.getProperties();
    window.scrollTo(0,0);  
  }

  public onContactFormSubmit(values:any,agentid){
    if (this.contactForm.valid) { 
      let obj={
        agentid:agentid,
        email:values.email,
        message: values.message,
        phone:values.phone,
        name:values.name
      }
      console.log(obj);

      this.apiservice.post(`apipostagenctinquiryfromwebiste?agentid=${agentid}&email=${values.email}&message=${values.message}&name=${values.name}`,obj).subscribe((res:any)=>{
        console.log("res",res)
      })
    } 
  }

}