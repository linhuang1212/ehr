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
import { EHRService } from './EHR.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-ehr',
  templateUrl: './EHR.component.html',
  styleUrls: ['./EHR.component.css'],
  providers: [EHRService]
})
export class EHRComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  eId = new FormControl('', Validators.required);
  patientName = new FormControl('', Validators.required);
  bloodType = new FormControl('', Validators.required);
  weight = new FormControl('', Validators.required);
  height = new FormControl('', Validators.required);
  history = new FormControl('', Validators.required);
  patient = new FormControl('', Validators.required);
  doctor = new FormControl('', Validators.required);
  prescription = new FormControl('', Validators.required);
  company = new FormControl('', Validators.required);

  constructor(public serviceEHR: EHRService, fb: FormBuilder) {
    this.myForm = fb.group({
      eId: this.eId,
      patientName: this.patientName,
      bloodType: this.bloodType,
      weight: this.weight,
      height: this.height,
      history: this.history,
      patient: this.patient,
      doctor: this.doctor,
      prescription: this.prescription,
      company: this.company
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceEHR.getAll()
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
      $class: 'org.health.EHR',
      'eId': this.eId.value,
      'patientName': this.patientName.value,
      'bloodType': this.bloodType.value,
      'weight': this.weight.value,
      'height': this.height.value,
      'history': this.history.value,
      'patient': this.patient.value,
      'doctor': this.doctor.value,
      'prescription': this.prescription.value,
      'company': this.company.value
    };

    this.myForm.setValue({
      'eId': null,
      'patientName': null,
      'bloodType': null,
      'weight': null,
      'height': null,
      'history': null,
      'patient': null,
      'doctor': null,
      'prescription': null,
      'company': null
    });

    return this.serviceEHR.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'eId': null,
        'patientName': null,
        'bloodType': null,
        'weight': null,
        'height': null,
        'history': null,
        'patient': null,
        'doctor': null,
        'prescription': null,
        'company': null
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
      $class: 'org.health.EHR',
      'patientName': this.patientName.value,
      'bloodType': this.bloodType.value,
      'weight': this.weight.value,
      'height': this.height.value,
      'history': this.history.value,
      'patient': this.patient.value,
      'doctor': this.doctor.value,
      'prescription': this.prescription.value,
      'company': this.company.value
    };

    return this.serviceEHR.updateAsset(form.get('eId').value, this.asset)
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

    return this.serviceEHR.deleteAsset(this.currentId)
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

    return this.serviceEHR.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'eId': null,
        'patientName': null,
        'bloodType': null,
        'weight': null,
        'height': null,
        'history': null,
        'patient': null,
        'doctor': null,
        'prescription': null,
        'company': null
      };

      if (result.eId) {
        formObject.eId = result.eId;
      } else {
        formObject.eId = null;
      }

      if (result.patientName) {
        formObject.patientName = result.patientName;
      } else {
        formObject.patientName = null;
      }

      if (result.bloodType) {
        formObject.bloodType = result.bloodType;
      } else {
        formObject.bloodType = null;
      }

      if (result.weight) {
        formObject.weight = result.weight;
      } else {
        formObject.weight = null;
      }

      if (result.height) {
        formObject.height = result.height;
      } else {
        formObject.height = null;
      }

      if (result.history) {
        formObject.history = result.history;
      } else {
        formObject.history = null;
      }

      if (result.patient) {
        formObject.patient = result.patient;
      } else {
        formObject.patient = null;
      }

      if (result.doctor) {
        formObject.doctor = result.doctor;
      } else {
        formObject.doctor = null;
      }

      if (result.prescription) {
        formObject.prescription = result.prescription;
      } else {
        formObject.prescription = null;
      }

      if (result.company) {
        formObject.company = result.company;
      } else {
        formObject.company = null;
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
      'eId': null,
      'patientName': null,
      'bloodType': null,
      'weight': null,
      'height': null,
      'history': null,
      'patient': null,
      'doctor': null,
      'prescription': null,
      'company': null
      });
  }

}
