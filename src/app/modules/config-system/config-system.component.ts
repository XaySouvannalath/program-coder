import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash'
@Component({
  selector: 'app-config-system',
  templateUrl: './config-system.component.html',
  styleUrls: ['./config-system.component.css']
})
export class ConfigSystemComponent implements OnInit {

  ok = 'Hello my name is saiyavong'  
  constructor() { }
   users = [
    { 'user': 'barney', 'age': 36, 'active': true },
    { 'user': 'fred',   'age': 40, 'active': false }
  ];
   

  
  ngOnInit() {

    let newobj = _.filter(this.users, (o) =>{
        return !o.active
    })
    let fred = _.filter(this.users, (f)=>{
      return f.user == 'fred'
    })


  
    console.log(newobj)
    console.log(fred)
  }

}
