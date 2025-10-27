// 等待 HTML 內容都載入完成後再執行
document.addEventListener('DOMContentLoaded', () => {
    
    // --- 腳本啟動測試點 (確認腳本有無啟動) ---
    console.log("✅ 遊戲腳本 (script.js) 已成功啟動！");

    // --- 1. 抓取所有需要的 HTML 元件 ---
    // 抓取所有畫面
    const screens = document.querySelectorAll('.screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const introScreen = document.getElementById('intro-screen');
    const questionScreen = document.getElementById('question-screen');
    const finishScreen = document.getElementById('finish-screen');
    
    // 抓取動物體重資訊框
    const animalData = document.getElementById('animal-data'); 

    // 抓取所有按鈕
    const startBtn = document.getElementById('start-btn');
    const startChallengeBtn = document.getElementById('start-challenge-btn');
    const submitBtn = document.getElementById('submit-btn');
    const hintBtn = document.getElementById('hint-btn');
    const restartBtn = document.getElementById('restart-btn');

    // 抓取問題區的元件
    const questionText = document.getElementById('question-text');
    const questionHint = document.getElementById('question-hint');
    const answerInput = document.getElementById('answer-input');
    const feedbackText = document.getElementById('feedback-text');

    // --- 2. 遊戲資料 ---
    // 基準量 (非洲象體重: 6公噸)
    const baseAmount = 6; 
    
    // 題目資料 (來自習作 P.92 例 1)
    const questions = [
        {
            text: "第一題：抹香鯨體重是非洲象體重的幾倍？",
            comparisonAmount: 30, // 抹香鯨
            correctAnswer: 5, 
            hint: "公式：比較量 ÷ 基準量 = 幾倍<br>請計算：30 ÷ 6 = ?"
        },
        {
            text: "第二題：鯨鯊體重是非洲象體重的幾倍？",
            comparisonAmount: 18, // 鯨鯊
            correctAnswer: 3, 
            hint: "公式：比較量 ÷ 基準量 = 幾倍<br>請計算：18 ÷ 6 = ?"
        },
        {
            text: "第三題：犀牛體重是非洲象體重的幾倍？",
            comparisonAmount: 3, // 犀牛
            correctAnswer: 0.5, 
            alternativeAnswer: "1/2", 
            hint: "公式：比較量 ÷ 基準量 = 幾倍<br>請計算：3 ÷ 6 = ? (答案會小於1喔！)"
        }
    ];

    // 遊戲狀態變數
    let currentQuestionIndex = 0;

    // --- 3. 核心功能函式 ---

    // 函式：切換畫面 (已加入表格顯示控制)
    function showScreen(screenToShow) {
        // 隱藏所有畫面
        screens.forEach(screen => {
            screen.classList.remove('active');
        });
        // 只顯示指定的畫面
        screenToShow.classList.add('active');
        
        // 邏輯：控制動物資訊表的顯示
        if (screenToShow === welcomeScreen) {
            // 如果是歡迎畫面，隱藏表格
            animalData.style.display = 'none';
        } else {
            // 如果是介紹、問題或結束畫面，顯示表格
            animalData.style.display = 'block';
        }
    }

    // 函式：顯示特定題目
    function showQuestion(index) {
        const question = questions[index];
        
        questionText.innerText = question.text;
        questionHint.innerHTML = `<strong>提示小幫手：</strong><br>比較量 (體重): ${question.comparisonAmount} 公噸<br>基準量 (非洲象): ${baseAmount} 公噸<br><br>${question.hint}`;
        
        questionHint.style.display = 'none';
        answerInput.value = '';
        feedbackText.innerText = '';
        feedbackText.className = '';
    }

    // 函式：檢查答案
    function checkAnswer() {
        const userAnswer = answerInput.value.trim();
        const currentQuestion = questions[currentQuestionIndex];
        
        const isCorrect = Math.abs(parseFloat(userAnswer) - currentQuestion.correctAnswer) < 0.0001; 
        const isFractionCorrect = currentQuestion.alternativeAnswer && userAnswer === currentQuestion.alternativeAnswer;

        if (isCorrect || isFractionCorrect) {
            feedbackText.innerText = `✅ 答對了！算式：${currentQuestion.comparisonAmount} ÷ ${baseAmount} = ${currentQuestion.correctAnswer}`;
            feedbackText.className = 'correct';
            
            submitBtn.disabled = true;
            hintBtn.disabled = true;

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    showQuestion(currentQuestionIndex);
                    submitBtn.disabled = false;
                    hintBtn.disabled = false;
                } else {
                    showScreen(finishScreen);
                }
            }, 1500); 

        } else if (parseFloat(userAnswer) * currentQuestion.comparisonAmount === baseAmount) {
            feedbackText.innerText = `❌ 喔喔！是不是算反了呢？您可能算成 ${baseAmount} ÷ ${currentQuestion.comparisonAmount} 了！記得用「比較量」除以「基準量」喔！`;
            feedbackText.className = 'incorrect';
        } 
        else {
            feedbackText.innerText = "❌ 沒關係，再想想看！記得要用「比較量」除以「基準量」喔！";
            feedbackText.className = 'incorrect';
        }
    }

    // 函式：顯示提示
    function showHint() {
        questionHint.style.display = 'block';
    }
    
    // 函式：重新開始遊戲
    function restartGame() {
        currentQuestionIndex = 0;
        showScreen(welcomeScreen);
    }

    // --- 4. 幫按鈕綁定功能 (事件監聽) ---
    
    // 按下「開始遊戲」 (已加強檢查)
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            console.log("➡️「開始遊戲」按鈕被點擊了！"); 
            showScreen(introScreen); // 顯示介紹畫面
        });
    } else {
        console.error("❌ 嚴重錯誤：找不到 ID 為 'start-btn' 的按鈕！請檢查 index.html 的 ID 是否正確。");
    }


    // 按下「我懂了，開始挑戰！」
    startChallengeBtn.addEventListener('click', () => {
        showQuestion(0); // 顯示第一題
        showScreen(questionScreen); // 顯示問題畫面
    });

    // 按下「送出答案」
    submitBtn.addEventListener('click', checkAnswer);

    // 按下「我需要提示」
    hintBtn.addEventListener('click', showHint);

    // 按下「再玩一次」
    restartBtn.addEventListener('click', restartGame);

});
