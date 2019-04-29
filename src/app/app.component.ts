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
  activecluster = 0;
  activenodes = 0;

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
    {"clustername": this.Namevalue,
     "clustersize": String(this.Numvalue)
     },httpOptions)
    .subscribe(
      data => {
       
        // var str  = `{"name":"jon","age":30,"city":"dd DD"}`
        // var txt = JSON.parse(str)
        var json = JSON.stringify(data)
        var txt = JSON.parse(json)
        this.activecluster =txt.clustercount
        this.activenodes = txt.nodescount
        console.log(txt.clustercount)
        console.log(txt.nodescount)

        // console.log("POST Req is successful",data);

    
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
