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

let usercheck = [];
let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  myVideoStream = stream;
  console.log("Stream My video");
  
  addVideoStream( stream,CandidateMainData)
  myPeer.on('call', call => {
   
    call.answer(stream)
    console.log("   call.answer(stream)");
    
  })

  //mute by default
  myVideoStream.getAudioTracks()[0].enabled = false;
  

  socket.on('user-connected', user => {
    connectToNewUser(user, stream)
    console.log("user-connected",user);
  })
  // input value
  let text = $("input");
  // when press enter send message
  $('html').keydown(function (e) {
    if (e.which == 13 && text.val().length !== 0) {
      socket.emit('message', text.val());
      console.log("message-sent");
      text.val('')
    }
  });
 
  socket.on("createMessage", message => {
    console.log("message-recived",message);
    $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
    scrollToBottom()
  })
})



//candidate
socket.on("getControlEvent",params =>{
  console.log("getControlEvent:",params);
  alert(params);
})


// 1 First join room 
myPeer.on('open', id => {
  
  socket.emit('join-room', ROOM_ID, CandidateMainData)
  console.log("peer open join-room :",id,"proctor",CandidateMainData);
})

function connectToNewUser(user, stream) {
  options = {metadata:user};
  console.log(options);
  
   
const call = myPeer.call(user.userId, stream,options)  


  peers[user.userId] = call
}

function addVideoStream(stream,candidateData) {
  console.log("addVideosStram",candidateData);
}

//candidate
const userEvent = () => {
 
  let controlData = { 'userId': CandidateMainData.userId,'event':"userEvent by "+CandidateMainData.userId }
  console.log('controlEvents',controlData)
  socket.emit('userEvent',controlData);
}

