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
    exampleModal.addEventListener('show.bs.modal', (event) => {
        const button = event.relatedTarget;
        const dateId = button.getAttribute('data-id');
        const [year, month, day] = dateId.split('-');
        document.getElementById('inputId').value = '';
        document.getElementById('inputDate').value = `${year}-${month}-${day}`;
        document.getElementById('inputTime').value = '';
        document.getElementById('inputPlace').value = '';
        document.getElementById('inputTodo').value = '';
        document.getElementById('inputColor').value = '#000000';
    })
}

//按下保存後
saveBtn.addEventListener("click", () => {
    // const inputId = document.querySelector("#inputId");
    const inputDate = document.querySelector("#inputDate").value.trim();
    const inputTime = document.querySelector("#inputTime").value.trim();
    const inputTodo = document.querySelector("#inputTodo").value.trim();
    const inputPlace = document.querySelector("#inputPlace").value.trim();
    const inputColor = document.querySelector("#inputColor").value.trim();

    const todoAllInfo = {
        Id: new Date().valueOf(),
        Date: inputDate,
        Time: inputTime,
        Todo: inputTodo,
        Place: inputPlace,
        Color: inputColor
    };
    createDOM(todoAllInfo);
    // renderingTodoList();
})


function createDOM(todoAllInfo) {
    const todoItemEl = todoItemTemplate.content.cloneNode(true);

    const listItem = todoItemEl.querySelector(".list-group-item");
    listItem.textContent = todoAllInfo.Todo;

    listItem.setAttribute("data-bs-toggle", "modal");
    listItem.setAttribute("data-bs-target", "#staticBackdrop");
    listItem.setAttribute("TodoID", `${todoAllInfo.Id}`)

    const targetDateDiv = document.querySelector(`[data-id='${todoAllInfo.Date}']`);
    
    const listGroupUl = targetDateDiv.querySelector("ul");
    listGroupUl.appendChild(todoItemEl);

    // listGroupUl.appendChild(listItem);
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

    listItem.setAttribute("data-time", todoAllInfo.Time);

}
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('submit', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
})()




//資料storage

//刪除


