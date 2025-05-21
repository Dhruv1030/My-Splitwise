from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import UserRegisterForm # This form needs to exist or be created

# Placeholder for UserRegisterForm if it's missing, to avoid import error
# If forms.py is also missing/incorrect, it will need to be fixed too.
try:
    from .forms import UserRegisterForm
except ImportError:
    from django import forms
    from django.contrib.auth.forms import UserCreationForm
    class UserRegisterForm(UserCreationForm): # Basic fallback
        email = forms.EmailField()
        class Meta(UserCreationForm.Meta):
            fields = UserCreationForm.Meta.fields + ('email',)


def register(request):
    if request.method == 'POST':
        form = UserRegisterForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f'Account created for {username}!')
            # Assuming 'login' is a valid URL name
            return redirect('login')
    else:
        form = UserRegisterForm()
    # Assuming 'users/register.html' template exists
    return render(request, 'users/register.html', {'form': form})
