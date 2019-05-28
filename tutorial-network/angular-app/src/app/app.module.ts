/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { labRecordComponent } from './labRecord/labRecord.component';
import { EHRComponent } from './EHR/EHR.component';
import { PrescriptionComponent } from './Prescription/Prescription.component';

import { DoctorComponent } from './Doctor/Doctor.component';
import { PatientComponent } from './Patient/Patient.component';
import { PharmacyComponent } from './Pharmacy/Pharmacy.component';
import { InsuranceCompanyComponent } from './InsuranceCompany/InsuranceCompany.component';
import { LabComponent } from './Lab/Lab.component';

import { PlacePrescriptionComponent } from './PlacePrescription/PlacePrescription.component';
import { pickupConfirmComponent } from './pickupConfirm/pickupConfirm.component';
import { issueTestComponent } from './issueTest/issueTest.component';
import { createEHRComponent } from './createEHR/createEHR.component';
import { updateRecordComponent } from './updateRecord/updateRecord.component';

  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    labRecordComponent,
    EHRComponent,
    PrescriptionComponent,
    DoctorComponent,
    PatientComponent,
    PharmacyComponent,
    InsuranceCompanyComponent,
    LabComponent,
    PlacePrescriptionComponent,
    pickupConfirmComponent,
    issueTestComponent,
    createEHRComponent,
    updateRecordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
