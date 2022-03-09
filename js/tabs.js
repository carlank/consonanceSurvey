const header = document.querySelector('.tabs-header')
const headers = [...header.children]
const body = document.querySelector('.tabs-body')
const pages = [...body.children]
pages.forEach(page => page.style.display = 'none')

let defaultTabIndex = -1
let currentTabIndex

function setTab( index ){
  if ( currentTabIndex != undefined ){
    pages[currentTabIndex].style.display = 'none';
  }
  currentTabIndex = index;
  pages[currentTabIndex].style.display = 'flex';
}

headers.forEach((header, index) => header.onclick = e => setTab(index))

