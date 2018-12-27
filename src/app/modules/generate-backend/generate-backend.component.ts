import { Component, OnInit } from '@angular/core';
import { CallApiService } from 'src/app/shares/services/call-api.service';
import { ClipboardService } from 'ngx-clipboard';
import { HighlightResult } from 'ngx-highlightjs';
import { pipe } from 'rxjs';
import { log } from 'util';
import * as _ from 'lodash'
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-generate-backend',
  templateUrl: './generate-backend.component.html',
  styleUrls: ['./generate-backend.component.css']
})
export class GenerateBackendComponent implements OnInit {

  constructor(
    private _api: CallApiService,
    private _clipBoardService: ClipboardService,
    private _snackBar: MatSnackBar
  ) { }

  tables
  table_name
  column_name
  new_column_name = []
  new_column_for_create = []

  check_all
  check_none
  check_manual
  checked_column

  procedure_type = 'CREATE'
  procedure_parameter_for_create = []
  procedure_parameter_for_update = []
  procedure_parameter_column = []
  procedure_parameter_value = []
  procedure_update_assignment = []

  column_name_for_get_parameter
  column_name_for_select_get_parameter = []
  get_controller = []
  get_db_api = []

  procedure_column_for_post = []
  procedure_column_for_put = []

  req_body_post = []
  req_body_put = []


  only_get
  only_put
  only_post



  http_type

  response: HighlightResult;

  code

  code_controller
  code_db_api

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

    this.column_name_for_select_get_parameter = []
    this._api.getCulumns(this.table_name).subscribe(res => {
      this.column_name = []
      this.column_name = res.data

      for (var i = 0; i < this.column_name.length; i++) {
        this.new_column_name.push({
          COLUMN_NAME: this.column_name[i].COLUMN_NAME,
          isChecked: false,
          defaultValue: ''
        })

        this.column_name_for_select_get_parameter.push({
          COLUMN_NAME: this.column_name[i].COLUMN_NAME,
          isChecked: false,
          defaultValue: ''
        })
      }
    })
  }
  _onGenerate() {

  }
  copy(text: string) {
    this._clipBoardService.copyFromContent(this.code)
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
  _checkIndividual(index) {
    this.check_all = false
    this.check_none = false
    this.check_manual = true

    this.new_column_name[index].isChecked ? this.new_column_name[index].isChecked = false : this.new_column_name[index].isChecked = true
    this.checked_column = this.new_column_name.filter((column) => column.isChecked == true)
  }

  _generateProcedureName() {
    // formate: PC_PRODUCTS_CREATE
    if (this.table_name)
      return 'PC_' + this.table_name.substr(4, this.table_name.length - 4) + '_' + this.procedure_type

  }
  _generateColumnForProcedureForPost() {
    this.procedure_column_for_post = []
    for (var i = 0; i < this.checked_column.length; i++) {
      if (this.checked_column[i].COLUMN_NAME != 'ID') {
        if (i == 1) {
          this.procedure_column_for_post.push('\n:' + this.checked_column[i].COLUMN_NAME)
        } else {
          this.procedure_column_for_post.push('\n          :' + this.checked_column[i].COLUMN_NAME)
        }
      }
    }
  }
  _generateColumnForProcedureForPut() {
    this.procedure_column_for_put = []
    for (var i = 0; i < this.checked_column.length; i++) {
      if (i == 0) {
        this.procedure_column_for_put.push(':' + this.checked_column[i].COLUMN_NAME)
      } else {
        this.procedure_column_for_put.push('\n          :' + this.checked_column[i].COLUMN_NAME)
      }
    }
  }
  _generateReqBodyForPost() {
    this.req_body_post = []
    for (var i = 0; i < this.checked_column.length; i++) {
      if (this.checked_column[i].COLUMN_NAME != 'ID') {
        if (i == 1) {
          this.req_body_post.push(this.checked_column[i].COLUMN_NAME + ': ' + 'req.body.' + this.checked_column[i].COLUMN_NAME)
        } else {
          this.req_body_post.push('\n          ' + this.checked_column[i].COLUMN_NAME + ': ' + 'req.body.' + this.checked_column[i].COLUMN_NAME)
        }
      }
    }
  }
  _generateReqBodyForPut() {
    this.req_body_put = []
    for (var i = 0; i < this.checked_column.length; i++) {
      if (i == 0) {
        this.req_body_put.push(this.checked_column[i].COLUMN_NAME + ': ' + 'req.body.' + this.checked_column[i].COLUMN_NAME)
      } else {
        this.req_body_put.push('\n          ' + this.checked_column[i].COLUMN_NAME + ': ' + 'req.body.' + this.checked_column[i].COLUMN_NAME)
      }
    }
  }
  _generateGetParameterForController() {
    this.get_controller = []
    for (var i = 0; i < this.column_name_for_get_parameter.length; i++) {
      if (i == 0) {
        this.get_controller.push(`context[\'${this.column_name_for_get_parameter[i]}\'] = _.upperCase(req.query[\'${this.column_name_for_get_parameter[i]}\'])`)
      } else {
        this.get_controller.push(`\n          context[\'${this.column_name_for_get_parameter[i]}\'] = _.upperCase(req.query[\'${this.column_name_for_get_parameter[i]}\'])`)
      }
    }
  }
  _generateGetParameterForDBAPI() {
    this.get_db_api = []
    for (var i = 0; i < this.column_name_for_get_parameter.length; i++) {
      console.log(this.column_name_for_get_parameter[i].endsWith('NAME'))
      if (i == 0) {
        this.get_db_api.push(`if(context['${this.column_name_for_get_parameter[i]}']) {\n    binds['${this.column_name_for_get_parameter[i]}'] = context['${this.column_name_for_get_parameter[i]}']\n    query += \`AND UPPER(${this.column_name_for_get_parameter[i]})  ${this.column_name_for_get_parameter[i].endsWith('NAME') ? 'LIKE ' : ' = :'}${this.column_name_for_get_parameter[i].endsWith('NAME') ? '\'%\' || :' : ''}${this.column_name_for_get_parameter[i]}${this.column_name_for_get_parameter[i].endsWith('NAME') ? '|| \'%\'' : ''}\`\n  }\n`) //LIKE '%' || :merc_name || '%'`;
      } else {
      //  this.get_db_api.push(`context[\'${this.column_name_for_get_parameter[i]}\']`)
        this.get_db_api.push(`  if(context['${this.column_name_for_get_parameter[i]}']) {\n    binds['${this.column_name_for_get_parameter[i]}'] =  context['${this.column_name_for_get_parameter[i]}']\n    query += \`AND UPPER(${this.column_name_for_get_parameter[i]})  ${this.column_name_for_get_parameter[i].endsWith('NAME') ? 'LIKE ' : ' = :'}${this.column_name_for_get_parameter[i].endsWith('NAME') ? '\'%\' || :' : ''}${this.column_name_for_get_parameter[i]}${this.column_name_for_get_parameter[i].endsWith('NAME') ? ' || \'%\'' : ''}\`\n  }\n`) //LIKE '%' || :merc_name || '%'`;
      }
    }

    console.log(this.get_db_api)
  }
  _selectHttpType() {
    if (this.http_type == 'get') {
      this._checkAll()
    }
  }
  _onAddParameterFieldForPut(index) {

    this.column_name_for_select_get_parameter[index].isChecked ? this.column_name_for_select_get_parameter[index].isChecked = false : this.column_name_for_select_get_parameter[index].isChecked = true
    this.column_name_for_get_parameter = this.column_name_for_select_get_parameter.filter((column) => column.isChecked == true)
    console.log(this.column_name_for_get_parameter)
  }

  _get(){
    this._generateGetParameterForController()
    this._generateGetParameterForDBAPI()
    this.code_controller =
    `
//--------------get-----------------//
async function get(req, res, next) {
try {
    const context = {};
          ${this.get_controller.join("")}
    const rows = await models.find(context);
    if (rows.length === 1) {
        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } else {
        res.status(200).json({
            success: true,
            data: rows
        });
    }
} catch (err) {
    next(err);
}
}
module.exports.get = get
`
  this.code_db_api =
    `
//---------------------select--------------------//
const baseQuery =\`SELECT * FROM ${this.table_name} WHERE 1=1\`;
async function find(context) {
let query = baseQuery;
const binds = {};
${this.get_db_api.join("")}

const result = await database.simpleExecute(query, binds);
return result.rows;
}
module.exports.find = find;

`
  }
  _post(){
  
  }
  _put(){

  }


  _generateControllerCode() {
    this._generateReqBodyForPost()
    this._generateReqBodyForPut()
    this._generateColumnForProcedureForPost()
    this._generateColumnForProcedureForPut()
    if (this.http_type == 'get') {
     this._get()
    } else if (this.http_type == 'post') {

      this.code_controller =
`
//------------------post---------------------//
function postRec(req) {
const postReq = {
          ${this.req_body_post}
    };
    return postReq;
}
async function post(req, res, next) {
  try {
    let postData = postRec(req);
    postData = await models.create(postData);
    res.status(201).json({
    success: true,
    data: postData
    });
  } catch (err) {
    next(err);
  }
}
module.exports.post = post
` 

this.code_db_api =
`
//---------------------create--------------------//
const createSql =
\`CALL PC_${this.table_name.substr(4, this.table_name.length - 4)}_CREATE(
                  ${this.procedure_column_for_post},
            :ROW_COUNT
)\`;
async function create(reg) {
  const postData = Object.assign({}, reg);
  postData.ROW_COUNT = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  };
  const result = await database.simpleExecute(createSql, postData);
  if (result.outBinds.ROW_COUNT>0) {
    postData.ROW_COUNT = result.outBinds.ROW_COUNT;
    return postData;
  } else {
    return null;
  }
}
module.exports.create = create
`
    } else if (this.http_type == 'put') {
      this.code_controller =
`
function putRec(req) {
  const putReq = {
    ${this.req_body_put}
  };
  return putReq;
  }
  async function put(req, res, next) {
    try {
      let putData = putRec(req);
      putData = await models.update(putData);
      if (putData !== null) {
        res.status(200).json({
        success: true,
        data: putData
      });
      } else {
          res.status(404).end();
      }
    } catch (err) {
      next(err);
    }
}
module.exports.put = put
`


      this.code_db_api =
`
const updateSql =
\`BEGIN
PC_${this.table_name.substr(4, this.table_name.length - 4)}_UPDATE(
          ${this.procedure_column_for_put},
          :ROW_COUNT
);
END;\`;
async function update(reg) {
  const putData = Object.assign({}, reg);
  putData.ROW_COUNT = {
    dir: oracledb.BIND_OUT,
    type: oracledb.NUMBER
  };
  const result = await database.simpleExecute(updateSql, putData);
  if (result.outBinds.ROW_COUNT>0) {
    putData.ROW_COUNT = result.outBinds.ROW_COUNT;
    return putData;
  } else {
    return null;
  }
}

module.exports.update = update;
`

    } else if (this.http_type == 'all') {

    }

  }

  copy_db(){
    this._snackBar.open("Copied!", "", {
      duration: 2000,
    });
    this._clipBoardService.copyFromContent(this.code_db_api)
  }
  copy_controller(){
    this._snackBar.open("Copied!", "", {
      duration: 2000,
    });
    this._clipBoardService.copyFromContent(this.code_controller)
  }

}

