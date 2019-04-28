import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isVisible = false;
  Namevalue = 'my-cluster';
  Numvalue  = 3;
  NotifyString = 'Cluster '+ this.Namevalue +'  is starting.....';

  constructor(private notification: NzNotificationService,private http: HttpClient) {}

  showModal(): void {
    this.isVisible = true;
  }

  delete(): void {
    this.http.delete("/api/v1/cluster")
    .subscribe( 
      data => { 
      console.log("DELETE Request is successful ", data); 
      }, 
      error => { 
      console.log("Error", error); 
      } 
      ); 
    
  }

  handleOk(): void {
    console.log('Button ok clicked!');
    console.log(this.Namevalue,this.Numvalue);

    this.notification.create(
      'success',
      'Cluster Notifiation',
      this.NotifyString
    );
    this.isVisible = false;

    this.http.put("/api/v1/cluster",
    {"name": this.Namevalue,
     "num": this.Numvalue
     },httpOptions)
    .subscribe(
      data => {
        console.log("POST Req is successful",data);
      },
      error => {
        console.log("Error",error)
      }
    )

  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}
