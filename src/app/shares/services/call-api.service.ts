import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iMainTable, iColumn, iMainColumn } from '../models/all-models';

@Injectable({
  providedIn: 'root'
})
export class CallApiService {

  constructor(private _http: HttpClient) { }

  getTableName(): Observable<iMainTable>{
    return this._http.get<any>('http://115.84.76.61:3000/loanuat/api/gettable')
  }

  getCulumns(tableName): Observable<iMainColumn>{
    return this._http.post<any>(`http://115.84.76.61:3000/loanuat/api/getcolumns/`, {"tableName": tableName})
  }
}
