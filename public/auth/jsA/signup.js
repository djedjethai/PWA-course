class VerifForm {

	construct(){
		this.formCompleted = false;  
	}

	static surligne(champ, erreur)
	{
   		if(erreur)
      			champ.style.backgroundColor = "#fba";
		else
      			champ.style.backgroundColor = "";
	} 

	static verifEmail(champ)
	{
   		var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
   		if(!regex.test(champ.value))
   		{
      			this.surligne(champ, true);
      			return false;
   		}
   		else
   		{
      			this.surligne(champ, false);
      			return true;
   		}
	}

	static verifPassword(champ)
	{
   		if(champ.value.length < 2 || champ.value.length > 25)
   		{
      			this.surligne(champ, true);
      			return false;
   		}
   		else
   		{
      			this.surligne(champ, false);
      			return true;
   		}
	}

	static verifConfirmPassword(champ)
	{
   		var password = document.querySelector('#password');
   		if(champ.value !== password.value)
   		{
      			this.surligne(champ, true);
      			return false;
   		}
   		else
   		{
      			this.surligne(champ, false);
      			return true;
   		}
	}

	static verifFinal(f)
	{
   		var emailOk = this.verifEmail(f.email);
   		var passwordOk = this.verifPassword(f.password);
   		var confirmPasswordOk = this.verifConfirmPassword(f.confirmPassword);

   		if(emailOk && passwordOk && confirmPasswordOk)
   		{
			this.formCompleted = true;
			return true;
   		} 
   		else
   		{
      			alert("Veuillez remplir correctement tous les champs");
      			return false;
   		}
	}

	static eventListenerHandler()
	{
		var word = document.querySelector('#password');
		var email = document.querySelector('#email');
		var confirmPassword = document.querySelector('#confirmPassword');
			
		if (this.formCompleted) {
		    this.formCompleted = false;
						
		    const formData = {
				email: email.value,
				password: password.value,
				confirmPassword: confirmPassword.value
		    }; 
		    fetch('http://localhost:3000/auth/authSignup',{
			    method:'POST',
			    body:JSON.stringify(formData),
			    headers: {'Content-type':'application/json'}
		    	})
			.then(res => {
				return res.json()
				// save webtoken in the browser
				// and make sur that is not lose if user reload page
			})
			.then(response => {
				if (response.token) {
					localStorage.setItem('token', response.token);
					localStorage.setItem('userId', response._id);
					const remainingMilliseconds = 60 * 60 * 1000;
        				const expiryDate = new Date(
        				  new Date().getTime() + remainingMilliseconds
        				);
        				localStorage.setItem('expiryDate', expiryDate.toISOString());
					window.location.replace("http://localhost:8080/app.html");
					// redirection to the main page
				} else {
					console.log(response);
				}
			})
			.catch(e => console.log(e));
		} else {
			console.log('pas d envoi');
		}
	}
}

var form = document.querySelector('form');
form.addEventListener('submit', (event) => {
	event.preventDefault();
	VerifForm.eventListenerHandler();
});


