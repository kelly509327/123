const saveBtn = document.querySelector("#save");
const deleteBtn = document.querySelector("#delete");
const todoItemTemplate = document.querySelector("#todo_item_template");
let calendar = document.querySelector("#calendar");
let yearPicker = document.querySelector("#yearPicker");
let monthPicker = document.querySelector("#monthPicker");
let inputDate = document.querySelector("#inputDate");

let now = new Date();
let nowYear = now.getFullYear();
let nowMonth = now.getMonth();

const monthName = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

// 閏年
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

// 二月天數
function February(year) {
    return isLeapYear(year) ? 29 : 28;
}

// 日曆
function getYearMonth(year, month) {
    let days = document.querySelector("#days");
    let daysInMonth = [31, February(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    days.innerHTML = "";

    monthPicker.innerHTML = monthName[month];
    yearPicker.innerHTML = year;

    // 找第一天
    let firstDay = new Date(year, month, 1);
    let space = firstDay.getDay();
    
    // 空白天
    for (let i = 0; i < space; i++) {
        const spaceDiv = document.createElement('div');
        days.appendChild(spaceDiv);
    }

    // 生成日曆格
    for (let d = 1; d <= daysInMonth[month]; d++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add("border");
        dayDiv.textContent = d;

        const listGroupUl = document.createElement('ul');
        listGroupUl.classList.add('list-group', 'list-group-flush', 'overflow-x-hidden', 'overflow-y-auto');

        dayDiv.appendChild(listGroupUl);
        dayDiv.setAttribute('data-id', `${year}-${month + 1}-${d}`);
        dayDiv.setAttribute('data-bs-toggle', 'modal');
        dayDiv.setAttribute('data-bs-target', '#staticBackdrop');
        // dayDiv.setAttribute('color', );

        days.appendChild(dayDiv);
    }

    // 讀取 todos
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        console.log(todo.Date)
        const sp=todo.Date.split("-")
        
        // console.log(Number(sp[0]))
        // console.log(Number(sp[1]))
        // console.log(Number(sp[0])===nowYear)
        // console.log(Number(sp[1])===nowMonth)
        // console.log(nowMonth)
        if(Number(sp[0])===nowYear && Number(sp[1])===nowMonth+1){//當前月份的資料
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = todo.Todo;

        listItem.setAttribute("Color_", `${todo.Color}`);
        listItem.setAttribute("Place_", `${todo.Place}`);

        listItem.setAttribute("data-bs-toggle", "modal");
        listItem.setAttribute("data-bs-target", "#staticBackdrop");
        listItem.setAttribute("TodoID", `${todo.Id}`);
        listItem.setAttribute("style", `border-left:5px solid ${todo.Color}`);
        listItem.setAttribute("data-time", todo.Time);
        const targetDateDiv = document.querySelector(`[data-id='${todo.Date}']`);
        const listGroupUl = targetDateDiv.querySelector("ul");
        listGroupUl.appendChild(listItem);
    }
    });

    // 按上個月按鈕
    document.querySelector("#prevMonth").addEventListener("click", prevMonthHandler);
    // 按下個月按鈕
    document.querySelector("#nextMonth").addEventListener("click", nextMonthHandler);
}

function prevMonthHandler() {
    nowMonth--;
    if (nowMonth < 0) {
        nowYear--;
        nowMonth = 11;
    }

    getYearMonth(nowYear, nowMonth);
}

function nextMonthHandler() {
    nowMonth++;
    if (nowMonth > 11) {
        nowYear++;
        nowMonth = 0;
    }

    getYearMonth(nowYear, nowMonth);
}

getYearMonth(nowYear,nowMonth);

const exampleModal = document.getElementById('staticBackdrop');
if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', (e) => {
        const button = e.relatedTarget;

            const dateId = button.getAttribute('data-id');
            const todoId = button.getAttribute('TodoID');
            // if (dateId) {
            //     const [year, month, day] = dateId.split('-');
            //     document.getElementById('inputId').value = todoId || '';
            //     document.getElementById('inputDate').value = `${year}-${month}-${day}`;
            //     document.getElementById('inputTime').value = '';
            //     document.getElementById('inputPlace').value = '';
            //     document.getElementById('inputTodo').value = '';
            //     document.getElementById('inputColor').value = '#84443C';
            //     deleteBtn.classList.remove('d-none');
            // }
            if (button.classList.contains('border')) {
                const [year, month, day] = dateId.split('-');
                document.getElementById('inputId').value = todoId || '';
                document.getElementById('inputDate').value = `${year}-${month}-${day}`;
                document.getElementById('inputTime').value = `${now.getHours()}:${new Intl.NumberFormat('zh-tw', { minimumIntegerDigits: 2 }).format(now.getMinutes())}`;                document.getElementById('inputPlace').value = '';
                document.getElementById('inputTodo').value = '';
                document.getElementById('inputColor').value = '#84443C';
                deleteBtn.classList.remove('d-none');
            }else if(button.classList.contains('list-group-item')){
                console.log(button)
                const block=button.closest('.border');
                const dataid=block.getAttribute("data-id")
                console.log(dataid)
                console.log(block)
                const [year, month, day] = dataid.split('-');
                document.getElementById('inputId').value = todoId || '';
                document.getElementById('inputDate').value = `${year}-${month}-${day}`;
                document.getElementById('inputTime').value = button.getAttribute("data-time");
                document.getElementById('inputPlace').value =button.getAttribute("Place_");
                document.getElementById('inputTodo').value = button.textContent;
                document.getElementById('inputColor').value = button.getAttribute("Color_");

                // document.getElementById('inputColor').value =button;
                deleteBtn.classList.remove('d-none');
                
            }
    });
}

// 保存
saveBtn.addEventListener("click", () => {
    reomve()
    const inputId = document.querySelector("#inputId").value.trim();
    const inputDate = document.querySelector("#inputDate").value.trim();
    const inputTime = document.querySelector("#inputTime").value.trim();
    const inputTodo = document.querySelector("#inputTodo").value.trim();
    const inputPlace = document.querySelector("#inputPlace").value.trim();
    const inputColor = document.querySelector("#inputColor").value.trim();

    const todoAllInfo = {
        Id: inputId ? parseInt(inputId) : new Date().valueOf(),
        Date: inputDate,
        Time: inputTime,
        Todo: inputTodo,
        Place: inputPlace,
        Color: inputColor
    };

    // 更新 localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => !(todo.Id === todoAllInfo.Id));
    todos.push(todoAllInfo);
    localStorage.setItem('todos', JSON.stringify(todos));

    createDOM(todoAllInfo);

    document.getElementById('inputId').value = '';
    document.getElementById('inputDate').value = '';
    document.getElementById('inputTime').value = '';
    document.getElementById('inputPlace').value = '';
    document.getElementById('inputTodo').value = '';
    document.getElementById('inputColor').value = '#84443C';
});

function createDOM(todoAllInfo) {
    const todoItemEl = todoItemTemplate.content.cloneNode(true);

    const listItem = todoItemEl.querySelector(".list-group-item");
    listItem.textContent = todoAllInfo.Todo;
    listItem.setAttribute("data-bs-toggle", "modal");
    listItem.setAttribute("data-bs-target", "#staticBackdrop");
    listItem.setAttribute("TodoID", `${todoAllInfo.Id}`);
    listItem.setAttribute("style", `border-left:5px solid ${todoAllInfo.Color}`);
    listItem.setAttribute("data-time", todoAllInfo.Time);

    const targetDateDiv = document.querySelector(`[data-id='${todoAllInfo.Date}']`);
    const listGroupUl = targetDateDiv.querySelector("ul");
    const listItems = listGroupUl.querySelectorAll(".list-group-item");

    let index = 0;
    for (let i = 0; i < listItems.length; i++) {
        const existingTime = listItems[i].getAttribute("data-time");
        if (todoAllInfo.Time < existingTime) {
            break;
        }
        index++;
    }

    if (index >= listItems.length) {
        listGroupUl.appendChild(listItem);
    } else {
        listGroupUl.insertBefore(listItem, listItems[index]);
    }
}

// 刪除
deleteBtn.addEventListener('click', () => {
    reomve();
});
function reomve(){
    const inputId = document.querySelector("#inputId").value;
    const inputDate = document.querySelector("#inputDate").value.trim();

    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos = todos.filter(todo => !(todo.Id === parseInt(inputId)));
    localStorage.setItem('todos', JSON.stringify(todos));

    const targetDateDiv = document.querySelector(`[data-id='${inputDate}']`);
    const listGroupUl = targetDateDiv.querySelector("ul");
    const listItemsToRemove = listGroupUl.querySelectorAll(`li[TodoID='${inputId}']`);
    listItemsToRemove.forEach(item => item.remove());
}