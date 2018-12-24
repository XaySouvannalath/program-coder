import { GenerateBackendComponent } from './modules/generate-backend/generate-backend.component';
import { ConfigSystemComponent } from './modules/config-system/config-system.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateProcedureComponent } from './modules/generate-procedure/generate-procedure.component';
import { ProcedureCreateComponent } from './modules/procedure-create/procedure-create.component';

const routes: Routes = [
  {path:'', component: GenerateProcedureComponent},
  {path:'config', component: ConfigSystemComponent},
  {path:'procedure', component: GenerateProcedureComponent},
  {path:'procedure-create', component: ProcedureCreateComponent},
  {path:'backend', component: GenerateBackendComponent},
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
