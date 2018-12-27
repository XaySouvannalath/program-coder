import { Component, OnInit } from '@angular/core';
import { CallApiService } from 'src/app/shares/services/call-api.service';
import { ClipboardService } from 'ngx-clipboard';
import { MatSnackBar } from '@angular/material';
import { HighlightResult } from 'ngx-highlightjs';

@Component({
  selector: 'app-procedure-update',
  templateUrl: './procedure-update.component.html',
  styleUrls: ['./procedure-update.component.css']
})
export class ProcedureUpdateComponent implements OnInit {

  tables
  table_name
  column_name: any;
  new_column_name: any[];
  isSelectTable = false
  isGenerateCode = false
  check_all_params = false

  update_array = []
  procedure_type = 'UPDATE'

  indeterminate = false
  indeterminate_value = false
  paramsChecked = false
  valueChecked = false
  constructor(
    private _api: CallApiService,
    private _clipBoardService: ClipboardService,
    private _snackBar: MatSnackBar
  ) { }


  ngOnInit() {
    this._getTable()
  }


  _getTable() {
    this._api.getTableName().subscribe(res => {
      this.tables = res.data
    })
  }

  _onSelectTable(table) {
    this.isGenerateCode = false
    this.isSelectTable = true
    console.log('heelo world')
    this.column_name = null
    this.update_array = []
    this.table_name = table
    this._api.getCulumns(this.table_name).subscribe(res => {
      this.column_name = []
      this.column_name = res.data
      console.log(this.column_name)
      for (var i = 0; i < this.column_name.length; i++) {
        this.update_array.push({
          COLUMN_NAME: this.column_name[i].COLUMN_NAME,
          isChecked: false,
          isParamsChecked: false,
          isValueChecked: false,
          defaultValue: ''
        })
      }
    })
  }
  _generateProcedureName() {
    // formate: PC_PRODUCTS_CREATE
    if (this.table_name)
      return 'PC_' + this.table_name.substr(4, this.table_name.length - 4) + '_' + this.procedure_type

  }
  _add_default_value(index, value) {
    this.update_array[index].defaultValue = value
  }

  _parameter_check_all() {

    if (this.paramsChecked == false) {
      this.update_array.map(column => {
        column.isParamsChecked = true
      })
      this.paramsChecked = true
    } else {
      this.update_array.map(column => {
        column.isParamsChecked = false
      })
      this.paramsChecked = false
    }
  }
  _parameter_check_single(index) {
    this.indeterminate = true
    this.update_array[index].isParamsChecked = !this.update_array[index].isParamsChecked
  }
  _insert_record_check_all() {
    if (this.valueChecked == false) {
      this.update_array.map(column => {
        column.isValueChecked = true
      })
      this.valueChecked = true
    } else {
      this.update_array.map(column => {
        column.isValueChecked = false
      })
      this.valueChecked = false
    }
  }
  _value_check_single(index) {
    this.indeterminate_value = true
    this.update_array[index].isValueChecked = !this.update_array[index].isValueChecked
  }

  value_update = []
  _generateProcedureUpdateAssigment() {
    this.value_update = []
    for (var i = 0; i < this.update_array.length; i++) {
      if (this.update_array[i].isValueChecked) {
        if (this.update_array[i].COLUMN_NAME != 'ID') {
          if (i == 0) {
            this.value_update.push(this.update_array[i].COLUMN_NAME + '=P_' + this.update_array[i].COLUMN_NAME)
          } else {
            if (this.update_array[i].COLUMN_NAME == 'CLOSE_DATE') {
              this.value_update.push('\n          ' + 'CLOSE_DATE' + '=V_CLOSE_DATE')
            } else if (this.update_array[i].COLUMN_NAME == 'CLOSE_USER_ID') {
              this.value_update.push('\n          ' + 'CLOSE_USER_ID' + '=V_CLOSE_USER_ID')
            } else {
              
                this.value_update.push('\n          ' + this.update_array[i].COLUMN_NAME + '=P_' + this.update_array[i].COLUMN_NAME)
              
            }
          } 
        }
       
      }
/*       if (i == this.update_array.length - 1) {
        this.value_update.push('\n         ')
      } */
    }
  }


  paramters = []

  _generate_parameter() {
    this.paramters = []
    for (var i = 0; i < this.update_array.length; i++) {
      if (this.update_array[i].isParamsChecked) {

        if (i == 0) {
          this.paramters.push('P_' + this.update_array[i].COLUMN_NAME + ' ' + this.table_name + '.' + this.update_array[i].COLUMN_NAME + '%TYPE')
        }
        else {
          this.paramters.push('\n          P_' + this.update_array[i].COLUMN_NAME + ' ' + this.table_name + '.' + this.update_array[i].COLUMN_NAME + '%TYPE')
        }
      }

    }
  }

  _generate_create() {
    this.isGenerateCode = true
    this._generateProcedureUpdateAssigment()
    this._generate_parameter()
    this.code =
      `
CREATE OR REPLACE 
PROCEDURE \"${this._generateProcedureName()}\"(
        ${this.paramters},
        P_ROW OUT NUMBER
) AS
  V_CLOSE_DATE DATE := NULL;
  V_CLOSE_USER_ID VARCHAR2(50) := NULL;
BEGIN
  IF P_RECORD_STAT = 'C' THEN
      V_CLOSE_DATE := SYSDATE;
      V_CLOSE_USER_ID := P_CLOSE_USER_ID;
  END IF;
  UPDATE ${this.table_name} SET
        ${this.value_update}
        WHERE ID = P_ID;
P_ROW := SQL%ROWCOUNT;
END;
`


  }



  code
  response: HighlightResult
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
    this._snackBar.open("Copied!", "", {
      duration: 2000,
    });
    this._clipBoardService.copyFromContent(this.code)
  }
}
