import { Component } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd';
import { HttpClient, HttpHeaders } from '@angular/common/http';



// Cluster is the information ngfor show in cluster collection
class Cluster {
  clustername: string; 
  masterport: number;
  nodescount: number;
  createtime: string;
}

// Statistic is the data to refresh the Cluster overview
class Statistic {
  activecluster: number;
  activenodes: number;
}

//for http head of content type
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  clusters: Cluster[];
  isVisible = false;

  //default value for create cluster
  Namevalue = 'my-cluster';
  Numvalue  = 3;

  //default value for statisctic
  activecluster = 0;
  activenodes = 0;
 


  constructor(private notification: NzNotificationService,private http: HttpClient) {}

  ngOnInit() {

    // refresh the statistic
    this.http.get<Statistic>("api/v1/cluster/statistic")
    .subscribe( stat => {this.activecluster = stat.activecluster;
                         this.activenodes = stat.activenodes;});

    //refresh the cluster collection
    this.http.get<Cluster[]>("/api/v1/cluster").subscribe(  clusters => this.clusters = clusters);
  }

  showModal(): void {
    this.isVisible = true;
  }

  onDelete( cluster: { clustername: string; }): void {

    console.log("name :",cluster.clustername)
    this.http.delete("/api/v1/cluster/"+cluster.clustername)
    .subscribe( 
      data => { 

        this.http.get<Statistic>("api/v1/cluster/statistic")
        .subscribe( stat => {this.activecluster = stat.activecluster;
                             this.activenodes = stat.activenodes;});

        this.http.get<Cluster[]>("/api/v1/cluster")
        .subscribe( clusters => this.clusters = clusters)

      console.log("DELETE Request is successful ", data); 
      }, 
      error => { 
      console.log("Error", error); 
      } 
      ); 
    
  }

  // process the creating a new cluster dialog close with OK
  handleOk(): void {

    // send a notify msg and close the dialog
    let NotifyString =  this.Namevalue +'  is starting.....';
    this.notification.create(
      'success',
      'Cluster Notifiation',
      NotifyString
    );
    this.isVisible = false;


   //put a create request  to server ,after respones , refresh the statistics and cluster collection
    this.http.put("/api/v1/cluster",
    {"clustername": this.Namevalue,
     "clustersize": String(this.Numvalue)
     },httpOptions)
    .subscribe(
      data => {
        // var json = JSON.stringify(data)
        // var txt = JSON.parse(json)
        // this.activecluster =txt.clustercount
        // this.activenodes = txt.nodescount

        this.http.get<Statistic>("api/v1/cluster/statistic")
        .subscribe( stat => {this.activecluster = stat.activecluster;
                             this.activenodes = stat.activenodes;});

        this.http.get<Cluster[]>("/api/v1/cluster")
        .subscribe( clusters => this.clusters = clusters)

        console.log("POST Req is successful",data);
      },
      error => {
        console.log("Error",error)
      }
    )


  }

  // process Cancle event
  handleCancel(): void {
 
    this.isVisible = false;
  }
}
