//heading to display the section
const sectionHeading = document.getElementById("current_section");
sectionHeading.innerHTML = sections[section_index].secName;


//add SectionBtn
const addSectionBtn = (section_id,index)=>{
    var button = document.createElement('input');
    button.type = 'button';
    button.id = "sec_"+section_id;
    button.className = "section_btn";
    button.value =sections[index].secName;
    button.onclick = () => {
changeSection(index)
    }
    let container = document.getElementById('section_box');
    container.appendChild(button);
}

// change section data
const changeSection = (index)=>{
    //set section question List to count section wise //before updating ui seve 
    sections[section_index].questionList = questiondata;
          
    //set section index to new index that will be open
    section_index = index;
  
    sectionHeading.innerHTML = sections[section_index].secName;
  
  
    questiondata = sections[index].questionList;
    current_q_index = 0;
    //clear Question Count Button
    let seq_box = document.getElementById('seq_box');
    while (seq_box.firstChild) {
        seq_box.removeChild(seq_box.firstChild);
    }
  
  
    //set Question button
    questiondata.map((value, index) => {
        addButton(index)
    });
    // by defult 1st qustion will be dispayed of section
    questionDisplay(current_q_index);
  }


//add Question Count Button
const addButton = (q_index) => {
    let button = document.createElement('a');
    button.id = q_index;
    button.innerHTML = q_index+1;
    button.className="seq_btn";
    button.onclick = () => {
        questionDisplay(q_index);
    }
    let seq_box = document.getElementById('seq_box');
    seq_box.appendChild(button);
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
        q_status_btn.className = "seq_btn "+value.status;

    });

     //to get unanswer we have to minus ans and review and ans
     qstatus.unanswer = qstatus.seen-qstatus.answer-qstatus.review_answer;
     qstatus.unseen = questiondata.length-qstatus.seen;
  
     //update question status UI
     document.getElementById("qs_asnwer").innerHTML = qstatus.answer;
     document.getElementById("qs_review_asnwer").innerHTML = qstatus.review_answer;
     document.getElementById("qs_review_unasnwer").innerHTML = qstatus.review_unanswer;
     document.getElementById("qs_unanswer").innerHTML = qstatus.unanswer;
     document.getElementById("qs_seen").innerHTML = qstatus.seen;
     document.getElementById("qs_unseen").innerHTML = qstatus.unseen;


    console.clear()
    console.log(
    `
    Seen : ${qstatus.seen}
    UnSeen : ${qstatus.unseen} 
    Answer :  ${qstatus.answer} 
    Seen & Un-Answer :  ${qstatus.unanswer} 
    Review & Answer :  ${qstatus.review_answer} 
    Review & Un-Answer :  ${qstatus.review_unanswer} 
    Total Ans :  ${qstatus.review_answer+qstatus.answer} 
    Total Review  :  ${qstatus.review_unanswer+qstatus.review_answer} 
    `);
    
}

  // updateding radio btn to default means null
  const clearResponse = ()=>{
    let radiobtn = document.forms.radio_group.radio;
    var r = 0;
    while (r < radiobtn.length) {
        radiobtn[r].checked = false;
        r++;
    }
  }


// Question to be dislay
const questionDisplay = (q_index) => {
    //set Current Question to qid
    current_q_index = q_index;
    qid = questiondata[q_index].qid;

    // updateing radio btn to default means null
    clearResponse();

    // write code to display question 
    let question_opt = questiondata[current_q_index];

    document.getElementById('question').innerHTML = question_opt.q_name;
    document.getElementById('question_no').innerHTML = "Question No. "+(q_index+1);

    // display the options
    document.getElementById('opt_A').innerHTML = question_opt.opt_A;
    document.getElementById('opt_B').innerHTML = question_opt.opt_B;
    document.getElementById('opt_C').innerHTML = question_opt.opt_C;
    document.getElementById('opt_D').innerHTML = question_opt.opt_D;

    //check the ans is saved if yes to show it
    let radiobtn = document.forms.radio_group.radio;
    switch (question_opt.response) {
        case "A":
            radiobtn[0].checked = true;
            break;
        case "B":
            radiobtn[1].checked = true;
            break;
        case "C":
            radiobtn[2].checked = true;
            break;
        case "D":
            radiobtn[3].checked = true;
            break;
    }

    //set question as Seen by defualt its open
    updateQuestionSatus('seen', qid);
}


// by defult 1st qustion will be dispayed
questionDisplay(current_q_index);


//check the Ans is Given or Not
const checkAnsGiven = () => {
    var radios = document.getElementsByName("radio");
    var i = 0;
    while ( i < radios.length) {
        if (radios[i].checked)
        {
            return radios[i].value;
        } 
        i++;
    }
    return false;
    
}

// saving the response given by the student

const saveResponse = (opt_value)=>{
    questiondata[current_q_index].response = opt_value;
    // save to data base in asyn ways 

    

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
       if(section_index < sections.length-1){
        changeSection(section_index+1)
       } 
      else{
        console.log("Last Question of Last Section")
      } 
      
       
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
    
    if (!ans_status_boolen) {
        updateQuestionSatus("seen", questiondata[current_q_index].qid);
    }
    else {
        updateQuestionSatus("answer", questiondata[current_q_index].qid);
        //save the response 
        saveResponse(ans_status_boolen);
    }
   nextBtn();
}

//revieNext Btn ONclick
const reviewNextBtn = () => {
    let ans_status_boolen = checkAnsGiven();
    if (!ans_status_boolen) {
        updateQuestionSatus("review_unanswer", questiondata[current_q_index].qid);
    }
    else {
        updateQuestionSatus("review_answer", questiondata[current_q_index].qid);
        //save the response 
        saveResponse(ans_status_boolen);
        
    }
    nextBtn();
}


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

Total UnAns :       ${(totalQS.seen + totalQS.unseen) - (totalQS.review_answer+totalQS.answer)}

Total Review  :     ${totalQS.review_unanswer+totalQS.review_answer}

        `)
}
