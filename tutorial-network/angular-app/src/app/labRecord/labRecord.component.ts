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
import { labRecordService } from './labRecord.service';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-labrecord',
  templateUrl: './labRecord.component.html',
  styleUrls: ['./labRecord.component.css'],
  providers: [labRecordService]
})
export class labRecordComponent implements OnInit {

  myForm: FormGroup;

  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  labRecordId = new FormControl('', Validators.required);
  test = new FormControl('', Validators.required);
  status = new FormControl('', Validators.required);
  patient = new FormControl('', Validators.required);
  doctor = new FormControl('', Validators.required);
  lab = new FormControl('', Validators.required);

  constructor(public servicelabRecord: labRecordService, fb: FormBuilder) {
    this.myForm = fb.group({
      labRecordId: this.labRecordId,
      test: this.test,
      status: this.status,
      patient: this.patient,
      doctor: this.doctor,
      lab: this.lab
    });
  };

  ngOnInit(): void {
    this.loadAll();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.servicelabRecord.getAll()
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
      $class: 'org.health.labRecord',
      'labRecordId': this.labRecordId.value,
      'test': this.test.value,
      'status': this.status.value,
      'patient': this.patient.value,
      'doctor': this.doctor.value,
      'lab': this.lab.value
    };

    this.myForm.setValue({
      'labRecordId': null,
      'test': null,
      'status': null,
      'patient': null,
      'doctor': null,
      'lab': null
    });

    return this.servicelabRecord.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'labRecordId': null,
        'test': null,
        'status': null,
        'patient': null,
        'doctor': null,
        'lab': null
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
      $class: 'org.health.labRecord',
      'test': this.test.value,
      'status': this.status.value,
      'patient': this.patient.value,
      'doctor': this.doctor.value,
      'lab': this.lab.value
    };

    return this.servicelabRecord.updateAsset(form.get('labRecordId').value, this.asset)
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

    return this.servicelabRecord.deleteAsset(this.currentId)
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

    return this.servicelabRecord.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'labRecordId': null,
        'test': null,
        'status': null,
        'patient': null,
        'doctor': null,
        'lab': null
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
      'lab': null
      });
  }

}
