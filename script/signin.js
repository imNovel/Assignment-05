document.getElementById("signin-btn").addEventListener('click', function(){
    const inputUser = document.getElementById("input-username");
    const userName = inputUser.value;

    const inputPass = document.getElementById("input-pass");
    const password = inputPass.value;

    if(userName == 'admin' && password == 'admin123'){
        alert("Sign In Successful");
        window.location.assign("./home.html");
    }else{
        alert("Wrong Username/Password");
        return;
    }
})