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
import { createEHRService } from './createEHR.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-createehr',
  templateUrl: './createEHR.component.html',
  styleUrls: ['./createEHR.component.css'],
  providers: [createEHRService]
})
export class createEHRComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
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
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private servicecreateEHR: createEHRService, fb: FormBuilder) {
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
      company: this.company,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicecreateEHR.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(transaction => {
        tempList.push(transaction);
      });
      this.allTransactions = tempList;
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
   * @param {String} name - the name of the transaction field to update
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
   * only). This is used for checkboxes in the transaction updateDialog.
   * @param {String} name - the name of the transaction field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified transaction field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.health.createEHR',
      'eId': this.eId.value,
      'patientName': this.patientName.value,
      'bloodType': this.bloodType.value,
      'weight': this.weight.value,
      'height': this.height.value,
      'history': this.history.value,
      'patient': this.patient.value,
      'doctor': this.doctor.value,
      'prescription': this.prescription.value,
      'company': this.company.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
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
      'company': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.servicecreateEHR.addTransaction(this.Transaction)
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
        'company': null,
        'transactionId': null,
        'timestamp': null
      });
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
        this.errorMessage = error;
      }
    });
  }

  updateTransaction(form: any): Promise<any> {
    this.Transaction = {
      $class: 'org.health.createEHR',
      'eId': this.eId.value,
      'patientName': this.patientName.value,
      'bloodType': this.bloodType.value,
      'weight': this.weight.value,
      'height': this.height.value,
      'history': this.history.value,
      'patient': this.patient.value,
      'doctor': this.doctor.value,
      'prescription': this.prescription.value,
      'company': this.company.value,
      'timestamp': this.timestamp.value
    };

    return this.servicecreateEHR.updateTransaction(form.get('transactionId').value, this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

  deleteTransaction(): Promise<any> {

    return this.servicecreateEHR.deleteTransaction(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
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

    return this.servicecreateEHR.getTransaction(id)
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
        'company': null,
        'transactionId': null,
        'timestamp': null
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

      if (result.transactionId) {
        formObject.transactionId = result.transactionId;
      } else {
        formObject.transactionId = null;
      }

      if (result.timestamp) {
        formObject.timestamp = result.timestamp;
      } else {
        formObject.timestamp = null;
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
      'company': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
