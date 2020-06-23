var form = document.querySelector('form');


class VerifForm {

	construct(){
		this.formCompleted = false;  
	}

	surligne(champ, erreur)
	{
   		if(erreur)
      			champ.style.backgroundColor = "#fba";
		else
      			champ.style.backgroundColor = "";
	} 

	verifEmail(champ)
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

	verifPassword(champ)
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

	verifConfirmPassword(champ)
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

	verifFinal(f)
	{
   		var emailOk = this.verifEmail(f.email);
   		var passwordOk = this.verifPassword(f.password);
   		var confirmPasswordOk = this.verifConfirmPassword(f.confirmPassword);

		console.log(this.formCompleted);

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

	eventListenerHandler()
	{
		var word = document.querySelector('#password');
		var email = document.querySelector('#email');
		var confirmPassword = document.querySelector('#confirmPassword');
		if (this.formCompleted) {
		    this.formCompleted = false;
			console.log('envoi form');/*
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
					// save webtoken in the browser
					// and make sur that is not lose if user reload page
				})
				.catch(e => console.log(e))*/
		}
		else {
			console.log('fom incomplet pas d\'envoi');
		}
	}
}

var verifForm = new VerifForm;

verifForm.formCompleted = true; // pb here as the property est modifiable...

console.log(verifForm.formCompleted);

form.addEventListener('submit', (event) => {
	event.preventDefault();
	verifForm.eventListenerHandler();
})














































/*var formCompleted = false;

function surligne(champ, erreur)
{
   if(erreur)
      champ.style.backgroundColor = "#fba";
   else
      champ.style.backgroundColor = "";
}

function verifEmail(champ)
{
   var regex = /^[a-zA-Z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/;
   if(!regex.test(champ.value))
   {
      surligne(champ, true);
      return false;
   }
   else
   {
      surligne(champ, false);
      return true;
   }
}

function verifPassword(champ)
{
   if(champ.value.length < 2 || champ.value.length > 25)
   {
      surligne(champ, true);
      return false;
   }
   else
   {
      surligne(champ, false);
      return true;
   }
}

function verifConfirmPassword(champ)
{
   var password = document.querySelector('#password');
   if(champ.value !== password.value)
   {
      surligne(champ, true);
      return false;
   }
   else
   {
      surligne(champ, false);
      return true;
   }
}

function verifForm(f)
{
   var emailOk = verifEmail(f.email);
   var passwordOk = verifPassword(f.password);
   var confirmPasswordOk = verifConfirmPassword(f.confirmPassword);
   
   if(emailOk && passwordOk && confirmPasswordOk)
   {
      formCompleted = true;	
      return true;
   } 
   else
   {
      alert("Veuillez remplir correctement tous les champs");
      return false;
   }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    var password = document.querySelector('#password');
    var email = document.querySelector('#email');
    var confirmPassword = document.querySelector('#confirmPassword');
    if (formCompleted) {
	formCompleted = false;
	    console.log('envoi form');
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
			    // save webtoken in the browser
			    // and make sur that is not lose if user reload page
		    })
		    .catch(e => console.log(e))
    }
    else {
	    console.log('fom incomplet pas d\'envoi');
    }
    })*/
