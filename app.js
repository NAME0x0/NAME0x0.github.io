const microphoneButton = document.getElementById('openMicButton'); // Update this if you added the new button

microphoneButton.addEventListener('click',function(){
    window.open(
        'backend/index1.html',
        "",
        "width=280px,height=280px"
    );
});


