export function generateDetailsListHTML(properties: { name: any, content: any }[]) {
  let detailsContainerEl = document.createElement('div');
  let listEl = document.createElement('ul');
  listEl.classList.value = 'ui details-list';
  detailsContainerEl.appendChild(listEl);

  for (let property of properties) {
    if (!property.content) continue;
    let itemEl = document.createElement('li');
    itemEl.classList.value = 'ui details-item';
    itemEl.innerHTML = `
    <h5 class="ui details-item-name">${property.name}</h5>
    <p class="ui details-item-content">${property.content}</p>
    `;
    listEl.appendChild(itemEl);
  }

  return detailsContainerEl.innerHTML;
}

// <ul class="ui details-list">
//   <li class="ui details-item">
//     <h5 class="ui details-item-name">name</h5>
//     <p class="ui details-item-content">content</p>
//   </li>
// </ul>
