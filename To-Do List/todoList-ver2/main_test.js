/* 
로직 정리
1. 유저가 값을 input에 입력한다
2. +버튼을 누르면 아이템이 추가된다. 할일이 추가 됨
3. 유저가 딜리트 버튼을 누르면 할일이 삭제 된다
4. 체크버튼을 누르면 할일이 끝나면서 밑줄이 생긴다
5. 진행 중 끝남 탭을 누르면 언더바가 이동한다
6. 끝난탭은 끝난 아이템만, 진행중탭은 진행중인 아이템만 보여준다
7. 전체탭을 누르면 전체 목록이 나온다
*/

let taskInput = document.getElementById('task-input');
//console.log(taskInput); 테스트완료
let addButton = document.getElementById('add-button');
//console.log(addButton); 테스트완

let taskList = []; //입력 받은 값 넣을 배열
let filterList = [];
let tabs = document.querySelectorAll('.task-tabs div');
let mode = 'all';

console.log(tabs);

/* +버튼 클릭시 실행할 함수 */
addButton.addEventListener('click', addTask);
/* 입력창에 엔터키 입력시 투두 추가 되는 기능 */
taskInput.addEventListener('keydown', function (event) {
    if (window.event.keyCode === 13) {
        addTask(event);
    }
});

/* tabs 눌렀을 때 기능*/
for (let i = 1; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function (event) {
        filter(event);
    });
}

/* addTask */
function addTask() {
    /* 진행중인지 완료인지 */
    let taskValue = taskInput.value;
    let task = {
        id: randomIDGenerate(),
        taskContent: taskInput.value,
        isComplete: false,
    };
    taskList.push(task);
    taskInput.value = '';
    render();
}

/* taskList 화면에 나타내기 */
function render() {
    let resultHTML = '';
    let list = [];

    if (mode == 'all') {
        list = taskList;
    } else {
        list = filterList;
    }
    for (let i = 0; i < list.length; i++) {
        if (list[i].isComplete) {
            resultHTML += `<div class="task task-done" id="${list[i].id}">
        <span>${list[i].taskContent}</span>
        <div class="button-box">
            <button onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-arrow-rotate-left"></i></button>
            <button onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-delete-left"></i></button>
        </div>
        </div>`;
        } else {
            resultHTML += `<div class="task" id="${list[i].id}">
        <span>${list[i].taskContent}</span>
        <div class="button-box">
            <button onclick="toggleComplete('${list[i].id}')"><i class="fa-solid fa-circle-check"></i></button>
            <button onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-delete-left"></i></button>
        </div>
        </div>`;
        }
    }
    document.getElementById('task-board').innerHTML = resultHTML;
}

function toggleComplete(id) {
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == id) {
            taskList[i].isComplete = !taskList[i].isComplete;
            break;
        }
    }
    filter();
}

function deleteTask(id) {
    //console.log(id);
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === id) {
            taskList.splice(i, 1);
            break;
        }
    }
    filter();
}

function filter(event) {
    if (event) {
        mode = event.target.id;
        document.getElementById('under-line').style.width = event.target.offsetWidth + 'px';
        document.getElementById('under-line').style.top = '52px';
        document.getElementById('under-line').style.left = event.target.offsetLeft + 'px';
    }

    filterList = [];

    if (mode === 'ongoing') {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].isComplete == false) {
                filterList.push(taskList[i]);
            }
        }
    } else if (mode === 'done') {
        for (let i = 0; i < taskList.length; i++) {
            if (taskList[i].isComplete == true) {
                filterList.push(taskList[i]);
            }
        }
    }
    render();
}

/* +버튼 클릭 할 때 마다 랜덤값 부여하기 => 클릭 체크 */
function randomIDGenerate() {
    return Math.random().toString(36).substr(2, 16);
}
