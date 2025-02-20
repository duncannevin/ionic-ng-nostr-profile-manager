import { fetchCachedMyProfileEvent, submitUnsignedEvent } from './fetchEvents';
import { Kind10002Event, Kind10002Tag, loadBackupHistory } from './LoadHistory';
import { localStorageGetItem } from './LocalStorage';

const generateRelayFormRow = (index:number, tag?:Kind10002Tag):string => `
  <tr id="PM-form-relay-${index}-row" class="relayformrow">
    <td>
      <input
        type="text"
        name="PM-form-relay-${index}-address"
        id="PM-form-relay-${index}-address"
        placeholder="Relay address: wss://..."
        ${tag ? `value="${tag[1]}"` : ''}
      />
    </td>
    <td>
      <label for="PM-form-relay-${index}-read">
        <input
          type="checkbox"
          id="PM-form-relay-${index}-read"
          name="PM-form-relay-${index}-read"
          ${!tag || !tag[2] || tag[2] === 'read' ? 'checked="checked"' : ''}
        >
        read
      </label>
      <label for="PM-form-relay-${index}-write">
        <input
          type="checkbox"
          id="PM-form-relay-${index}-write"
          name="PM-form-relay-${index}-write"
          ${!tag || !tag[2] || tag[2] === 'write' ? 'checked="checked"' : ''}
        >
        write
      </label>
    </td>
    <td><a
      href="#"
      onclick="this.parentNode.parentNode.remove();return false;"
      class="button outline secondary"
    >Remove</a></td>
  </tr>
`;

const generateRelayForm = (event: Kind10002Event | null):string => `
  <form id="relaysform">
    <table role="grid">
      <tbody id="relayformtbody">
        ${!event ? '' : event.tags.map((a, i) => generateRelayFormRow(i, a)).join('')}
        ${generateRelayFormRow(event ? event.tags.length : 0)}
        <tr id="relaybuttons">
          <td>
            <button id="relayssubmitbutton" type="button">${event ? 'Update' : 'Save'}</button>
          </td>
          <td>
            <button id="relaysresetbutton" class="secondary outline" type="reset">Reset Form</button>
          </td>
          <td>
            <button id="relaysaddbutton" class="secondary" type="button">Add</button>
          </td>
        </tr>
      </tbody>
    </table>
  </form>
`;

const SubmitRelayForm = async () => {
  // construct and populate new content object with form data
  const fd = new FormData(document.getElementById('relaysform') as HTMLFormElement);
  const tags = Array.from(Array(100)).map((_e, i) => {
    const url = fd.get(`PM-form-relay-${i}-address`);
    if (!url || url === '') return null;
    const w = !!fd.get(`PM-form-relay-${i}-write`);
    const r = !!fd.get(`PM-form-relay-${i}-read`);
    const base:Kind10002Tag = ['r', url as string];
    if (w && r) return base;
    return ['r', fd.get(`PM-form-relay-${i}-address`), r ? 'read' : 'write'] as Kind10002Tag;
  }).filter((v) => v !== null);
  // submit event
  submitUnsignedEvent(
    {
      pubkey: localStorageGetItem('pubkey') as string,
      kind: 10002,
      created_at: Math.floor(Date.now() / 1000),
      content: '',
      tags: tags as Kind10002Tag[],
    },
    'relayssubmitbutton',
  );
  // reload history
  loadBackupHistory('relaysbackuphistory', 10002);
};

const loadRelayForm = (RootElementID:string) => {
  (document.getElementById(RootElementID) as HTMLDivElement)
    .innerHTML = `<div class="relayform">
    <h3>Relays</h3>
    ${generateRelayForm(fetchCachedMyProfileEvent(10002) as Kind10002Event)}
  </div>`;
  // form submit event
  (document.getElementById('relayssubmitbutton') as HTMLButtonElement).onclick = (event) => {
    SubmitRelayForm();
    event.preventDefault();
  };
  // reset form
  (document.getElementById('relaysresetbutton') as HTMLButtonElement).onclick = (event) => {
    loadRelayForm(RootElementID);
    event.preventDefault();
  };
  // add button
  (document.getElementById('relaysaddbutton') as HTMLButtonElement).onclick = (event) => {
    const count = (document.getElementById('relayformtbody') as HTMLElement).childElementCount - 1;
    const tr = document.createElement('tr');
    (document.getElementById('relaybuttons') as HTMLElement).before(tr);
    tr.outerHTML = generateRelayFormRow(count);
    event.preventDefault();
  };
};

const LoadRelaysPage = () => {
  const o:HTMLElement = document.getElementById('PM-container') as HTMLElement;
  o.innerHTML = `
    <div id="relayspage" class="container">
      <div id="relayforcontainer"></div>
      <div id="relaysbackuphistory"></div>
    <div>
  `;
  loadRelayForm('relayforcontainer');
  loadBackupHistory('relaysbackuphistory', 10002);
};

export default LoadRelaysPage;
