const readCookie = name => {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }
  
const createCookie = (name,value,days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

const deleteCookie = name => {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

const googleInit = () => {
    gapi.load('auth2', () => {
        auth2 = gapi.auth2.init({
          client_id: '996980834258-13kpeq43hg6cc0qb21k68v9ooahs56vj.apps.googleusercontent.com',
          fetch_basic_profile: false,
          scope: 'email profile openid'});
        });
}

const isLoggedIn = () => readCookie("logged_in") === "true";

const googleGetInfo = () => {
    if (auth2.isSignedIn.get()) {
      return auth2.currentUser.get().getBasicProfile();
    }
}

function googleLogin(){
	// Sign the user in, and then retrieve their ID.
	auth2.signIn().then(function() {
        var profile = googleGetInfo();
        let userName = profile.getName();
        let userPhoto = profile.getImageUrl();

        // Store response into app cookie
        createCookie("logged_in", true, 30);
        createCookie("userName",userName,30);
        createCookie("userPhoto", userPhoto, 30);

        window.location.href = "/coolprofile/profile.html";        
	});
}

const isprofilePage = () => window.location.pathname.replace("/coolprofile","") === "/profile.html";

const logout = () => {
    createCookie("logged_in");
    createCookie("userName");
    createCookie("userPhoto");
    window.location.href = "/coolprofile/index.html";
}

window.onload = () => {

    if(isLoggedIn()){
        if(isprofilePage()){
            let userName = readCookie("userName");
            let userPhoto = readCookie("userPhoto");

            document.getElementById("profile-name").innerHTML= userName;
            document.getElementById("profile-img").src = userPhoto;

            document.body.style.display = "block";
        }else{
            window.location.href = "/coolprofile/profile.html";
        }
    }else{
        if(isprofilePage()){
            window.location.href = "/coolprofile/index.html";
        }
    }
};