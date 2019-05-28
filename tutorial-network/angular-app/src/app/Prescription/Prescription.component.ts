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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { PrescriptionService } from './Prescription.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-prescription',
  templateUrl: './Prescription.component.html',
  styleUrls: ['./Prescription.component.css'],
  providers: [PrescriptionService]
})
export class PrescriptionComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  presId = new FormControl('', Validators.required);
  medicine = new FormControl('', Validators.required);
  doctorName = new FormControl('', Validators.required);
  patientName = new FormControl('', Validators.required);
  pickedupLoc = new FormControl('', Validators.required);
  doctor = new FormControl('', Validators.required);
  patient = new FormControl('', Validators.required);
  pharmacy = new FormControl('', Validators.required);

  constructor(public servicePrescription: PrescriptionService, fb: FormBuilder) {
    this.myForm = fb.group({
      presId: this.presId,
      medicine: this.medicine,
      doctorName: this.doctorName,
      patientName: this.patientName,
      pickedupLoc: this.pickedupLoc,
      doctor: this.doctor,
      patient: this.patient,
      pharmacy: this.pharmacy
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicePrescription.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.health.Prescription',
      'presId': this.presId.value,
      'medicine': this.medicine.value,
      'doctorName': this.doctorName.value,
      'patientName': this.patientName.value,
      'pickedupLoc': this.pickedupLoc.value,
      'doctor': this.doctor.value,
      'patient': this.patient.value,
      'pharmacy': this.pharmacy.value
    };

    this.myForm.setValue({
      'presId': null,
      'medicine': null,
      'doctorName': null,
      'patientName': null,
      'pickedupLoc': null,
      'doctor': null,
      'patient': null,
      'pharmacy': null
    });

    return this.servicePrescription.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'presId': null,
        'medicine': null,
        'doctorName': null,
        'patientName': null,
        'pickedupLoc': null,
        'doctor': null,
        'patient': null,
        'pharmacy': null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });
  }


  updateAsset(form: any): Promise<any> {
    this.asset = {
      $class: 'org.health.Prescription',
      'medicine': this.medicine.value,
      'doctorName': this.doctorName.value,
      'patientName': this.patientName.value,
      'pickedupLoc': this.pickedupLoc.value,
      'doctor': this.doctor.value,
      'patient': this.patient.value,
      'pharmacy': this.pharmacy.value
    };

    return this.servicePrescription.updateAsset(form.get('presId').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.servicePrescription.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.servicePrescription.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'presId': null,
        'medicine': null,
        'doctorName': null,
        'patientName': null,
        'pickedupLoc': null,
        'doctor': null,
        'patient': null,
        'pharmacy': null
      };

      if (result.presId) {
        formObject.presId = result.presId;
      } else {
        formObject.presId = null;
      }

      if (result.medicine) {
        formObject.medicine = result.medicine;
      } else {
        formObject.medicine = null;
      }

      if (result.doctorName) {
        formObject.doctorName = result.doctorName;
      } else {
        formObject.doctorName = null;
      }

      if (result.patientName) {
        formObject.patientName = result.patientName;
      } else {
        formObject.patientName = null;
      }

      if (result.pickedupLoc) {
        formObject.pickedupLoc = result.pickedupLoc;
      } else {
        formObject.pickedupLoc = null;
      }

      if (result.doctor) {
        formObject.doctor = result.doctor;
      } else {
        formObject.doctor = null;
      }

      if (result.patient) {
        formObject.patient = result.patient;
      } else {
        formObject.patient = null;
      }

      if (result.pharmacy) {
        formObject.pharmacy = result.pharmacy;
      } else {
        formObject.pharmacy = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'presId': null,
      'medicine': null,
      'doctorName': null,
      'patientName': null,
      'pickedupLoc': null,
      'doctor': null,
      'patient': null,
      'pharmacy': null
      });
  }

}
