import { iColumn } from './../../shares/models/all-models';
import { CallApiService } from './../../shares/services/call-api.service';
import { Component, OnInit } from '@angular/core';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { log } from 'util';
import { HighlightResult } from 'ngx-highlightjs';
import { ClipboardService } from 'ngx-clipboard'
import { map, mergeMap } from 'rxjs/operators';
import { Logs } from 'selenium-webdriver';
export interface procedureParameter {
  ParameterName: string
}
@Component({
  selector: 'app-generate-procedure',
  templateUrl: './generate-procedure.component.html',
  styleUrls: ['./generate-procedure.component.css']
})
export class GenerateProcedureComponent implements OnInit {
  panelOpenState = false;
  constructor(
    private _api: CallApiService,
    private _clipBoardService: ClipboardService
  ) { }
  tables
  table_name
  column_name
  new_column_name = []
  new_column_for_create = []
   check_all
  check_none
  check_manual

  procedure_type = 'CREATE'
  procedure_parameter_for_create = []
  procedure_parameter_for_update = []
  procedure_parameter_column = []
  procedure_parameter_value = []
  procedure_update_assignment = []



  // all new variable

  //for create 
  create_parameter = []
  create_insert_record = []
  create_insert_value = []

  //for update

  

  ngOnInit() {
    this._getTable()
  }

  _getTable() {
    this._api.getTableName().subscribe(res => {
      this.tables = res.data
    })
  }

  _onSelectTable(table) {
    console.log('heelo world')
    this.column_name = null
    this.new_column_name = []
    this.table_name = table
    this._api.getCulumns(this.table_name).subscribe(res => {
      this.column_name = []
      this.column_name = res.data
      console.log(this.column_name)
      for (var i = 0; i < this.column_name.length; i++) {
        this.new_column_name.push({
          COLUMN_NAME: this.column_name[i].COLUMN_NAME,
          isChecked: false,
          defaultValue: ''
        })
      }
    })
  }
  _onClickTable(tableName) {
    this.column_name = null
    this.new_column_name = []
    this._api.getCulumns(tableName).subscribe(res => {
      console.log(res)
      this.column_name = res.data
      for (var i = 0; i < this.column_name.length; i++) {
        this.new_column_name.push({
          COLUMN_NAME: this.column_name[i].COLUMN_NAME,
          isChecked: false,
          defaultValue: ''
        })
      }
    })
  }
  _onEditDefaultValue(value, index) {
    this.new_column_name[index].defaultValue = value
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

  copy(text: string) {
    this._clipBoardService.copyFromContent(this.code)
  }


  // for test  checked columns

  checked_column;

  _checkIndividual(index) {
    this.check_all = false
    this.check_none = false
    this.check_manual = true

    this.new_column_name[index].isChecked ? this.new_column_name[index].isChecked = false : this.new_column_name[index].isChecked = true
    this.checked_column = this.new_column_name.filter((column) => column.isChecked == true)
  }
  _checkAll() {
    this.check_all = true
    this.check_none = false
    this.check_manual = false
    this.new_column_name.map(column => {
      column.isChecked = true
    })
    this.checked_column = this.new_column_name.filter((column) => column.isChecked == true)
  }
  _manualCheck() {
    this.check_all = false
    this.check_none = false
    this.check_manual = true

    this.new_column_name.map(column => {
      column.isChecked = false
    })
    this.checked_column = this.new_column_name.filter((column) => column.isChecked == true)
  }
  _uncheckAll() {
    this.check_all = false
    this.check_none = true
    this.check_manual = false

    this.new_column_name.map(column => {
      column.isChecked = false
    })
  }
  _generateProcedureName() {
    // formate: PC_PRODUCTS_CREATE
    if (this.table_name)
      return 'PC_' + this.table_name.substr(4, this.table_name.length - 4) + '_' + this.procedure_type

  }
  _generateProcedureParameterForCreate() {
    this.procedure_parameter_for_create = []
    for (var i = 0; i < this.checked_column.length; i++) {
      if(this.checked_column[i].COLUMN_NAME != "ID")
      {
        if(i==0){
          this.procedure_parameter_for_create.push('P_' + this.checked_column[i].COLUMN_NAME + ' ' + this.table_name + '.' + this.checked_column[i].COLUMN_NAME + '%TYPE')
        }
        else{
          this.procedure_parameter_for_create.push('\n          P_' + this.checked_column[i].COLUMN_NAME + ' ' + this.table_name + '.' + this.checked_column[i].COLUMN_NAME + '%TYPE')
   
        }
      }
    }
  }
  _generateProcedureParameterForUpdate() {
    this.procedure_parameter_for_update = []
    for (var i = 0; i < this.checked_column.length; i++) {
      if(i==0){
        this.procedure_parameter_for_update.push('P_' + this.checked_column[i].COLUMN_NAME + ' ' + this.table_name + '.' + this.checked_column[i].COLUMN_NAME + '%TYPE')
      }else{
        this.procedure_parameter_for_update.push('\n          P_' + this.checked_column[i].COLUMN_NAME + ' ' + this.table_name + '.' + this.checked_column[i].COLUMN_NAME + '%TYPE')
      }
    }
  }
  _generateColumnForProcedure() {
    this.procedure_parameter_column = []
    for (var i = 0; i < this.new_column_name.length; i++) {
      if(i==0){
        this.procedure_parameter_column.push(this.new_column_name[i].COLUMN_NAME)
      }else{
        this.procedure_parameter_column.push('\n         ' + this.new_column_name[i].COLUMN_NAME)
      }
    }
  }
  _generateProcedureValue(){
    this.procedure_parameter_value = []
    for (var i = 0; i < this.new_column_name.length; i++) {
      if(i == 0){
        this.procedure_parameter_value.push('V_ID')
      }else{
        if(this.new_column_name[i].defaultValue != ''){
          if(i==1){
            this.procedure_parameter_value.push(this.new_column_name[i].defaultValue)
          }else{
            this.procedure_parameter_value.push('\n          ' +this.new_column_name[i].defaultValue)
          }
        }else{
          this.procedure_parameter_value.push('\n          P_' +this.new_column_name[i].COLUMN_NAME)
        }
      }
    }
  }
  _generateProcedureUpdateAssigment(){
    this.procedure_update_assignment = []
    for (var i = 0; i < this.new_column_name.length; i++) {
      if(this.new_column_name[i].COLUMN_NAME != 'ID'){
        if(i==0){
          this.procedure_update_assignment.push(this.new_column_name[i].COLUMN_NAME + '=P_' + this.new_column_name[i].COLUMN_NAME)
        }else{
          if(this.new_column_name[i].COLUMN_NAME == 'CLOSE_DATE'){
            this.procedure_update_assignment.push('\n          ' +'CLOSE_DATE'+ '=V_CLOSE_DATE')
          }else if(this.new_column_name[i].COLUMN_NAME == 'CLOSE_USER_ID'){
            this.procedure_update_assignment.push('\n          ' + 'CLOSE_USER_ID' + '=V_CLOSE_USER_ID')
          }else{
            this.procedure_update_assignment.push('\n          ' + this.new_column_name[i].COLUMN_NAME + '=P_' + this.new_column_name[i].COLUMN_NAME)
          }
        }
      }
      if(i== this.new_column_name.length - 1){
        this.procedure_update_assignment.push('\n          WHERE ID = P_ID')
      }
    }
  }
  response: HighlightResult;
  code
  _onGenerate() {
    console.log(this.checked_column)
    this._generateProcedureParameterForCreate()
    this._generateProcedureParameterForUpdate()
    this._generateColumnForProcedure()
    this._generateProcedureValue()
    this._generateProcedureUpdateAssigment()
    console.log(this.procedure_parameter_value)
    this.procedure_type == 'CREATE' ?
    this.code = `
CREATE OR REPLACE 
PROCEDURE \"${this._generateProcedureName()}\"
(
          ${this.procedure_parameter_for_create}
) AS
    V_ID NUMBER(10);
BEGIN
    V_ID := FN_GET_MAX_ID(\'${this.table_name}\'); 
INSERT INTO ${this.table_name}(
          ${this.procedure_parameter_column}
)
VALUES(
          ${this.procedure_parameter_value}
)
END;

    ` :

this.code = 
`
CREATE OR REPLACE 
PROCEDURE \"${this._generateProcedureName()}\"(
          ${this.procedure_parameter_for_update}
          P_ROW OUT NUMBER
) AS
    V_CLOSE_DATE DATE := NULL;
    V_CLOSE_USER_ID VARCHAR2(50) := NULL;
BEGIN
    IF P_RECORD_STAT = 'C' THEN
        V_CLOSE_DATE := SYSDATE;
        V_CLOSE_USER_ID := P_MAKER_ID;
    END IF;
    UPDATE ${this.table_name} SET
          ${this.procedure_update_assignment}
  P_ROW := SQL%ROWCOUNT;
END;
`
  } 
  

}

