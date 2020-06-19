var form = document.querySelector('form');

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
      return true;
   else
   {
      alert("Veuillez remplir correctement tous les champs");
      return false;
   }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    // var password = document.querySelector('#password');
    // var email = document.querySelector('#email');
    // var confirmPassword = document.querySelector('#confirmPassword');

    console.log('envoi bloque form ras');
})