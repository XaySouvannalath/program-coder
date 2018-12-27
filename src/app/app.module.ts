import { FooterComponent } from './shares/components/footer/footer.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainNavComponent } from './shares/components/main-nav/main-nav.component';
import { MaterialComponentModule } from './shares/modules/material-component.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import { ConfigSystemComponent } from './modules/config-system/config-system.component';
import { GenerateProcedureComponent } from './modules/generate-procedure/generate-procedure.component';
import { GenerateBackendComponent } from './modules/generate-backend/generate-backend.component'
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HighlightModule} from 'ngx-highlightjs'
import xml from 'highlight.js/lib/languages/xml';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import sql from 'highlight.js/lib/languages/sql';
import javascript from 'highlight.js/lib/languages/javascript';
import {ClipboardModule} from 'ngx-clipboard'
import { ShareButtonsModule } from '@ngx-share/buttons';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ProcedureCreateComponent } from './modules/procedure-create/procedure-create.component';
import { ProcedureUpdateComponent } from './modules/procedure-update/procedure-update.component';
import { GenerateAngularComponent } from './modules/generate-angular/generate-angular.component';
export function hljsLanguages() {
  return [
    {name: 'typescript', func: typescript},
    {name: 'scss', func: scss},
    {name: 'xml', func: xml},
    {name: 'sql', func: sql},
    {name: 'javascript', func: javascript},
  ];
}
@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    MainNavComponent,
    ConfigSystemComponent,
    GenerateProcedureComponent,
    GenerateBackendComponent,
    ProcedureCreateComponent,
    ProcedureUpdateComponent,
    GenerateAngularComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialComponentModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    HighlightModule.forRoot({
      languages: hljsLanguages
    }),
    ClipboardModule,
    HttpClientJsonpModule,  // (Optional) Add if you want tumblr share counts
    ShareButtonsModule, 
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
