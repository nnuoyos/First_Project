/* API를 호출하는 함수 만들기 */
//postman에서 쓴 url 그대로 들고 오기
//자바스크립트에서 제공해주는 tool을 이용해서 url을 보여준다

// API 출처 : https://app.newscatcherapi.com/dashboard

let articles = [];
let menus = document.querySelectorAll('#menu-list button');
menus.forEach((menu) => menu.addEventListener('click', (event) => getNewsByTopic(event)));
let searchButton = document.getElementById('search-button');
let searchInput = document.getElementById('search-input');
let url;
let page;
let last;
let first;
let totalPage;
let maxPage;
let pageCount;
let pageGroup;

//뉴스 기사 가져오기
const getNews = async () => {
    try {
        let header = new Headers({ 'x-api-key': 'DvZXfYgusNFUJyNCpHVf3MZvG9br4IJU3JL8UjtV-AU' });
        url.searchParams.set('page', page);
        console.log('url 잘 들어왔나?', url);
        let response = await fetch(url, { headers: header });
        let data = await response.json(); //json : 서버통신에 사용 되어짐.텍스트 타입인 객체라고 보면 된다
        //200(정상으로 실행 될 때의 상태)
        if (response.status == 200) {
            news = data.articles; //아티클만 따로 뽑아내기 (뉴스 기사만 유저들에게 보여주기)
            console.log('내가 받을 데이터는?', data);
            if (data.total_hits == 0) {
                throw new Error('검색된 결과가 없습니다.');
            }
            //API를 받아오면서 페이지 정보를 가져옴
            totalPage = data.total_pages;
            page = data.page;
            render();
            pageNation();
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        console.log('잡힌 에러는?', error.message);
        errorRender(error.message);
    }
};
//사이트 들어갔을 때 첫 화면의 기사 보여주기
const getLatestNews = async () => {
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`);
    getNews();
};
// 토픽 버튼 눌렀을 때 해당 토픽의 기사 보여주기
const getNewsByTopic = async (event) => {
    let topic = event.target.textContent.toLowerCase();
    //getLatestNews();
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`);
    page = 1;
    getNews();
};
//검색 기능
const getNewsByKeyword = async () => {
    let keyword = document.getElementById('search-input').value;
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&&countries=KR&page_size=10`);
    page = 1;
    getNews();
};
// keydown 엔터키 눌러도 검색 되도록 하기
searchInput.addEventListener('keydown', function (event) {
    if (window.event.keyCode === 13) {
        getNewsByKeyword(event);
    }
});
//렌더-화면에 보여주기
const render = () => {
    let newsHTML = '';
    newsHTML = news
        .map((news) => {
            return `
            <div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size"
            src="${news.media || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqEWgS0uxxEYJ0PsOb2OgwyWvC0Gjp8NUdPw&usqp=CAU'}" alt="news img" />
        </div>
        <div class="col-lg-8">
            <a class="title" target="_black" href="${news.link}">${news.title}</a>
            <p>${news.summary == null || news.summary == '' ? '내용 없음' : news.summary.length > 200 ? news.summary.substring(0, 200) + '...' : news.summary}</p>
            <div> ${news.rights || 'No source'} * ${moment(news.published_date).fromNow()}</div>
        </div>
    </div>`;
        })
        .join(''); //join():배열을 스트링으로 바꿈 /array [a,b,c]에 나오는 ,콤마가 화면에 나타나는 것을 없앤다 (기사들 사이에 , 찍혀있음)

    document.getElementById('news-board').innerHTML = newsHTML;
};
//에러 메세지를 유저에게 보여주기
const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">${message}</div>`;
    document.getElementById('news-board').innerHTML = errorHTML;
};
/* 
1. total page 수를 알야아 한다 
    API를 받아오면서 페이지 정보를 가져옴
    totalPage = data.total_pages;
    page = data.page;
2. 내가 현재 어떤 페이지를 보고 있는지 알아야 한다
*/
//페이지네이션
const pageNation = () => {
    pageNationHTML = ``;
    //3. 페이지 그룹을 찾아야 한다 한 그룹에 1~5 까지
    //4. 이 그룹을 베이스로 마지막 페이지가 무엇인지 찾고,
    //5. 첫번째 페이지가 무엇인지 찾고,
    //6. 첫 페이지부터 마지막까지 프린트, 출력해주기
    pageCount = 5;
    pageGroup = Math.ceil(page / pageCount);
    last = pageGroup * 5;
    first = last - 4;

    if (last > totalPage) {
        //마지막 페이지그룹에 빈 페이지 없도록 하기
        last = totalPage;
    }
    maxPage = Math.ceil(totalPage / 5); // maxPage를 구해서 마지막 페이지 그룹일 때 next 버튼 없애주기
    /* pageGroup 1번째 일 때 Prev 버튼 없애기 */
    //맨 첫페이지로 이동
    if (pageGroup > 1) {
        pageNationHTML = `<li class="page-item">
        <a class="page-link" href="#" aria-label="AllPrevious" onclick="moveToPage()">
        <span aria-hidden="true">&lt;&lt;</span>
        </a>
        </li>
        <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})">
        <span aria-hidden="true">&lt;</span>
        </a>
        </li>`;
    }
    //표시 되는 페이지가 5개 이상일 때 페이지네이션 구성
    if (pageGroup >= 1) {
        for (let i = first; i <= last; i++) {
            pageNationHTML += `<li class="page-item ${page == i ? 'active' : ''}">
            <a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a>
            </li>`;
        }
    }
    /* pageGroup 마지막 일 때 Next 버튼 없애기 */
    if (pageGroup < maxPage) {
        pageNationHTML += `<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
        <span aria-hidden="true">&gt;</span>
        </a>
        </li>
        <li class="page-item">
        <a class="page-link" href="#" aria-label="AllNext" onclick="moveToPage(${totalPage})">
        <span aria-hidden="true">&gt;&gt;</span>
        </a>
        </li>`;
    }
    document.querySelector('.pagination').innerHTML = pageNationHTML;
};
const moveToPage = (pageNumber) => {
    // 1. 이동하고 싶은 페이지를 알아야 한다 (1인지, 8인지, 143인지 등등)
    // 2. 페이지를 가지고 API를 호출해준다
    console.log(pageNumber);
    page = pageNumber;
    getNews();
};
searchButton.addEventListener('click', getNewsByKeyword);
getLatestNews();
