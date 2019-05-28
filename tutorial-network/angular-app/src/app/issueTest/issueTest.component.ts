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
import { issueTestService } from './issueTest.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-issuetest',
  templateUrl: './issueTest.component.html',
  styleUrls: ['./issueTest.component.css'],
  providers: [issueTestService]
})
export class issueTestComponent implements OnInit {

  myForm: FormGroup;

  private allTransactions;
  private Transaction;
  private currentId;
  private errorMessage;

  labRecordId = new FormControl('', Validators.required);
  test = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  patient = new FormControl('', Validators.required);
  doctor = new FormControl('', Validators.required);
  lab = new FormControl('', Validators.required);
  transactionId = new FormControl('', Validators.required);
  timestamp = new FormControl('', Validators.required);


  constructor(private serviceissueTest: issueTestService, fb: FormBuilder) {
    this.myForm = fb.group({
      labRecordId: this.labRecordId,
      test: this.test,
      status: this.status,
      patient: this.patient,
      doctor: this.doctor,
      lab: this.lab,
      transactionId: this.transactionId,
      timestamp: this.timestamp
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceissueTest.getAll()
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
      $class: 'org.health.issueTest',
      'labRecordId': this.labRecordId.value,
      'test': this.test.value,
      'status': this.status.value,
      'patient': this.patient.value,
      'doctor': this.doctor.value,
      'lab': this.lab.value,
      'transactionId': this.transactionId.value,
      'timestamp': this.timestamp.value
    };

    this.myForm.setValue({
      'labRecordId': null,
      'test': null,
      'status': null,
      'patient': null,
      'doctor': null,
      'lab': null,
      'transactionId': null,
      'timestamp': null
    });

    return this.serviceissueTest.addTransaction(this.Transaction)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'labRecordId': null,
        'test': null,
        'status': null,
        'patient': null,
        'doctor': null,
        'lab': null,
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
      $class: 'org.health.issueTest',
      'labRecordId': this.labRecordId.value,
      'test': this.test.value,
      'status': this.status.value,
      'patient': this.patient.value,
      'doctor': this.doctor.value,
      'lab': this.lab.value,
      'timestamp': this.timestamp.value
    };

    return this.serviceissueTest.updateTransaction(form.get('transactionId').value, this.Transaction)
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

    return this.serviceissueTest.deleteTransaction(this.currentId)
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

    return this.serviceissueTest.getTransaction(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'labRecordId': null,
        'test': null,
        'status': null,
        'patient': null,
        'doctor': null,
        'lab': null,
        'transactionId': null,
        'timestamp': null
      };

      if (result.labRecordId) {
        formObject.labRecordId = result.labRecordId;
      } else {
        formObject.labRecordId = null;
      }

      if (result.test) {
        formObject.test = result.test;
      } else {
        formObject.test = null;
      }

      if (result.status) {
        formObject.status = result.status;
      } else {
        formObject.status = null;
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

      if (result.lab) {
        formObject.lab = result.lab;
      } else {
        formObject.lab = null;
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
      'labRecordId': null,
      'test': null,
      'status': null,
      'patient': null,
      'doctor': null,
      'lab': null,
      'transactionId': null,
      'timestamp': null
    });
  }
}
