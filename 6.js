const saveBtn = document.querySelector("#save");
const deleteBtn = document.querySelector("#delete");
const todoItemTemplate = document.querySelector("#todo_item_template");
let calendar = document.querySelector("#calendar");
let yearPicker = document.querySelector("#yearPicker");
let monthPicker = document.querySelector("#monthPicker");
let inputDate = document.querySelector("#inputDate");

let nowDay;
let nowMonth;
let nowYear;

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

    let now = new Date();
    if (month === undefined) month = now.getMonth();
    if (year === undefined) year = now.getFullYear();
    let nowMonth = `${monthName[month]}`;
    monthPicker.innerHTML = nowMonth;
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
        listGroupUl.classList.add('list-group', 'list-group-flush');

        // const listGroupUl = document.createElement('ul');
        // listGroupUl.classList.add('list-group', 'list-group-flush');

        dayDiv.appendChild(listGroupUl);
        // cardDiv.appendChild(listGroupUl);

        dayDiv.setAttribute('data-id', `${year}-${month + 1}-${d}`); // 添加唯一的 data-id 属性
        dayDiv.setAttribute('data-bs-toggle', 'modal');
        dayDiv.setAttribute('data-bs-target', '#staticBackdrop');

        days.appendChild(dayDiv);

    }

    //資料storager讀取
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.forEach(todo => {
        const listItem = document.createElement('li');
        listItem.classList.add('list-group-item');
        listItem.textContent = todo.Todo;

        listItem.setAttribute("data-bs-toggle", "modal");
        listItem.setAttribute("data-bs-target", "#staticBackdrop");
        listItem.setAttribute("TodoID", `${todo.Id}`);
        listItem.setAttribute("style", `border-left:5px solid ${todo.Color}`);
        listItem.setAttribute("data-time", todo.Time);

        const targetDateDiv = document.querySelector(`[data-id='${todo.Date}']`);
        const listGroupUl = targetDateDiv.querySelector("ul");
        listGroupUl.appendChild(listItem);
    });

    // 按上個月按鈕

    document.querySelector("#prevMonth").addEventListener("click", () => {
        if (month === 0) {
            getYearMonth(year - 1, 11);
        } else {
            getYearMonth(year, month - 1);
        }
    });

    // 按下個月按鈕
    document.querySelector("#nextMonth").addEventListener("click", () => {
        if (month === 11) {
            getYearMonth(year + 1, 0);
        } else {
            getYearMonth(year, month + 1);
        }
    });

    let nowMonths = monthName[month];
    monthPicker.innerHTML = nowMonths;
    yearPicker.innerHTML = year;
}


getYearMonth();

// 打開modal >>初始化
const exampleModal = document.getElementById('staticBackdrop')
if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', (e) => {
        const button = e.relatedTarget;
        const dateId = button.getAttribute('data-id');
        const [year, month, day] = dateId.split('-');
        document.getElementById('inputId').value = '';
        document.getElementById('inputDate').value = `${year}-${month}-${day}`;
        document.getElementById('inputTime').value = '';
        document.getElementById('inputPlace').value = '';
        document.getElementById('inputTodo').value = '';
        document.getElementById('inputColor').value = '#000000';
    });
    const days = document.querySelector('#days');
    days.addEventListener('click', (e) => {
        if (e.target.classList.contains('list-group-item')) {
            const todoId = e.target.getAttribute('TodoID');
            const todos = JSON.parse(localStorage.getItem('todos')) || [];
            const selectedTodo = todos.find(todo => todo.Id === parseInt(todoId));
            if (selectedTodo) {
                document.getElementById('inputId').value = selectedTodo.Id;
                document.getElementById('inputDate').value = selectedTodo.Date;
                document.getElementById('inputTime').value = selectedTodo.Time;
                document.getElementById('inputPlace').value = selectedTodo.Place;
                document.getElementById('inputTodo').value = selectedTodo.Todo;
                document.getElementById('inputColor').value = selectedTodo.Color;
            }
        }
    });
}

//按下保存後
saveBtn.addEventListener("click", () => {
    const inputId = document.querySelector("#inputId");
    const inputDate = document.querySelector("#inputDate").value.trim();
    const inputTime = document.querySelector("#inputTime").value.trim();
    const inputTodo = document.querySelector("#inputTodo").value.trim();
    const inputPlace = document.querySelector("#inputPlace").value.trim();
    const inputColor = document.querySelector("#inputColor").value.trim();

    const todoAllInfo = {
        Id: inputId?inputId:new Date().valueOf(),
        Date: inputDate,
        Time: inputTime,
        Todo: inputTodo,
        Place: inputPlace,
        Color: inputColor
    };

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    if (inputId) {
        // 如果存在 inputId，则更新现有条目
        let existingTodo = todos.find(todo => todo.Id === parseInt(inputId));
        if (existingTodo) {
            existingTodo.Date = inputDate;
            existingTodo.Time = inputTime;
            existingTodo.Todo = inputTodo;
            existingTodo.Place = inputPlace;
            existingTodo.Color = inputColor;
        }
    } else {
        // 否则添加新条目
        todos.push(todoAllInfo);
    }

    // 将更新后的 todos 存回本地存储
    localStorage.setItem('todos', JSON.stringify(todos));

    // 调用 createDOM 函数更新或创建对应的 li 元素
    createDOM(todoAllInfo);
})


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
    const existingItem = listGroupUl.querySelector(`[TodoID='${todoAllInfo.Id}']`);

    if (existingItem) {
        // 更新现有的 li 元素
        existingItem.textContent = todoAllInfo.Todo;
        existingItem.setAttribute("style", `border-left:5px solid ${todoAllInfo.Color}`);
        existingItem.setAttribute("data-time", todoAllInfo.Time);
    } else {
        // 找到正确的插入位置
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

    // 存储到 localStorage
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let existingTodo = todos.find(todo => todo.Id === todoAllInfo.Id);
    if (existingTodo) {
        // 更新现有的 todo
        existingTodo.Date = todoAllInfo.Date;
        existingTodo.Time = todoAllInfo.Time;
        existingTodo.Todo = todoAllInfo.Todo;
        existingTodo.Place = todoAllInfo.Place;
        existingTodo.Color = todoAllInfo.Color;
    } else {
        // 添加新的 todo
        todos.push(todoAllInfo);
    }
    localStorage.setItem('todos', JSON.stringify(todos));
}


//刪除


