import { Component, OnInit } from '@angular/core';
import { CallApiService } from 'src/app/shares/services/call-api.service';
import { ClipboardService } from 'ngx-clipboard';

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

  procedure_type = 'CREATE'
  constructor(
    private _api: CallApiService,
    private _clipBoardService: ClipboardService
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
}
