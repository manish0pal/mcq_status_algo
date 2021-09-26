const socket = io('https://zestech.herokuapp.com')

const CandidateMainData = {
  userId:testinguserID,
  candidateId:testinguserID,
  candiName:"Manish",
  videoId:"vdo"+testinguserID,
  examStatus:"Active",
  ipAddress:"192.165.15.01",
  timeRemening:"30 min",
  faceStatus:"Single Face Dected",
  windowStatus:"Full Screen"
}

const myPeer = new Peer(CandidateMainData.userId, {
  
  path: '/peerjs',
  host: 'zestech.herokuapp.com',
  port: '443'
})


let myVideoStream;

socket.on("createMessage", message => {
  console.log("message-recived",message);
  $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
  scrollToBottom()
})

//candidate
socket.on("getControlEvent",params =>{
  console.log("getControlEvent:",params);
  alert(params);
})

socket.emit('join-room', ROOM_ID, CandidateMainData)
console.log("peer open join-room :",ROOM_ID,"proctor",CandidateMainData);


// 1 First join room 
myPeer.on('open', id => {
  console.log("peer open join-room :",id,"proctor",CandidateMainData);
});

function streamMyVdo(){
  navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
  }).then(stream=>{
    myVideoStream = stream;
    console.log("Stream My video");

    myPeer.on('call',call=>{
      call.answer(stream)
    })
  })
}

streamMyVdo();

function addVideoStream(stream,candidateData) {
  console.log("addVideosStram",candidateData);
}

//candidate
const userEvent = () => {
 
  let controlData = { 'userId': CandidateMainData.userId,'event':"userEvent by "+CandidateMainData.userId }
  console.log('controlEvents',controlData)
  socket.emit('userEvent',controlData);
}
