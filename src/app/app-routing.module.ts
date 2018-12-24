import { GenerateBackendComponent } from './modules/generate-backend/generate-backend.component';
import { ConfigSystemComponent } from './modules/config-system/config-system.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenerateProcedureComponent } from './modules/generate-procedure/generate-procedure.component';

const routes: Routes = [
  {path:'', component: GenerateProcedureComponent},
  {path:'config', component: ConfigSystemComponent},
  {path:'procedure', component: GenerateProcedureComponent},
  {path:'backend', component: GenerateBackendComponent},
  { path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
