import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.health{
   export enum Status {
      NONE,
      PENDING,
      FINISHED,
   }
   export enum Test {
      bloodTest,
      xRay,
      NMRI,
      HPV,
   }
   export class Doctor extends Participant {
      doctorId: string;
      doctorName: string;
      department: string;
      contact: string;
   }
   export class Patient extends Participant {
      patientId: string;
      patientName: string;
      address: string;
      contact: string;
   }
   export class Pharmacy extends Participant {
      phId: string;
      pharmContact: string;
      pharmAddress: string;
   }
   export class InsuranceCompany extends Participant {
      insuranceId: string;
      name: string;
   }
   export class Lab extends Participant {
      labId: string;
      labName: string;
   }
   export class labRecord extends Asset {
      labRecordId: string;
      test: Test;
      status: Status;
      patient: Patient;
      doctor: Doctor;
      lab: Lab;
   }
   export class EHR extends Asset {
      eId: string;
      patientName: string;
      bloodType: string;
      weight: number;
      height: number;
      history: string;
      patient: Patient;
      doctor: Doctor;
      prescription: Prescription;
      company: InsuranceCompany;
   }
   export class Prescription extends Asset {
      presId: string;
      medicine: string;
      doctorName: string;
      patientName: string;
      pickedupLoc: string;
      doctor: Doctor;
      patient: Patient;
      pharmacy: Pharmacy;
   }
   export class PlacePrescription extends Transaction {
      doctor: Doctor;
      placeId: string;
      medicine: string;
      doctorName: string;
      patientName: string;
   }
   export class pickupConfirm extends Transaction {
      patientName: string;
      prescription: Prescription;
      patient: Patient;
      pharmacy: Pharmacy;
   }
   export class issueTest extends Transaction {
      labRecordId: string;
      test: Test;
      status: Status;
      patient: Patient;
      doctor: Doctor;
      lab: Lab;
   }
   export class issueTestEvent extends Event {
      labrecord: labRecord;
   }
   export class createEHR extends Transaction {
      eId: string;
      patientName: string;
      bloodType: string;
      weight: number;
      height: number;
      history: string;
      patient: Patient;
      doctor: Doctor;
      prescription: Prescription;
      company: InsuranceCompany;
   }
   export class createEHRevent extends Event {
      ehr: EHR;
   }
   export class updateRecord extends Transaction {
      labrecord: labRecord;
      status: Status;
   }
// }
