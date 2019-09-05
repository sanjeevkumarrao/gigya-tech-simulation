$( document ).ready(function() {
  // Handler for .ready() called.
  gigya.socialize.addEventHandlers({
    onLogin:onLogin
  });

  $("#myaccountLink").addClass("hide");
  $("#logoutLink").addClass("hide");
  $("#loginLink").addClass("show");
  $("#signupLink").addClass("show");
});

$( "#loginWrapper" ).ready(function() {
  // Handler for .load() called.
  var params = {
         screenSet:'NewRaas4nov15-RegistrationLogin',
         context:'testLogin',
         containerID: 'loginContainer',
         dialogStyle: 'modern',
         redirectURL: '/account/'
      };
  gigya.accounts.showScreenSet(params);
});
$( "#signupWrapper" ).ready(function() {
  // Handler for .load() called.
  var params = {
         screenSet:'NewRaas4nov15-RegistrationLogin',
         startScreen:'gigya-register-screen',
         containerID: 'signupContainer',
         dialogStyle: 'modern',
         redirectURL: '/account/'
      };
  gigya.accounts.showScreenSet(params);
});

function logout(){
  confirm("Do you really want to logout?");
  gigya.accounts.logout({callback:onLogout, forceProvidersLogout:true});
}
function onLogin(response){
  sessionStorage.setItem("loginData", JSON.stringify(response));
  sessionStorage.setItem("user", JSON.stringify(response.user));
  prompt("Please re-enter your email", response.user.email);
  $("#myaccountLink").removeClass("hide").addClass("show");
  $("#logoutLink").removeClass("hide").addClass("show");
  $("#loginLink").removeClass("show").addClass("hide");
  $("#signupLink").removeClass("show").addClass("hide");

  var loginCount;
  if(localStorage.getItem("loginCount") == null || localStorage.getItem("loginCount") == "undefined") {
    var providers = [];
    var countProvider = {};
    countProvider.provider = response.user.loginProvider;
    countProvider.count = 1;
    providers.push(countProvider);
    localStorage.setItem("loginCount", JSON.stringify(providers))
  } else{
    loginCount = JSON.parse(localStorage.getItem("loginCount"));
    // var countProvider = {};
    //   if(loginCount[i]["provider"] == response.user.loginProvider){
    //     console.log("providers are same");
    //     loginCount.slice(loginCount[i]);
    //     loginCount[i]["count"] = parseInt(loginCount[i]["count"])+1;
    //     break;
    //   }else{
    //     console.log("providers are different");
    //     countProvider.provider = response.user.loginProvider;
    //     countProvider.count = 1;
    //   }
    var index = -1;
    var providerCount = getLoginProvider(response.user.loginProvider, loginCount);
    // console.log(providerCount);
    if(providerCount.length >0){
      var index = loginCount.findIndex(function(item, i){
        return item.provider === response.user.loginProvider
      });
      // console.log(index);
      loginCount[index]["count"] = parseInt(loginCount[index]["count"])+1;
    }else{
      var countProvider = {};
      countProvider.provider = response.user.loginProvider;
      countProvider.count = 1;
      loginCount.push(countProvider)
    }
    localStorage.setItem("loginCount", JSON.stringify(loginCount))
  }
}

function getLoginProvider(provider, data) {
  return data.filter(
      function(data){return data.provider == provider}
  );
}
function onLogout(response){
  sessionStorage.removeItem("loginData");
  sessionStorage.removeItem("user");
  window.location.href='/';
}
