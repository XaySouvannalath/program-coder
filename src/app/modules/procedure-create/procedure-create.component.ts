import { Component, OnInit } from '@angular/core';
import { CallApiService } from 'src/app/shares/services/call-api.service';
import { ClipboardService } from 'ngx-clipboard';
import { filter } from 'rxjs/operators'
import * as _ from 'lodash'
import { HighlightResult } from 'ngx-highlightjs';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-procedure-create',
  templateUrl: './procedure-create.component.html',
  styleUrls: ['./procedure-create.component.css']
})
export class ProcedureCreateComponent implements OnInit {

  tables
  table_name
  column_name: any;
  new_column_name: any[];
  isSelectTable = false
  isGenerateCode = false
  check_all_params = false

  create_array = []
  procedure_type = 'CREATE'

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
    this.create_array = []
    this.table_name = table
    this._api.getCulumns(this.table_name).subscribe(res => {
      this.column_name = []
      this.column_name = res.data
      console.log(this.column_name)
      for (var i = 0; i < this.column_name.length; i++) {
        this.create_array.push({
          COLUMN_NAME: this.column_name[i].COLUMN_NAME,
          isChecked: false,
          isParamsChecked: false,
          isValueChecked: false,
          defaultValue: ''
        })
      }
      console.log(this.create_array)
    })
  }
  _generateProcedureName() {
    // formate: PC_PRODUCTS_CREATE
    if (this.table_name)
      return 'PC_' + this.table_name.substr(4, this.table_name.length - 4) + '_' + this.procedure_type

  }

  _parameter_check_all() {

    if (this.paramsChecked == false) {
      this.create_array.map(column => {
        column.isParamsChecked = true
      })
      this.paramsChecked = true
    } else {
      this.create_array.map(column => {
        column.isParamsChecked = false
      })
      this.paramsChecked = false
    }
  }
  _parameter_check_single(index) {
    this.indeterminate = true
    this.create_array[index].isParamsChecked = !this.create_array[index].isParamsChecked
  }
  _insert_record_check_all() {
    if (this.valueChecked == false) {
      this.create_array.map(column => {
        column.isValueChecked = true
      })
      this.valueChecked = true
    } else {
      this.create_array.map(column => {
        column.isValueChecked = false
      })
      this.valueChecked = false
    }
  }
  _value_check_single(index) {
    this.indeterminate_value = true
    this.create_array[index].isValueChecked = !this.create_array[index].isValueChecked
  }
  _add_default_value(index, value) {
    this.create_array[index].defaultValue = value
  }

  paramters = []
  insert_record = []
  default_value = []
  _generate_parameter() {
    this.paramters = []
    for (var i = 0; i < this.create_array.length; i++) {
      if (this.create_array[i].isParamsChecked) {
        if (this.create_array[i].COLUMN_NAME != "ID") {
          if (i == 0) {
            this.paramters.push('P_' + this.create_array[i].COLUMN_NAME + ' ' + this.table_name + '.' + this.create_array[i].COLUMN_NAME + '%TYPE')
          }
          else {
            this.paramters.push('\n          P_' + this.create_array[i].COLUMN_NAME + ' ' + this.table_name + '.' + this.create_array[i].COLUMN_NAME + '%TYPE')
          }
        }
      }
    }
  }

  _generate_insert_record() {
    this.insert_record = []
    for (var i = 0; i < this.create_array.length; i++) {
      if (this.create_array[i].isValueChecked) {
        if (i == 0) {
          this.insert_record.push(this.create_array[i].COLUMN_NAME)
        } else {
          this.insert_record.push('\n         ' + this.create_array[i].COLUMN_NAME)
        }
      }
    }
    console.log(this.insert_record)
  }
  _generate_default_value() {
    this.default_value = []
    for (var i = 0; i < this.create_array.length; i++) {
      if (this.create_array[i].COLUMN_NAME == 'ID') {
        this.default_value.push('V_ID')
      } else {
        if (this.create_array[i].defaultValue != '') {
          if (i == 1) {
            this.default_value.push(this.create_array[i].defaultValue)
          } else {
            this.default_value.push('\n          ' + this.create_array[i].defaultValue)
          }
        } else {
          this.default_value.push('\n          P_' + this.create_array[i].COLUMN_NAME)
        }
      }
    }
  }
  code
  response: HighlightResult
  _generate_create() {
    this.isGenerateCode = true
    this._generate_parameter()
    this._generate_insert_record()
    this._generate_default_value()

    this.code =
      `
CREATE OR REPLACE PROCEDURE \"${this._generateProcedureName()}\"
(
          ${this.paramters},
          P_ROW OUT NUMBER
)
AS
    V_ID NUMBER(10);
BEGIN
    V_ID := FN_GET_MAX_ID(\'${this.table_name}\'); 
INSERT INTO ${this.table_name}
(
          ${this.insert_record}
)
VALUES
(
          ${this.default_value}
);
  P_ROW := SQL%ROWCOUNT;
END;
`


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
    this._snackBar.open("Copied!", "", {
      duration: 2000,
    });
    this._clipBoardService.copyFromContent(this.code)
  }
}
