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

/* global getAssetRegistry getFactory emit */

/**
 * Sample transaction processor function.
 * @param {org.health.PlacePrescription} tx The sample transaction instance.
 * @transaction
 */

async function place(tx){
    console.log('placePrescription');
    const factory = getFactory();
    const namespace = 'org.health';
    const order= factory.newResource(namespace,'Prescription',tx.placeId);
    order.medicine=tx.medicine;
    order.patientName=tx.patientName;
    order.doctorName=tx.doctorName;
    order.pickedupLoc= 'CVS';
    //participants
    order.doctor=tx.doctor;
  
    //save the order
    const assetRegistry=await getAssetRegistry(order.getFullyQualifiedType());
    await assetRegistry.add(order);
  }
  
  
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
  
  /* global getAssetRegistry getFactory emit */
  
  /**
   * Sample transaction processor function.
   * @param {org.health.pickupConfirm} tx The sample transaction instance.
   * @transaction
   */
  
  
   async function pick(tx){
    // const factory = getFactory();
    // const namespace = 'org.health';
    // const picked=factory.newResource(namespace,)
    if(tx.patient.patientName!==tx.prescription.patientName){
      throw new Error ("This person is not the pick up person")
    }
      
    tx.prescription.patient = tx.patient
    tx.prescription.pharmacy = tx.pharmacy
    let assetRegistry= await getAssetRegistry('org.health.Prescription');
      await assetRegistry.update(tx.prescription)
    
   }
  
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
  
  /* global getAssetRegistry getFactory emit */
  
  /**
   * Sample transaction processor function.
   * @param {org.health.issueTest} tx The sample transaction instance.
   * @transaction
   */
  
   async function issue(tx){
      const factory = getFactory();
      const namespace = 'org.health';
      
      const Issue= factory.newResource(namespace,'labRecord',tx.labRecordId);
      Issue.test=tx.test;
      Issue.status=tx.status;
  
      //participants
  
      Issue.patient=tx.patient;
      Issue.doctor=tx.doctor;
      Issue.lab=tx.lab;
  
      // save the order
      const assetRegistry = await getAssetRegistry(Issue.getFullyQualifiedType());
      await assetRegistry.add(Issue);
      
      // emit the event
      const issueTestEvent = factory.newEvent(namespace, 'issueTestEvent');
      issueTestEvent.labrecord = Issue
      emit(issueTestEvent);
  
   }
  
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
  
  /* global getAssetRegistry getFactory emit */
  
  /**
   * Sample transaction processor function.
   * @param {org.health.updateRecord} tx The sample transaction instance.
   * @transaction
   */
  async function update(tx){
      tx.labrecord.status = tx.status
      let AssetRegistry = await getAssetRegistry('org.health.labRecord');
      await AssetRegistry.update(tx.labrecord);
  
  }

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
  
  /* global getAssetRegistry getFactory emit */
  
  /**
   * Sample transaction processor function.
   * @param {org.health.createEHR} tx The sample transaction instance.
   * @transaction
   */
  
  async function CreateEHR(tx){
    const factory = getFactory();
    const namespace = 'org.health';
    
    const CreateEHR= factory.newResource(namespace,'EHR',tx.eId);
    CreateEHR.patientName=tx.patientName;
    CreateEHR.bloodType=tx.bloodType;
    CreateEHR.weight=tx.weight;
    CreateEHR.height=tx.height;
    CreateEHR.history=tx.history;


    //reference

    CreateEHR.patient=tx.patient;
    CreateEHR.doctor=tx.doctor;
    CreateEHR.prescription=tx.prescription;
    CreateEHR.company=tx.company;

    // save the EHR
    const assetRegistry = await getAssetRegistry(CreateEHR.getFullyQualifiedType());
    await assetRegistry.add(CreateEHR);
    
    // emit the event
    const issueTestEvent = factory.newEvent(namespace, 'createEHRevent');
    issueTestEvent.ehr = CreateEHR
    emit(issueTestEvent);

}
