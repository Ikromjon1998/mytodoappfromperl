const textfieldInput = document.getElementById("todoinputfield");
const inputTextfield = document.getElementById('addtaskcontainerid');
const list = document.querySelector('ul');
var editClicked = false;
var listElement = '';

/**
 * Added keyup listener to show and hide of delete icon
 */
textfieldInput.addEventListener("keyup", function() {
  
  if (textfieldInput.value != "") {
      document.getElementById('cancelBtnId').className = "addTaskBtnIconsContainer";
  } else {
      document.getElementById('cancelBtnId').className = "deleteIconsContainer";
  }
});

/**
 * Add a "checked" symbol when clicking on a list item
 * show the edit and delete icons when click on the list item
 * handle the cases when click on list item and div (text in the list item)
 */

list.addEventListener('click', function(ev) {
  //  get the list items by query the dom 
  var checkedList = document.querySelectorAll('.checked'),
      tagName = ev.target.tagName,
      checkedTargetValue = tagName === 'LI'? event.target.classList.contains('checked') : ev.target.parentElement.classList.contains('checked');

  //  return empty when already select a card
  if(checkedList.length >=1 && !checkedTargetValue) {
    return ;
  }
  if (tagName === 'LI') {
    ev.target.classList.toggle('checked');
  } else if(tagName === 'DIV') {
    ev.target.parentElement.classList.toggle('checked');
  }
  checkedTargetValue = tagName === 'LI'? event.target.classList.contains('checked') : ev.target.parentElement.classList.contains('checked');
  //  added the condition based on the checkedTargetValue to show or hide the edit or delete icons
  if(checkedTargetValue) {
    if(tagName === 'LI') {
        ev.target.children[0].style.display = 'flex';
        ev.target.getElementsByClassName('close')[0].onclick = function(event){
          window.onDeleteIconClick(ev.target);
          event.stopPropagation();
        }
        ev.target.getElementsByClassName('edit')[0].onclick = function(event){
          window.onEditIconClick(ev.target);
          event.stopPropagation();
        }
    } else if(tagName === 'DIV') {
        ev.target.previousElementSibling.style.display = 'flex';
        ev.target.parentElement.getElementsByClassName('close')[0].onclick = function(event){
          window.onDeleteIconClick(ev.target.parentElement);
          event.stopPropagation();
        }
        ev.target.parentElement.getElementsByClassName('edit')[0].onclick = function(event){
          window.onEditIconClick(ev.target.parentElement);
          event.stopPropagation();
        }
    }
  } else if(!checkedTargetValue) {
    if(tagName === 'LI') {
      ev.target.children[0].style.display = 'none';
    } else if(tagName === 'DIV') {
      //03/oct/2019 Handle when click on the icon's div to unselect the card
      if(ev.target.previousElementSibling) {
        ev.target.previousElementSibling.style.display = 'none';
      } else {
        ev.target.style.display = 'none';
      }
    }
    //03/oct/2019 Clear the text of textarea when unslelect the card
    editClicked = false;
    document.getElementById("todoinputfield").value = ''; 
  }
}, false);

/**
 * This method is to show the input textfield
 */
function showInputText(){
    var cardView = document.getElementById('todoitemslist');
    this.noDataFound();
    inputTextfield.style.display = 'block';
    cardView.style.margin = '10px 60px 60px 60px';
    //   clear text in textarea, close edit and delete icons div when clicked on 
    // add task button after the edit click on edit icon
    if(editClicked){
      editClicked = false;
      listElement.classList.toggle('checked');
      listElement.children[0].style.display = 'none';
      document.getElementById("todoinputfield").value = '';
    }
}

/**
 * This method is to clear the entered text on input textfield
 */
function clearText() {
    if(textfieldInput.value === '') {
      document.getElementById('cancelBtnId').className = "deleteIconsContainer";
      inputTextfield.style.display = 'none';
    }
    document.getElementById("todoinputfield").value = ''; 
}

/**
 * This method is to add the entered text on input textfield
 */
function createTodo() {
  if(editClicked) {
    this.editedData();
    editClicked = false;
    return ;
  }
    
  if (textfieldInput.value === '') {
    return  ;
  }
  var li = document.createElement("li"),
      randomId = Math.floor(Date.now() / 1000), //Math.random().toString(36).substr(2, 9);
      divElement = '';
  this.addDeleteAndEditBtn(li);
  divElement = document.createElement("DIV");
  divElement.innerHTML = textfieldInput.value;
  divElement.className = "cardViewInput";
  li.id = randomId;
  li.appendChild(divElement);
  
  document.getElementById("todoitemslist").appendChild(li);
  li.className = "card";
  
  if(textfieldInput.value.length !=0) {
    var itemsArray = localStorage.getItem('cardItems') ? JSON.parse(localStorage.getItem('cardItems')) : [];
    itemsArray.push({
      text: textfieldInput.value,
      id: randomId
    });
    localStorage.setItem('cardItems', JSON.stringify(itemsArray));
  }
  document.getElementById("todoinputfield").value = "";
}
/**
 * noDataFound method is to show some text when list items are empty 
 */
function noDataFound (){
    var defaultText = document.getElementsByClassName('noDataFound')[0];
    defaultText.style.display = "none";
}
/**
 * This method is to display all the existing card views when refresh the page
 */
function restoreData() {
  if (typeof(Storage) !== "undefined") {
    var todoItems  = JSON.parse(localStorage.getItem('cardItems'));
    if(todoItems  && todoItems .length !=0) {
      this.noDataFound();
    }
    for(var key in todoItems ) {
      var li = document.createElement("li"),
          divElement = '';
           
      this.addDeleteAndEditBtn(li);
      divElement = document.createElement("DIV");
      divElement.className = "cardViewInput";
      divElement.innerHTML = todoItems [key].text;
      li.id = todoItems[key].id;
      li.appendChild(divElement);
      document.getElementById("todoitemslist").appendChild(li);
      li.className = "card";
    }
  } 
}

/**
 * addDeleteAndEditBtn is used to create element for edit and delete buttons
 */
function addDeleteAndEditBtn(li) {
  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  var div = document.createElement("DIV");
  span.className = "close";
  div.className = "iconCls";
  span.appendChild(txt);

  var editSpan = document.createElement("SPAN");
  var edittxt = document.createTextNode("\u270E");
  editSpan.className = "edit";
  editSpan.appendChild(edittxt);

  div.appendChild(span);
  div.appendChild(editSpan);
  li.appendChild(div);
}

/**
 * @param li 
 * @method onDeleteIconClick
 * This method is for handle the delete of selected list item
 */
function onDeleteIconClick(li) {
  var localStorageValues = [],
      index;

  localStorageValues = JSON.parse(localStorage.getItem('cardItems'));
  for(var k=0; k < localStorageValues.length; k++) {
    if(localStorageValues[k].id == li["id"]) {
      index = k;
      localStorageValues.splice(index, 1); 
      //  removed checked class from classList when delete the card and cle
      li.classList.toggle('checked');
      li.style.display = "none";
      document.getElementById("todoinputfield").value = '';
      editClicked = false;
      localStorage.setItem('cardItems', JSON.stringify(localStorageValues));
      break;
    }
  }
  
  if(localStorageValues.length == 0) {
    var defaultText = document.getElementsByClassName('noDataFound')[0];
    inputTextfield.style.display = "none";
    defaultText.style.display = "inline-block";
  }
}

/**
 * 
 * @param li 
 * @method onEditIconClick
 * This method is for add text to the textarea when click on edit button
 */
function onEditIconClick(li) {
  var innerText = li.childNodes[1].innerHTML;
  inputTextfield.style.display = 'block';
  document.getElementById("todoinputfield").value = innerText;
  document.getElementById('cancelBtnId').className = "addTaskBtnIconsContainer";
  editClicked = true;
  listElement = li;
}

/**
 * @method editedData
 * This method is for add the edited data to the list item when clicked on save 
 */
function editedData() {
  var editStorageValues = [],
      index,
      editedText = textfieldInput.value;
  listElement.childNodes[1].innerHTML = editedText;
  editStorageValues = JSON.parse(localStorage.getItem('cardItems'));
  for(var m=0; m < editStorageValues.length; m++) {
    if(editStorageValues[m].id == listElement["id"]) {
      index = m;
      editStorageValues[index].text = editedText;
      localStorage.setItem('cardItems', JSON.stringify(editStorageValues));
      break;
    }
  }
  document.getElementById("todoinputfield").value = '';
  listElement.classList.toggle('checked');
  listElement.children[0].style.display = 'none';
}