// Enhanced Custom mouse tracking view with cognitive load metrics
const vocabulary_mouse_tracking_function = function(config) {
    const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbzZ6jUnPqkxA-VZP7gz-yOP4DSCMlgqieIatMesnzUZiURPj36SMYUrddMCV1BllFcMvA/exec";

    const view = {
        name: config.name,
        CT: 0,
        trials: config.trials,
        allMouseData: [],
        allResponses: [],
        totalScore: 0,
        demographics: {},
        currentTrialMouseData: [], // Store mouse data for current passage

        // Calculate cognitive load metrics
        calculateMetrics: function(mouseData, itemId) {
            if (mouseData.length < 2) return null;

            const startTime = mouseData[0].time;
            const endTime = mouseData[mouseData.length - 1].time;
            const totalTime = endTime - startTime;

            // Find first meaningful movement (initiation time)
            let initiationTime = 0;
            for (let i = 1; i < mouseData.length; i++) {
                const dx = mouseData[i].x - mouseData[i-1].x;
                const dy = mouseData[i].y - mouseData[i-1].y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                if (distance > 5) { // Movement threshold
                    initiationTime = mouseData[i].time - startTime;
                    break;
                }
            }

            // Calculate path length
            let pathLength = 0;
            for (let i = 1; i < mouseData.length; i++) {
                const dx = mouseData[i].x - mouseData[i-1].x;
                const dy = mouseData[i].y - mouseData[i-1].y;
                pathLength += Math.sqrt(dx*dx + dy*dy);
            }

            // Calculate speeds and find max speed
            let speeds = [];
            for (let i = 1; i < mouseData.length; i++) {
                const dx = mouseData[i].x - mouseData[i-1].x;
                const dy = mouseData[i].y - mouseData[i-1].y;
                const distance = Math.sqrt(dx*dx + dy*dy);
                const timeDiff = mouseData[i].time - mouseData[i-1].time;
                if (timeDiff > 0) {
                    speeds.push(distance / timeDiff);
                }
            }
            const avgSpeed = speeds.length > 0 ? speeds.reduce((a, b) => a + b, 0) / speeds.length : 0;

            // Calculate ideal straight-line path for deviation metrics
            const startX = mouseData[0].x;
            const startY = mouseData[0].y;
            const endX = mouseData[mouseData.length - 1].x;
            const endY = mouseData[mouseData.length - 1].y;

            // Calculate deviations from ideal path
            let deviations = [];
            let areaUnderCurve = 0;

            for (let i = 0; i < mouseData.length; i++) {
                const progress = i / (mouseData.length - 1);
                const idealX = startX + progress * (endX - startX);
                const idealY = startY + progress * (endY - startY);
                
                const deviation = Math.sqrt(
                    Math.pow(mouseData[i].x - idealX, 2) + 
                    Math.pow(mouseData[i].y - idealY, 2)
                );
                deviations.push(deviation);
                
                if (i > 0) {
                    areaUnderCurve += (deviations[i] + deviations[i-1]) / 2;
                }
            }

            const maxDeviation = Math.max(...deviations);

            // Calculate dwell time (time spent in word areas)
            let dwellTime = 0;
            let lastWordTime = 0;
            for (let i = 0; i < mouseData.length; i++) {
                if (mouseData[i].word && mouseData[i].word.trim() !== '') {
                    if (lastWordTime > 0) {
                        dwellTime += mouseData[i].time - lastWordTime;
                    }
                    lastWordTime = mouseData[i].time;
                } else {
                    lastWordTime = 0;
                }
            }

            // Calculate hesitation count (pauses or direction changes)
            let hesitationCount = 0;
            let velocityThreshold = 50; // pixels per second
            for (let i = 2; i < mouseData.length; i++) {
                const currentSpeed = speeds[i-1] || 0;
                const prevSpeed = speeds[i-2] || 0;
                
                if (prevSpeed > velocityThreshold && currentSpeed < velocityThreshold/2) {
                    hesitationCount++;
                }
            }

            return {
                ItemId: itemId,
                n_samples: mouseData.length,
                total_time_ms: totalTime,
                initiation_time_ms: initiationTime,
                path_length: Math.round(pathLength * 100) / 100,
                avg_speed: Math.round(avgSpeed * 100) / 100,
                max_deviation: Math.round(maxDeviation * 100) / 100,
                auc_deviation: Math.round(areaUnderCurve * 100) / 100,
                dwell_time_s_approx: Math.round(dwellTime / 1000 * 100) / 100,
                hesitation_count: hesitationCount
            };
        },

        // Step 1: Instructions + Demographics
        start: function(magpie) {
            $('#main').html(`
                <div class='magpie-view'>
                    <h1>Reading Comprehension Assessment with Cognitive Load Analysis</h1>
                    <div style="text-align: left; max-width: 800px; margin: 0 auto; line-height: 1.6;">
                        <h2>Instructions for Participants</h2>
                        
                        <p><strong>Purpose:</strong> This study investigates cognitive processing patterns during academic reading comprehension tasks using advanced mouse-tracking technology to analyze vocabulary acquisition difficulties in intermediate English as Second Language (ESL) learners.</p>
                        
                        <p><strong>Procedure:</strong></p>
                        <ul style="text-align: left;">
                            <li>You will complete demographic information followed by five (5) reading comprehension passages</li>
                            <li>Each passage focuses on engineering and technical concepts appropriate for intermediate ESL proficiency levels</li>
                            <li>Passages will initially appear blurred; move your cursor over words to reveal clear text</li>
                            <li>Read each passage thoroughly at your natural pace - your mouse movements are being recorded for cognitive load analysis</li>
                            <li>After completing each passage, respond to three (3) True/False comprehension questions</li>
                            <li>Total estimated completion time: 20-25 minutes</li>
                        </ul>
                        
                        <p><strong>Technical Requirements:</strong> Ensure your mouse/trackpad is functioning properly and maintain consistent cursor control throughout the assessment.</p>
                        
                        <p><strong>Data Collection:</strong> This system captures mouse trajectory data, response times, and accuracy measures to evaluate cognitive processing patterns and vocabulary comprehension strategies.</p>
                        
                        <p><em>Please complete all demographic fields accurately before proceeding to the reading assessment.</em></p>
                    </div>
                    <h2>Participant Information</h2>
                    <label>Name: <input type="text" id="name" required></label><br><br>
                    <label>Reg No.: <input type="text" id="regNo" required></label><br><br>
                    <label>Age: <input type="number" id="age" min="18" max="100" required></label><br><br>
                    <label>Gender: 
                        <select id="gender" required>
                            <option value="">--Select--</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label><br><br>
                    <label>First Language: <input type="text" id="firstLanguage" required></label><br><br>
                    <label>Second Language: <input type="text" id="secondLanguage" required></label><br><br>
                    <label>Designation: 
                        <select id="designation" required>
                            <option value="">--Select--</option>
                            <option value="Research">Research</option>
                            <option value="Student">Student</option>
                        </select>
                    </label><br><br>
                    <button id="start-experiment">Start Experiment</button>
                </div>
            `);

            $('#start-experiment').on('click', () => {
                // Validate all required fields
                const name = $('#name').val().trim();
                const regNo = $('#regNo').val().trim();
                const age = $('#age').val();
                const gender = $('#gender').val();
                const firstLanguage = $('#firstLanguage').val().trim();
                const secondLanguage = $('#secondLanguage').val().trim();
                const designation = $('#designation').val();

                if (!name || !regNo || !age || !gender || !firstLanguage || !secondLanguage || !designation) {
                    alert('Please fill in all required fields.');
                    return;
                }

                this.demographics = {
                    name: name,
                    regNo: regNo,
                    age: age,
                    gender: gender,
                    firstLanguage: firstLanguage,
                    secondLanguage: secondLanguage,
                    designation: designation
                };
                this.render(this.CT, magpie);
            });
        },

        // Step 2: Show passage with spotlight blur
        render: function(CT, magpie) {
            const trial = config.trials[CT];
            this.currentTrialMouseData = []; // Reset for new passage

            $('#main').html(`
                <div class='magpie-view'>
                    <h1>Reading Comprehension with Mouse Tracking</h1>
                    <h2>${trial.title}</h2>
                    <canvas id="reading-canvas" width="800" height="400" style="border:1px solid #ccc;"></canvas>
                    <p><button id="finish-reading">I have finished reading</button></p>
                </div>
            `);

            const canvas = document.getElementById("reading-canvas");
            const ctx = canvas.getContext("2d");
            ctx.font = "18px Arial";
            ctx.textBaseline = "top";

            const words = trial.passage.split(" ");
            const lineHeight = 24;
            const margin = 20;
            const maxWidth = 760;

            let lines = [];
            let currentLine = words[0];
            for (let i = 1; i < words.length; i++) {
                const testLine = currentLine + " " + words[i];
                if (ctx.measureText(testLine).width < maxWidth) {
                    currentLine = testLine;
                } else {
                    lines.push(currentLine);
                    currentLine = words[i];
                }
            }
            lines.push(currentLine);

            let wordPositions = [];
            let y = margin;
            for (let line of lines) {
                let x = margin;
                for (let word of line.split(" ")) {
                    let width = ctx.measureText(word).width;
                    wordPositions.push({ word, x, y, width, top: y, left: x, bottom: y + lineHeight, right: x + width });
                    x += width + ctx.measureText(" ").width;
                }
                y += lineHeight;
            }

            function drawBlur(mouseX, mouseY) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "rgba(0,0,0,0.6)";
                for (let wp of wordPositions) {
                    ctx.save();
                    ctx.filter = "blur(3px)";
                    ctx.fillText(wp.word, wp.x, wp.y);
                    ctx.restore();
                }

                for (let wp of wordPositions) {
                    if (mouseX >= wp.x && mouseX <= wp.x + wp.width && mouseY >= wp.y && mouseY <= wp.y + lineHeight) {
                        ctx.fillStyle = "black";
                        ctx.fillText(wp.word, wp.x, wp.y);
                    }
                }
            }

            drawBlur(-100, -100);
            const startTime = Date.now();

            canvas.addEventListener("mousemove", (e) => {
                const rect = canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                let insideWord = "";
                let wordPos = {};
                
                for (let wp of wordPositions) {
                    if (mouseX >= wp.x && mouseX <= wp.x + wp.width && mouseY >= wp.y && mouseY <= wp.y + lineHeight) {
                        insideWord = wp.word;
                        wordPos = { top: wp.top, left: wp.left, bottom: wp.bottom, right: wp.right };
                        break;
                    }
                }
                
                this.currentTrialMouseData.push({
                    time: Date.now() - startTime,
                    x: mouseX,
                    y: mouseY,
                    word: insideWord,
                    wordPos: wordPos,
                    itemId: trial.id
                });
                
                drawBlur(mouseX, mouseY);
            });

            $('#finish-reading').on('click', () => {
                // Calculate cognitive load metrics for this passage
                const metrics = this.calculateMetrics(this.currentTrialMouseData, trial.id);
                if (metrics) {
                    this.allMouseData.push(metrics);
                }
                this.showQuestions(trial, magpie);
            });
        },

        // Step 3: Questions (with response logging)
        showQuestions: function(trial, magpie) {
            let questionIndex = 0;
            let score = 0;
            const total = trial.questions.length;

            const renderQuestion = () => {
                if (questionIndex < total) {
                    $('#main').html(`
                        <div class='magpie-view'>
                            <h2>${trial.title}</h2>
                            <p><b>Question ${questionIndex + 1} of ${total}</b></p>
                            <p>${trial.questions[questionIndex].question}</p>
                            <button class="answer-btn" data-answer="True">TRUE</button>
                            <button class="answer-btn" data-answer="False">FALSE</button>
                        </div>
                    `);

                    $('.answer-btn').on('click', (e) => {
                        const ans = $(e.target).data('answer');
                        const correct = trial.questions[questionIndex].correct;

                        this.allResponses.push({
                            passageId: trial.id,
                            passageTitle: trial.title,
                            questionIndex: questionIndex + 1,
                            questionText: trial.questions[questionIndex].question,
                            response: ans,
                            correctAnswer: correct,
                            isCorrect: ans === correct ? 1 : 0
                        });

                        if (ans === correct) {
                            score++;
                        }
                        questionIndex++;
                        renderQuestion();
                    });

                } else {
                    this.totalScore += score;
                    this.CT++;
                    if (this.CT < this.trials.length) {
                        this.render(this.CT, magpie);
                    } else {
                        this.showFinalResults();
                    }
                }
            };
            renderQuestion();
        },

        // Step 4: Final results CSV with cognitive load metrics
        showFinalResults: function() {
            // Create comprehensive CSV with cognitive load metrics
            let csv = "Name,RegNo,Age,Gender,FirstLanguage,SecondLanguage,Designation,TotalScore\n";
            csv += `"${this.demographics.name}","${this.demographics.regNo}",${this.demographics.age},"${this.demographics.gender}","${this.demographics.firstLanguage}","${this.demographics.secondLanguage}","${this.demographics.designation}",${this.totalScore}\n\n`;

            // Add question responses
            csv += "--- Question Responses ---\n";
            csv += "PassageId,PassageTitle,QuestionIndex,QuestionText,Response,CorrectAnswer,IsCorrect\n";
            this.allResponses.forEach((resp) => {
                csv += `${resp.passageId},"${resp.passageTitle}",${resp.questionIndex},"${resp.questionText.replace(/"/g, '""')}",${resp.response},${resp.correctAnswer},${resp.isCorrect}\n`;
            });

            // Add cognitive load metrics - THIS IS THE KEY PART YOU WANTED
            csv += "\n--- Cognitive Load Metrics ---\n";
            csv += "ItemId,n_samples,total_time_ms,initiation_time_ms,path_length,avg_speed,max_deviation,auc_deviation,dwell_time_s_approx,hesitation_count\n";
            this.allMouseData.forEach((metrics) => {
                csv += `${metrics.ItemId},${metrics.n_samples},${metrics.total_time_ms},${metrics.initiation_time_ms},${metrics.path_length},${metrics.avg_speed},${metrics.max_deviation},${metrics.auc_deviation},${metrics.dwell_time_s_approx},${metrics.hesitation_count}\n`;
            });

            // Download CSV locally
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);

            $('#main').html(`
                <div class='magpie-view'>
                    <h2>Final Results</h2>
                    <p><b>Total Score:</b> ${this.totalScore} out of ${this.trials.length * 3}</p>
                    <a id="download" href="${url}" download="cognitive_load_results.csv">Download Cognitive Load Results (CSV)</a>
                    <p>Results include all the cognitive load metrics you requested!</p>
                    <br><br>
                    <h3>Metrics Captured:</h3>
                    <ul>
                        <li>ItemId - Passage identifier</li>
                        <li>n_samples - Number of mouse position samples</li>
                        <li>total_time_ms - Total reading time in milliseconds</li>
                        <li>initiation_time_ms - Time to start meaningful movement</li>
                        <li>path_length - Total distance mouse traveled</li>
                        <li>avg_speed - Average mouse movement speed</li>
                        <li>max_deviation - Maximum deviation from ideal path</li>
                        <li>auc_deviation - Area under curve of path deviations</li>
                        <li>dwell_time_s_approx - Time spent hovering over words</li>
                        <li>hesitation_count - Number of pauses/hesitations</li>
                    </ul>
                </div>
            `);

            // Send to Google Sheet
            fetch(GOOGLE_SHEET_URL, {
                method: "POST",
                body: JSON.stringify({
                    demographics: this.demographics,
                    responses: this.allResponses,
                    cognitiveLoadMetrics: this.allMouseData,
                    totalScore: this.totalScore
                }),
                headers: { "Content-Type": "application/json" }
            }).then(() => console.log("Results sent to Google Sheet"))
              .catch(err => console.error("Error sending to Google Sheet:", err));
        }
    };

    return view;
};