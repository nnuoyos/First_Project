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
// console.log(taskInput);
let addButton = document.getElementById('add-button');
// console.log(addButton);

let taskList = []; //입력 받은 값을 차례로 배열에 넣을 예정
let filterList = [];
let tabs = document.querySelectorAll('.task-tabs div');
let mode = 'all'; //디폴트 값을 all로 해서 할일 추가버튼 누를때마다 바로바로 all창에 보인다

console.log(tabs);

/* +버튼이 클릭 되었을 때 실행할 함수 */
addButton.addEventListener('click', addTask);
/* 입력창에 엔터키 눌렀을 때 실행할 함수 */
taskInput.addEventListener('keydown', function (event) {
    if (window.event.keyCode === 13) {
        addTask(event);
    }
});

//tabs를 눌렀을 때 함수기능 (일회성이기 때문에 여기서 바로 호출하여 사용한다)
//filter함수에 event를 인자로 받아오기
for (let i = 1; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function (event) {
        filter(event);
    });
}

function addTask() {
    //객체에 있는 정보가 완료인지 진행중인지에 대한 정보 필요
    let taskValue = taskInput.value;
    let task = {
        id: randomIDGenerate(),
        taskContent: taskInput.value,
        isComplete: false,
    };
    taskList.push(task);
    //console.log('click check'); 확인용
    //taskInput의 value값으로 들어간다
    // let taskContent = taskInput.value;
    // taskList.push(taskContent);
    //console.log(taskList);
    taskInput.value = ''; //입력 후 입력창 비우기
    render();
}

//taskList를 화면상에 나타나도록 하기
//taskList[i]의 taskContent 객체 가져오기
//${taskList[i].id} 체크버튼이 눌러질때마다 id값이 인자로 들어온다
function render() {
    let resultHTML = '';
    let list = [];
    if (mode == 'all') {
        list = taskList;
    } else {
        list = filterList;
    } //필터 함수에서 걸러져서 올라오기 때문에 이렇게 작성 mode == ongoing || mode == done
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
/* 
click 이벤트를 주는 방법 두가지
addEventListener를 사용하거나
해당태그에 onclick 속성을 주는 방법
onclick="함수이름()"의 양식으로 이용할 수 있다
*/

/* 
innerHTML과 textContent의 차이점
innerHTML : Element의 HTML, XML을 읽어 오거나 설정할 수 있다
태그 안에 있는 HTML 전체내용을 들고 온다

textContent : 해상 노드가 가지고 있는 텍스트 값을 그대로 들고 온다
*/

function toggleComplete(id) {
    //console.log(id);
    //id값이 일치 할 때, not 연산자로 반대의 값을 보여준다
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id == id) {
            taskList[i].isComplete = !taskList[i].isComplete;
            break;
        }
    }
    filter();
    //console.log(taskList);
}

function deleteTask(id) {
    //console.log(id);
    for (let i = 0; i < taskList.length; i++) {
        if (taskList[i].id === id) {
            taskList.splice(i, 1); //i번째에 1개의 아이템만 삭제하기
            break;
        }
    }
    filter();
    //render();
}

//여기서 이벤트란 클릭했을때 일어나는 모든 일, 어떤일에 대해서인지 알고 싶다면 .을 찍는다
//event.target => 내가 찍은 것의 ~~
function filter(event) {
    if (event) {
        mode = event.target.id;
        //console.log('check', event.target.id);
        document.getElementById('under-line').style.width = event.target.offsetWidth + 'px';
        document.getElementById('under-line').style.top = '52px';
        document.getElementById('under-line').style.left = event.target.offsetLeft + 'px';
    }
    //offsetWith 속성 => 클릭한 객체의 높이 값 만큼만 속성을 준다
    //offsetLeft 속성 => 클릭한 객체의 레프트값 만큼만 속성을 준다

    filterList = [];
    //taskList = filterList; //덮어쓰기 로직을 짜면 일시적으로 밖에 못 쓴다
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
    //console.log(filterList);
}

function randomIDGenerate() {
    return Math.random().toString(36).substr(2, 16);
}

/* 
추가 작업
1. 아이콘 넣기:: 체크버튼<->리프레쉬 버튼 / 삭제버튼 //완료
2. 입력창에 엔터값으로 할 일 추가할 수 있도록 하기 (커서올리면 전에 쓴 글 지우기 포함) //완료
3. 진행중,끝남 탭에서 체크버튼,딜리트버튼 눌렀을 때 UI(화면상)에 바로 업데이트 시키기

*/
