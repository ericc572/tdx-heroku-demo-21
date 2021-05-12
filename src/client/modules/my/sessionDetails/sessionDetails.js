import { LightningElement, api } from 'lwc';
import { getSession } from '../../data/sessionService';
export default class SessionDetails extends LightningElement {
  session;
  @api
  set sessionId(id) {
    this._sessionId = id;
    this.session = getSession(id);
  }
  get sessionId() {
    return this._sessionId;
  }

  handleSessionsClick() {
    const navigateEvent = new CustomEvent('navigate', {
      detail: {
        state: 'list'
      }
    });
    this.dispatchEvent(navigateEvent);
  }

  async saveToSalesforce() {
    console.log("writing back to my db then back to salesforce...");

    const status = this.document.getElementById('status-dropdown');
    console.log("updating", status.value);

    const case_no = this.document.getElementsByClassName('casenumber');

    console.log(case_no);
    // console.log(sessionId());
    // const case_id = sessionId();
    const data = { status: status.value, case_number: case_no };
    const url = '/api/cases';

    console.log("patching with", data);
  
    const response = await fetch(url, {
      method: 'PATCH', // *GET, POST, PUT, DELETE, etc.
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    
    return response.json(); // parses JSON response into native JavaScript objects
  }
}