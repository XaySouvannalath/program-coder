import { Component, OnInit, ContentChild } from '@angular/core';
import { CallApiService } from 'src/app/shares/services/call-api.service';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material';
import * as _ from 'lodash'
import { HighlightResult } from 'ngx-highlightjs';
@Component({
  selector: 'app-generate-angular',
  templateUrl: './generate-angular.component.html',
  styleUrls: ['./generate-angular.component.css']
})
export class GenerateAngularComponent implements OnInit {
  response: HighlightResult
  tables
  table_name
  column_name
  obj = []


  checkPost = false; checkPut = false; checkBody = false; checkHead = false
  manualPost = false; manualPut = false; manualBody = false; manualHead = false
  code_service
  code_ts
  code_html
  code_model_interface
  code_model_class
  code_table_head
  constructor(
    private _api: CallApiService,
    private _clipBoardService: ClipboardService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this._getTable()


  }
  onHighlight(e) {
    this.response = {
      language: e.language,
      r: e.r,
      second_best: '{...}',
      top: '{...}',
      value: '{...}'
    }
  }
  copy(codeIn: string) {
    this._snackBar.open("Copied!", "", {
      duration: 2000,
    });
    this._clipBoardService.copyFromContent(codeIn)
  }
  _getTable() {
    this._api.getTableName().subscribe(res => {
      this.tables = res.data
    })
  }
  _onSelectTable(table) {
    this.column_name = null
    this.obj = []
    this.table_name = table
    this._api.getCulumns(this.table_name).subscribe(res => {
      this.column_name = []
      this.column_name = res.data
      console.log(this.column_name)
      for (var i = 0; i < this.column_name.length; i++) {
        this.obj.push({
          name: this.column_name[i].COLUMN_NAME,
          post: false,
          put: false,
          bd: false,
          th: false
        })
      }
      console.log(this.obj)
    })
  }
  // ---------------------------------------check all
  checkAllPost() {
    if (this.checkPost == false) {
      this.obj.map(column => {
        column.post = true
      })
      this.checkPost = true
    } else {
      this.obj.map(column => {
        column.post = false
      })
      this.checkPost = false
    }
  }
  checkAllPut() {
    if (this.checkPut == false) {
      this.obj.map(column => {
        column.put = true
      })
      this.checkPut = true
    } else {
      this.obj.map(column => {
        column.put = false
      })
      this.checkPut = false
    }
  }
  checkAllBody() {
    if (this.checkBody == false) {
      this.obj.map(column => {
        column.bd = true
      })
      this.checkBody = true
    } else {
      this.obj.map(column => {
        column.bd = false
      })
      this.checkBody = false
    }
  }
  checkAllHead() {
    if (this.checkHead == false) {
      this.obj.map(column => {
        column.th = true
      })
      this.checkHead = true
    } else {
      this.obj.map(column => {
        column.th = false
      })
      this.checkHead = false
    }
  }
  // ---------------------------------------check one
  checkOnePost(index) {
    this.manualPost = true
    this.obj[index].post = !this.obj[index].post
  }
  checkOnePut(index) {
    this.manualPut = true
    this.obj[index].put = !this.obj[index].put
  }
  checkOneBody(index) {
    this.manualBody = true
    this.obj[index].bd = !this.obj[index].bd
  }
  checkOneHead(index) {
    this.manualHead = true
    this.obj[index].th = !this.obj[index].th
  }
  // ---------------------------------------generate code
  generateComponent() {
    this.code_ts=
  `
  displayedColumns: string [] = ${this.generateTableHeadName()}
  dataSource: MatTableDataSource<${this.generateInterfaceName()}Body>
  model_post = new ModelPost()
  model_put = new ModelPut()
  datas
  model_type = true
  @ViewChild(MatPaginator) paginator: MatPaginator
  @ViewChild(MatSort) sort: MatSort
  
  ngOnInit(){
    this.get()
  }
  get(){
    this._service._get().subscribe(res=>{
      if(res.success){
        this.datas = res.data
        this.dataSource = new MatTableDataSource(this.datas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  post(){
    this._service._get().subscribe(res=>{
      if(res.success){
        this.datas = res.data
        this.dataSource = new MatTableDataSource(this.datas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    })
  }
  put(){
    this._service._post(this.model_post).subscribe(res=>{
      if(res.success){
        this.get()
        this.clear()
      }
    })
  }
  clear(){
    this.model_post = new postFormula('','','','','','')
    this.model_put = new putFormula('','','','','','','')
    this.model_type = true
  }
  search(filterValue: string){
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  get_row(){
    this.model_type = false
    ${this.column_assign_put.join("")}
  }
  `
  }
  generateService() {
    this.code_service =
  `
  constructor(
    private: _http: HttpClient,
    private: _constService: ConstService
  ){}
  _get(): Observable<${this.generateInterfaceName()}>{
    return this._http.get<any>(this._constService.${this.generateAPILink()})
  }
  _post(data): Observable<iResponses>{
    return this._http.post<any>(this._constService.${this.generateAPILink()}, data)
  }
  _put(data): Observable<iResponses>{
    return this._http.put<any>(this._constService.${this.generateAPILink()}, data)
  }
  `
  }
  interface_column = []
  generateInterfaceModel() {
    this.interface_column = []
    for (var i = 0; i < this.obj.length; i++) {
      console.log(this.obj[i].bd)
      if (this.obj[i].bd == true) {
        if (i == 0) {
          this.interface_column.push(this.obj[i].name + ": string;" + "\n")
        } else {
          this.interface_column.push('      ' + this.obj[i].name + ": string;" + "\n")
        }
      }
    }
    this.code_model_interface =
      `
  export interface ${this.generateInterfaceName()}{
      success: boolean;
      data: ${this.generateInterfaceName()}Body;
  }
  export interface  ${this.generateInterfaceName()}Body{
      ${this.interface_column.join("")}
  }
  `
  }
  class_column_post = []
  class_column_put = []
  generateClassModel() {
    this.class_column_post = []
    this.class_column_put = []
    for (var i = 0; i < this.obj.length; i++) {
      if (this.obj[i].post == true) {
        if (i == 0) {
          this.class_column_post.push('public ' + this.obj[i].name + ": string")
        } else {
          this.class_column_post.push('\n      public ' + this.obj[i].name + ": string")
        }
      }
    }

    for (var i = 0; i < this.obj.length; i++) {
      if (this.obj[i].put == true) {
        if (i == 0) {
          this.class_column_put.push('public ' + this.obj[i].name + ": string")
        } else {
          this.class_column_put.push('\n      public ' + this.obj[i].name + ": string")
        }
      }
    }
    console.log(this.interface_column)
    this.code_model_class =
      `
  export class ModelPost{
    constructor(
      ${this.class_column_post}
    ){}
  }
  export class ModelPut{
    constructor(
      ${this.class_column_put}
    ){}
  }
  `
  }
  head_column = []
  generateHead(){
    this.head_column = []
    for (var i = 0; i < this.obj.length; i++) {
      if (this.obj[i].th == true) {
        if (i == 0) {
          this.head_column.push('\"' + this.obj[i].name + '\"')
        } else {
          this.head_column.push('\n    \"' + this.obj[i].name + '\"')
        }
      }
    }
    this.code_table_head=
  `
  export const ${this.generateTableHeadName()} = [
    ${this.head_column}
  ]
  `
  }


  



  //--------------------------------------utilities
  generateInterfaceName() {
    let tableName = this.table_name.substr(4, this.table_name.length - 4)
    let firstLetter = _.upperCase(tableName.substr(0, 1))
    let restLetter = (tableName.substr(1, tableName.length - 1)).toLowerCase()
    return "i" + firstLetter + restLetter
  }
  generateTableHeadName() {
    let tableName = this.table_name.substr(4, this.table_name.length - 4)
    let firstLetter = _.upperCase(tableName.substr(0, 1))
    let restLetter = (tableName.substr(1, tableName.length - 1)).toLowerCase()
    return 'th' + firstLetter + restLetter
  }
  generateAPILink(){
    let tableName = this.table_name.substr(4, this.table_name.length - 4)
    return tableName.toLowerCase()
  }
  column_assign_put = []
  generatePutRow(){
    this.column_assign_put = []
    for (var i = 0; i < this.obj.length; i++) {
      if (this.obj[i].put == true) {
        if (i == 0) {
          this.column_assign_put.push('this.model_put.' + this.obj[i].name + " = row." + this.obj[i].name)
        } else {
          this.column_assign_put.push('\n    ' + 'this.model_put.' + this.obj[i].name + " = row." + this.obj[i].name)
        }
      }
    }
  }


  column_html = []
  generateCodeHtml(){
    this.column_html = []
    for (var i = 0; i < this.obj.length; i++) {
      if (this.obj[i].bd == true) {
        if (i == 0) {
          this.column_html.push(`<mat-form-field><input matInput required [(ngModel)]=\"model.${this.obj[i].name}\"  name=\"${ this.obj[i].name}\"   #${this.obj[i].name}=\"ngModel\"></mat-form-field>\n`)
        } else {
          this.column_html.push(`<mat-form-field><input matInput required [(ngModel)]=\"model.${this.obj[i].name}\"  name=\"${ this.obj[i].name}\"   #${this.obj[i].name}=\"ngModel\"></mat-form-field>\n`)
        }
      }
    }

   
    this.code_html=
  `
  
${this.column_html.join("")}
 
  `
    
      console.log(this.column_html)
  }

// execute all generation coder
  generate() {
    this.generateInterfaceModel()
    this.generateClassModel() 
    this.generateHead()
    this.generateService()
    this.generatePutRow()
    this.generateComponent()
    this.generateCodeHtml()
  }
}
