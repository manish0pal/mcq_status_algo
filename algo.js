//add SectionBtn
const addSectionBtn = (section_id,index)=>{
    var button = document.createElement('input');
    button.type = 'button';
    button.id = "sec_"+section_id;
    button.value ="Section "+ (index+1);
    button.onclick = () => {

        //set section question List to count section wise //before updating ui seve 
        sections[section_index].questionList = questiondata;
        
        //set section index to new index that will be open
        section_index = index;

        sectionHeading.innerHTML = "Section Id: " +sections[section_index].secId;


        questiondata = sections[index].questionList;
        current_q_index = 0;
        //clear Question Count Button
        let container = document.getElementById('container');
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }


        //set Question button
        questiondata.map((value, index) => {
            addButton(index)
        });
        // by defult 1st qustion will be dispayed of section
        questionDisplay(current_q_index);
    }
    var container = document.getElementById('section');
    container.appendChild(button);
}



//add Question Count Button
const addButton = (q_index) => {
    var button = document.createElement('input');
    button.type = 'button';
    button.id = q_index;
    button.value = q_index+1;
    button.onclick = () => {
        questionDisplay(q_index);
    }
    var container = document.getElementById('container');
    container.appendChild(button);
}




//set Section Button
sections.map((value,index)=>{
    addSectionBtn(value.secId,index)
});

//set Question button
questiondata.map((value, index) => {

    addButton(index)
});



// Update Question Status // and also add the count
const updateQuestionSatus = (status, qid) => {

    //set question_Status to 0 
    qstatus.seen = 0;
    qstatus.answer = 0;
    qstatus.review_unanswer = 0;
    qstatus.review_answer = 0;
   

    
    questiondata.map((value, index) => {

        //firstly update satus
        if (value.qid === qid) {
            // only if seen
            if (status === 'seen' && value.status === null) {
                value.status = status;
            }
            else if (status != 'seen') {
                value.status = status;
            }
        }
        //update question status value
       
        switch (value.status) {
            case 'seen':
                qstatus.seen = qstatus.seen + 1;
                break
            case 'answer':
                qstatus.seen = qstatus.seen + 1;
                qstatus.answer = qstatus.answer + 1;
                break
            case 'review_unanswer':
                qstatus.seen = qstatus.seen + 1;
                qstatus.review_unanswer = qstatus.review_unanswer + 1 ;
                break
            case 'review_answer':
                qstatus.seen = qstatus.seen + 1;
                qstatus.review_answer = qstatus.review_answer + 1;
              
                break
        }

        //update Ui of buttons

        let q_status_btn = document.getElementById(index);
        q_status_btn.className = value.status;



    });

     //to get unanswer we have to minus ans and review and ans
     qstatus.unanswer = qstatus.seen-qstatus.answer-qstatus.review_answer;
     qstatus.unseen = questiondata.length-qstatus.seen;
    document.getElementById("review_text").innerHTML =
    `
    <table>
    <tr><td>Seen :</td><td>${qstatus.seen}</td></tr>
    <tr class="unseen"><td> UnSeen :</td><td> ${qstatus.unseen} </td></tr>
    <tr class="answer"><td>Answer : </td><td> ${qstatus.answer} </td></tr>
    <tr><td>Seen & Un-Answer : </td><td> ${qstatus.unanswer} </td></tr>
    <tr class="review_answer"><td>Review & Answer : </td><td> ${qstatus.review_answer} </td></tr>
    <tr class="review_unanswer"><td>Review & Un-Answer : </td><td> ${qstatus.review_unanswer} </td></tr>
    <tr class="total"><td>Total Ans : </td><td> ${qstatus.review_answer+qstatus.answer} </td></tr>
    <tr class="total"><td>Total Review  : </td><td> ${qstatus.review_unanswer+qstatus.review_answer} </td></tr>
    </table>
    `;
    //console.log("question Status:", )
}

// Question to be dislay
const questionDisplay = (q_index) => {
    //set Current Question to qid
    current_q_index = q_index;
     qid = questiondata[q_index].qid;

    // updateing radio btn to default means null
    let radiobtn = document.forms.radio_group.radio;
    var r = 0;
    while (r < radiobtn.length) {
        radiobtn[r].checked = false;
        r++;
    }


    // write code to display question 
    document.getElementById('h_qid').innerHTML = qid;



    //set question as Seen by defualt its open
    updateQuestionSatus('seen', qid);

}

// by defult 1st qustion will be dispayed
questionDisplay(current_q_index);


//check the Ans is Given or Not
const checkAnsGiven = () => {
    var radios = document.getElementsByName("radio");
    var formValid = false;

    var i = 0;
    while (!formValid && i < radios.length) {
        if (radios[i].checked) formValid = true;
        i++;
    }
    return formValid;
}
// 2 bar use ho rha tha islye funtion bna diya ke change karne me easy ho
const nextBtn = ()=>{
    //check for the next data available or not
    if (current_q_index < questiondata.length-1) {
        current_q_index++;
        questionDisplay(current_q_index)
   }
   //go to next 
   else {
       // this question is Last Question
       console.log("Last Question")
      
       
   }
   }
   //previsod Btn ONclick
   const previosBtn = () => {
       if(current_q_index !=0){
        current_q_index--;
        questionDisplay(current_q_index)
       }
       else{
           console.log("First Question")
       }
  
   }

// save and next btn onclick
const saveNextBtn = () => {
    let ans_status_boolen = checkAnsGiven();
    if (ans_status_boolen) {
        updateQuestionSatus("answer", questiondata[current_q_index].qid);
    }
    else {
        updateQuestionSatus("seen", questiondata[current_q_index].qid);
    }
   nextBtn();

}

//revieNext Btn ONclick
const reviewNextBtn = () => {
    let ans_status_boolen = checkAnsGiven();
    if (ans_status_boolen) {
        updateQuestionSatus("review_answer", questiondata[current_q_index].qid);
    }
    else {
        updateQuestionSatus("review_unanswer", questiondata[current_q_index].qid);
    }
    nextBtn();
}


const totalReview= ()=>{
    //total Question Status
    let total_question_count = 0;
    const totalQS = {
        seen : 0,
        answer : 0,
        review_unanswer : 0,
        review_answer : 0
    }

    sections.map((val,index)=>{

        val.questionList.map((value,index)=>{
            total_question_count++;
            switch (value.status) {
                case 'seen':
                    totalQS.seen = totalQS.seen + 1;
                    break
                case 'answer':
                    totalQS.seen = totalQS.seen + 1;
                    totalQS.answer = totalQS.answer + 1;
                    break
                case 'review_unanswer':
                    totalQS.seen = totalQS.seen + 1;
                    totalQS.review_unanswer = totalQS.review_unanswer + 1 ;
                    break
                case 'review_answer':
                    totalQS.seen = totalQS.seen + 1;
                    totalQS.review_answer = totalQS.review_answer + 1;
                  
                    break
            }
        })
       
    })
     //to get unanswer we have to minus ans and review and ans
     totalQS.unanswer = totalQS.seen-totalQS.answer-totalQS.review_answer;
     totalQS.unseen = total_question_count-totalQS.seen;

    console.log( `
Seen :              ${totalQS.seen}

UnSeen :            ${totalQS.unseen}

Answer :            ${totalQS.answer}

Seen & Un-Answer :  ${totalQS.unanswer}

Review & Answer :   ${totalQS.review_answer}

Review & Un-Answer :${totalQS.review_unanswer}

Total Ans :         ${totalQS.review_answer+totalQS.answer}

Total Review  :     ${totalQS.review_unanswer+totalQS.review_answer}

        `)
}