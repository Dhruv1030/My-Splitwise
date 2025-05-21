from django.shortcuts import render

def welcome(request):
    return render(request, 'SplitEase/welcome.html')
