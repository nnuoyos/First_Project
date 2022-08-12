let computerNumber = 0;
let playButton = document.getElementById('play_button');
let userInput = document.querySelector('#user_input');
let resultArea = document.getElementById('resultArea');
let resetButton = document.querySelector('#reset_button');
let chanceArea = document.getElementById('chance_area');
let chances = 7;
let gameOver = false;
let userValueList = [];

/* addEventListener('이벤트의 이름', 이벤트 발생시 실행시킬 함수 이름) */

playButton.addEventListener('click', play); /* 클릭 했을 시 일어나는 이벤트 */
resetButton.addEventListener('click', reset);
userInput.addEventListener('focus', function () {
    userInput.value = '';
});
//함수를 따로 선언하지 않고 익명함수 선언 가능
//=> 메모리 공간 절약 위해 단, 기능이 단순하고 다른곳에서 사용되지 않을 경우에만!

function pickRandomNumber() {
    computerNumber = Math.floor(Math.random() * 100) + 1;
    //1~100까지 숫자 설정하기
    //Math.random() 는 0~1 사이의 소수가 랜덤으로 나온다 여기서 *100을 해주고 Math.floor로 소수점 아래를 버린다
    //이렇게 되면 0~99 까지의 숫자가 나오는데 마지막에 + 1을 해줘서 100을 포함하게 설정한다

    console.log(computerNumber);
}

function play() {
    /* 상수 선언, 상수는 대문자로 표기 */
    /* userInput의 value값을 저장 , USER_VALUE 는 입력되는 숫자에 대한 값이 저장됨*/
    const USER_VALUE = userInput.value;

    /*유효성 검사*/
    if (USER_VALUE < 1 || USER_VALUE > 100) {
        resultArea.textContent = '1~100 사이의 숫자를 입력해 주세요';
        return; //함수의 아웃풋 함수 강제 종료 => 범위를 넘어선 숫자 입력시 chance가 깎이지 않도록 한다
    }
    /*입력받은 값이 배열에 이미 있는 값인지 확인 */
    if (userValueList.includes(USER_VALUE)) {
        resultArea.textContent = '이미 입력한 숫자 입니다!';
        return;
    }

    userValueList.push(USER_VALUE); //입력받은 값을 배열에 추가

    /*업다운 판별 조건식*/
    if (USER_VALUE < computerNumber) {
        resultArea.textContent = 'UP!!'; /* html에 연결해서 사용자가 화면상에서 볼 수 있도록 하기 */
    } else if (USER_VALUE > computerNumber) {
        resultArea.textContent = 'DOWN!!';
    } else {
        resultArea.textContent = '정답!!';
        gameOver = true; //정답일시 버튼 비활성화
    }
    chances--; //클릭할 때 마다 기회 하나씩 줄어들기
    chanceArea.innerHTML = `남은 찬스 : ${chances}번`;
    //백틱 사용하면 동적,정적 코드를 같이 사용할 수 있다

    if (chances == 0) {
        gameOver = true;
    }
    if (gameOver /* == true*/) {
        //위의 if문이 true라면 gameOver값은 true가 되어있음
        playButton.disabled = true; //게임오버가 트루라면, 버튼 비활성화 시킴
    }
}

/*function focusInput() {
    userInput.value = '';
} 위에서 익명함수 만들었기 때문에 따로 함수 선언 하지 않음*/

function reset() {
    pickRandomNumber(); //랜덤숫자 다시 불러오기
    userInput.value = ''; //빈칸으로 만들기
    resultArea.textContent = '결과가 나온다';
    gameOver = false;
    playButton.disabled = false;
    chances = 7;
    chanceArea.innerHTML = `남은 찬스 : ${chances}번`;
    userValueList = [];
}

pickRandomNumber();
