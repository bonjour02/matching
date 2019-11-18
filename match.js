/*
GET https://codetest.hwahae.co.kr/3 (참여 대상자 3명의 데이터가 응답됨)
  GET https://codetest.hwahae.co.kr/100 (참여 대상자 100명의 데이터가 응답됨)
  GET https://codetest.hwahae.co.kr/10000 (참여 대상자 10000명의 데이터가 응답됨)
  */
const HWAHAE_URL = 'https://codetest.hwahae.co.kr/100';
const loader = document.getElementById('loader');
let timer;

const fatchUserData = () =>  {
  return fetch(HWAHAE_URL)
          .then(response => response.json())
          .catch((e) => {
            loader.style.display = 'none';
            console.log('network error');
          });
}


const matchData = (userData) =>  {
  let len = userData.length;
  let matchingResult = [];
  let maxPoint = 0;

  let left, result;

  for( let i = 0; i < len -1; i++)  {
    left = [...userData[i][1]];

    for(let j=i+1; j < len; j++) {
      result = left.filter(leftValue => userData[j][1].has(leftValue));

      if (result.length > 0 && result.length >= maxPoint)  {
        maxPoint = result.length;
        matchingResult.push({'leftIndex': i+1, 'rightIndex': j+1, 'left': userData[i][0], 'right': userData[j][0],'matching': result, 'matchingPoint': result.length});
      }
    }
  }

  return matchingResult.filter(item => item.matchingPoint === maxPoint);
}


const matchDataWithKeyword = (userData, keyword) =>  {
  let len = userData.length;
  let matchingResult = [];
  let result;

  for( let i = 0; i < len -1; i++)  {
    for(let j=i+1; j < len; j++) {
      result = userData[i][1].has(keyword) && userData[j][1].has(keyword);

      if(result) matchingResult.push({'leftIndex':i+1, 'rightIndex':j+1, 'left': userData[i][0], 'right': userData[j][0], 'matching': keyword, 'matchingPoint': 1});
    }
  }

  return matchingResult;
}


const showResult = (matchedData) =>  {

  let tbody = document.querySelector('tbody');
  loader.style.display = 'none';

  let matched = matchedData.slice(0, 100);
  let remain = matchedData.slice(100);

  Promise.resolve(
    matched.forEach(row =>  {
      let tr = document.createElement('tr');

      let td = document.createElement('td');
      td.textContent = row.leftIndex + '-' + row.rightIndex;
      tr.appendChild(td);

      td = document.createElement('td');
      td.textContent = row.left;
      tr.appendChild(td);

      td = document.createElement('td');
      td.textContent = row.right;
      tr.appendChild(td);

      tbody.appendChild(tr);
    }))
  .then( () => {
      if(remain && remain.length > 0) {
        loader.style.display = 'block';
        timer = setTimeout(()=>showResult(remain), 1000);
      }
  });

}


const coupleMatching = (matchingKeyword) => {
  let userData = [];
  let matchedData = [];

  if(timer) clearTimeout(timer);

  Promise.resolve(fatchUserData())
    .then((data) => {
      userData = data.map(item =>[item, new Set(item)]);
      matchedData = (matchingKeyword && matchingKeyword.length > 0) ? matchDataWithKeyword(userData, matchingKeyword) : matchData(userData);
      showResult(matchedData);
    })
    .catch((e) => {
      loader.style.display = 'none';
      console.log('try again');
    });
}


const changeFilter = () => {
  let filter = document.getElementById('filter').value;
  let tbody = document.querySelector('tbody');

  while(tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  loader.style.display = 'block';

  coupleMatching(filter);
}


document.addEventListener('DOMContentLoaded', coupleMatching);