'use strict'
//classを用いてプロパティとメソッドなどをまとめる
class Quiz {
  constructor (quizData){
    this._quizzes = quizData.results
    this._correctAnswersNum = 0
  }

  getQuizCategory(quizIndex){
    return this._quizzes[quizIndex -1].category
  }

  getQuizDifficulty(quizIndex){
    return this._quizzes[quizIndex -1].difficulty
  }

  getQuizQuestion(quizIndex){
    return this._quizzes[quizIndex -1].question
  }

  getQuizQuestion(quizIndex){
    return this._quizzes[quizIndex -1].question
  }

  getCorrectAnswer(quizIndex){
    return this._quizzes[quizIndex -1].correct_answer
  }

  getIncorrectAnswers(quizIndex){
    return this._quizzes[quizIndex -1].incorrect_answers
  }

  countCorrectAnswers(quizIndex,answer){
    const correctAnswer = this.getCorrectAnswer(quizIndex)
    if (correctAnswer === answer) {
      return this._correctAnswersNum++
    }
  }

  getNumQuizzes() {
    return this._quizzes.length
  }

  getCorrectAnswersNum() {
    return this._correctAnswersNum
  }
}

//定数
const QUIZ_API = 'https://opentdb.com/api.php?amount=10'
const quizTitle = document.getElementById('title')
const quizQuestion = document.getElementById('question')
const quizGenre = document.getElementById('genre')
const quizDifficulty = document.getElementById('difficulty')
const startButton = document.getElementById('start-button')
const answersArea = document.getElementById('answers')

//開始ボタンが押されるとボタンは非表示、データを取得する関数を実行する
startButton.addEventListener('click',()=>{
  startButton.hidden = true
  fetchQuizData(1)
})

//fetchを使用し、クイズのデータを取得する
const fetchQuizData = async (index) =>{
  quizTitle.innerText = '取得中'
  quizQuestion.innerText = '少々お待ちください'
  try {
    const res = await fetch(QUIZ_API)
    const quizData = await res.json()
    const quiz = new Quiz(quizData)
    setNextQuiz(quiz,index) 
  } catch (error) {
    console.log(error)
  }
}

const setNextQuiz = (quiz,index) => {
  //答えをリセットする
  answersArea.innerText = ''
  //配列番号が配列の要素の数(10)以下の間は次のクイズを生成
  index <= quiz.getNumQuizzes() ? createQuiz(quiz,index) : finishQuiz(quiz)
}

//クイズを生成する
const createQuiz = (quiz, quizIndex) => {
  quizTitle.innerText = `問題${quizIndex}`
  quizGenre.innerText = `【ジャンル】${quiz.getQuizCategory(quizIndex)}`
  quizDifficulty.innerText = `【難易度】${quiz.getQuizDifficulty(quizIndex)}`
  quizQuestion.innerText = quiz.getQuizQuestion(quizIndex)

  const answers = quiz.getIncorrectAnswers(quizIndex)
  answers.push(quiz.getCorrectAnswer(quizIndex))
  //選択肢(答え)をランダムに出力させる関数
  shuffleQuizAnswers(answers);

  answers.forEach(answer => {
    const createAnswers = document.createElement('li');
    answersArea.appendChild(createAnswers);

    const createButtonAnswers = document.createElement('button');
    createButtonAnswers.innerText = answer;
    answersArea.appendChild(createButtonAnswers)

    createButtonAnswers.addEventListener('click', () => {
      quiz.countCorrectAnswers(quizIndex, answer)
      quizIndex++
      setNextQuiz(quiz,quizIndex)
    })
  })
}

//答えをランダムに出力させる関数
const shuffleQuizAnswers = answers => {
  for (let i = answers.length - 1; i >= 0; i--) {
    let rand = Math.floor(Math.random() * (i + 1))
    ;[answers[i], answers[rand]] = [answers[rand], answers[i]]
  }
  return answers
}

//クイズ終了時の関数
const finishQuiz = quiz => {
  quizTitle.innerText = `あなたの正解数は${quiz.getCorrectAnswersNum()}です!!`
  quizGenre.innerText = ''
  quizDifficulty.innerText = ''
  quizQuestion.innerText = `再度チャレンジしたい方は以下をクリック`

  const restartButton = document.createElement('button')
  restartButton.innerText = `ホームに戻る`
  answersArea.appendChild(restartButton)
  restartButton.addEventListener('click',() =>{
    location.reload()
  })
}
