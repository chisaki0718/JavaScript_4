const quizTitle = document.getElementById('title');
const quizGenre = document.getElementById('genre');
const quizDifficulty = document.getElementById('difficulty');
const startButton = document.getElementById('start-button');
const quizQuestion = document.getElementById('question');
const quizAnswers = document.getElementById('answers')
const backHome = document.getElementById('back-home');
const backHomeButton = document.createElement('button');
const apiData = 'https://opentdb.com/api.php?amount=11';


let quizIndexNum = 0;
let correctAnswer = 0;

/*
②クイズのデータをjson形式で取得し、さらには配列を取り込む
非同期処理を実行させつつ、取得できるまでは取得中と表示させる
*/
const fetchQuizData = () => {
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(fetch(apiData)
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            return Promise.reject(new Error('エラーです'));
          }
        })
        .then(jsonData => {
          const quizDataList = jsonData.results
          //③クイズを出力する関数に配列データを渡す
          createQuiz(quizDataList, quizIndexNum);
        })
        .catch(error => {
          alert('データの取得に失敗しました。')
        })
      )
    }, 1000);
    quizTitle.innerHTML = `取得中`;
    quizQuestion.innerHTML = `少々お待ちください`
    //スタートボタンにactiveが付いていなければ付与しdisplay:none;にする
    startButton.classList.toggle('active')
    //もう一度チャレンジする際はカウントを0から始める為にリセットする
    correctAnswer = 0;
  });
}
//①startボタンが押されたらクイズのデータを取得する
startButton.addEventListener('click', fetchQuizData);

//③各クイズを出力する関数
const createQuiz = (quizDataList, quizIndexNum) => {
  const quiz = quizDataList[quizIndexNum];
  quizTitle.innerHTML = `問題${quizIndexNum + 1}`;
  quizGenre.innerHTML = `【ジャンル】${quiz.category}`;
  quizDifficulty.innerHTML = `【難易度】${quiz.difficulty}`;
  quizQuestion.innerHTML = quiz.question;
  const answers = quiz.incorrect_answers;
  answers.push(quiz.correct_answer);
  //選択肢(答え)をランダムに出力させる関数
  shuffleQuizAnswers(answers);

  answers.forEach(answer => {
    const createLiAnswers = document.createElement('li');
    quizAnswers.appendChild(createLiAnswers);

    const createButtonAnswers = document.createElement('button');
    createButtonAnswers.innerHTML = answer;
    createLiAnswers.appendChild(createButtonAnswers);

    createButtonAnswers.addEventListener('click', () => {
      quizIndexNum++
      if(createButtonAnswers.innerHTML === quiz.correct_answer){
        correctAnswer++;
      }
      quizAnswers.innerHTML = '';
      createQuiz(quizDataList, quizIndexNum)

      if (quizIndexNum === 10) {
        quizTitle.innerHTML = `あなたの正解数は${correctAnswer}です!!`;
        quizGenre.innerHTML = '';
        quizDifficulty.innerHTML = '';
        quizQuestion.innerHTML = `再度チャレンジしたい方は以下をクリック`;
        quizAnswers.innerHTML = '';
        backHomeButton.innerHTML = `ホームに戻る`;
        backHome.appendChild(backHomeButton);
      }
    })
  })
}

//答えをランダムに出力させる関数
const shuffleQuizAnswers = answers => {
  for (let i = answers.length - 1; i >= 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[rand]] = [answers[rand], answers[i]]
  }
  return answers;
}


//再チャレンジ用関数
const restartQuiz = () => {
  quizTitle.innerHTML = `ようこそ`;
  quizGenre.innerHTML = '';
  quizDifficulty.innerHTML = '';
  quizQuestion.innerHTML = `以下のボタンをクリック`;
  backHome.innerHTML = '';
  startButton.classList.toggle('active')
}
//ホームに戻るボタンを押したらホーム（最初の状態）に戻す関数
backHomeButton.addEventListener('click', restartQuiz);
